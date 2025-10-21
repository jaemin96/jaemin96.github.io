---
title: 함수 파라미터 구조에 대한 고민
description: "함수 파라미터 순차 나열 구조와 객체 구조의 차이에 대하여"
pubDatetime: 2025-10-21
modDatetime: 2025-10-21
author: Jaemin
tags:
  - refactor
featured: false
draft: false
ogImage: "#"
canonicalURL: ""
hideEditPost: false
timezone: Asia/Seoul
---

### 개요

서비스 마이그레이션 및 리팩토링 과정에서,  
API 요청 시 파라미터를 전달하는 방식에 대해 의문이 생겼다.

나는 개인적으로 요청에 필요한 값들을 하나의 객체(`params`)로 묶어서 전달하는 방식을 선호한다.  
반면 기존 서비스는 파라미터를 순서대로 나열해서 전달하는 방식을 사용하고 있었다.

---

### 문제점: 순차적으로 파라미터 전달

파라미터가 1개나 2개일 때는 큰 문제가 없어 보이지만,  
4~5개 이상으로 늘어나면 함수의 의미를 파악하는 데 불필요한 분석 시간이 소요된다.

```typescript
const getData = async (p1: number, p2: number, p3: number, p4: number) => {
  await service(p1, p2, p3, p4);
};

getData(3, 2, 8, 15);
// 이 값들이 각각 어떤 데이터인지 한눈에 알기 어렵다.
```

이처럼 인자의 의미가 코드만으로 명확하지 않아  
협업 시 가독성 저하, 실수 유발, 유지보수 어려움 등의 문제가 생긴다.

게다가 파라미터 중간에 선택적인 매개변수가 추가되면 코드 복잡도가 급격히 상승한다.

```typescript
const getData = async (
  p1: number,
  a1?: string,
  p2: number,
  p3: number,
  p4: number
) => {
  if (a1) await service(p1, a1, p2, p3, p4);
  else await service(p1, p2, p3, p4);
};

getData(3, 2, 8, 15); // 선택적 매개변수가 생기면 호출 구조도 혼란스러워진다.
```

이런 식으로 인자 순서가 꼬이기 시작하면  
“a1이 꼭 필요한가? a1 굳이 필요없는데 빼고 어떻게 호출하지?” 같은 의문이 생기고,  
결국 유지보수성이 급격히 떨어진다.

---

### 개선안: 객체 형태로 파라미터 전달

객체 형태로 파라미터를 전달하면 문제를 단번에 해결할 수 있다.

```typescript
interface GetDataParams {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  a1?: string;
}

const getData = async (params: GetDataParams) => {
  if (!params) return;
  await service(params);
};
```

호출 시에도 순서에 얽매이지 않고 자유롭게 구성할 수 있다.

```typescript
const paramOrigin = { p1: 3, p2: 2, p3: 8, p4: 15 };
const paramReverse = { p4: 15, p3: 8, p2: 2, p1: 3 };
const paramIncludeA1 = { a1: "위치무관", p1: 3, p2: 2, p3: 8, p4: 15 };

getData(paramOrigin);
getData(paramReverse);
getData(paramIncludeA1);
```

이렇게 하면:

- 파라미터 순서를 기억할 필요가 없고
- 선택적 인자 추가/삭제가 간편하며
- 코드의 가독성과 유연성이 크게 향상된다.

---

### 결론

순서 기반 호출 방식은 초기에는 단순해 보여도 시간이 지날수록  
코드의 의도를 파악하기 어려워지고, 변경이 잦은 환경에서는 오히려 오류 가능성을 높인다.

요즘 `Typescript`를 기본적으로 사용하다 보니 궁합도 좋고  
타입 정의(`interface`)를 통해 명확한 구조와 유지보수의 이점을 동시에 확보할 수 있다.

결과적으로 객체 기반 호출 방식은 `선택`이 아닌 `필수` 라고 생각한다.
