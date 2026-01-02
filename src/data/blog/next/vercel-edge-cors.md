---
title: Vercel 배포 시 CORS 및 Cookie 설정
description: "배포된 서비스에 Cookie 인증 도입하면서 문제 직면 및 해결과정"
pubDatetime: 2025-12-31
modDatetime: 2025-12-31
author: Jaemin
tags:
  - Nextjs
  - Vercel
  - CORS
  - serverless
featured: false
draft: false
ogImage: "#"
canonicalURL: ""
hideEditPost: false
timezone: Asia/Seoul
---

## ☁ GraphQL Proxy 인증 구현 (CORS & Cookie 문제 해결)

### ⛅ 문제 상황

#### 배포 환경

- 백엔드: `bbserver-beryl.vercel.app` (NestJS GraphQL)
- 프론트엔드: `budget-book-bbclient.vercel.app` (Next.js 15)

#### 발생한 문제

1. **크로스 도메인 쿠키 문제**
   - 백엔드에서 `Set-Cookie`로 JWT 토큰 설정 했지만,
   - 쿠키가 백엔드 도메인에만 저장되고 있어서
   - 프론트엔드 미들웨어가 쿠키 정보를 읽지 못하여
   - 로그인 성공 후 리다이렉트 실패 (라이프싸이클에서 로그인은 성공인데 쿠키 검증은 계속 실패해서 - 무한 새로고침 지옥에 빠졌다...)

2. **CORS 이슈**
   - 서로 다른 도메인 간 통신 제약
   - 쿠키 공유 불가능

### 해결 방법: Proxy로 중간 다리 만들어서 우회해주는 방법 선택 (Next.js API Route 프록시)

#### 원리

```bash
브라우저 ←→ Next.js API Route (/api/graphql) ←→ NestJS 백엔드
        (같은 도메인, CORS 없음)           (서버간 통신, CORS 없음)
```

- 브라우저는 자신의 도메인으로만 요청하게 하였으며
- Next.js 서버가 백엔드로 프록시 처리하고
- 쿠키를 프론트엔드에서 정상적으로 가져와 도메인에 설정

### ⛅ 구현 내용

#### 1. GraphQL 프록시 생성

**파일**: `~/src/app/api/graphql/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const backendUrl = process.env.GRAPHQL_BACKEND_URL;

  const response = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("cookie") || "",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  const nextResponse = NextResponse.json(data);

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    nextResponse.headers.set("Set-Cookie", setCookie);
  }

  return nextResponse;
}
```

#### 2. Apollo Client 수정

**파일**: `~/src/lib/apolloClient.ts`

```typescript
const httpLink = new HttpLink({
  uri: "/api/graphql", // 프록시 사용
  credentials: "include",
});
```

#### 3. 환경변수 설정

**로컬** (`.env.local`):

```env
GRAPHQL_BACKEND_URL=http://localhost:{PORT}/api/graphql
```

**프로덕션** (`.env.production.local` 또는 Vercel 환경변수):

```env
GRAPHQL_BACKEND_URL=https://{SERVICE-DOMAIN}/api/graphql
```

### 동작 흐름

#### 로그인 시나리오

1. 브라우저 → `POST /api/graphql` (로그인 mutation)
2. Next.js 프록시 → 백엔드로 요청 전달
3. 백엔드 → JWT 토큰 생성 및 응답
4. Next.js 프록시 → `Set-Cookie` 헤더를 프론트엔드 도메인에 설정
5. 브라우저 → 쿠키 저장 (프론트엔드 도메인)
6. 미들웨어 → 쿠키 읽기 성공

#### 이후 요청 (쿠키를 사용한 인증 프로세스)

- 브라우저가 자동으로 쿠키 포함 (`credentials: "include"`)
- 프록시가 쿠키를 백엔드로 전달
- 백엔드에서 JWT 검증

### 결과

✅ **CORS 문제 해결**: 브라우저는 같은 도메인으로만 요청  
✅ **쿠키 공유 가능**: 프론트엔드 도메인에 쿠키 저장  
✅ **미들웨어 작동**: 쿠키 읽기 성공  

### 성능 영향

- 추가 지연 (드라마틱한 수치는 아님)
- Vercel 자체적으로 최적화가 잘 되어있어서 부하 방지  
- 해당 프로젝트 정도의 규모에서는 영향 없는 수준 (대규모 서비스는 부하 있을 수 있음)

### 대안

장기적으로 **커스텀 도메인** 사용 고려:

> 도메인을 구매해서 통일 시켜주면 복잡한 설정들이나 우회 방안들을 생략할 수 있음

- `api.yourdomain.com` (백엔드)
- `app.yourdomain.com` (프론트엔드)
- `.yourdomain.com`에 쿠키 설정하여 서브도메인 간 공유
