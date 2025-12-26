---
title: 공통 패키지 배포 설정 가이드
description: "monorepo에서 사용하는 공용 패키지들을 publish 배포"
pubDatetime: 2025-12-26
modDatetime: 2025-12-26
author: Jaemin
tags:
  - NPM
  - CI/CD
featured: false
draft: false
ogImage: "#"
canonicalURL: ""
hideEditPost: false
timezone: Asia/Seoul
---

# ☁ Monorepo 자동 배포 설정 가이드 (npm OIDC + GitHub Actions)

> npm Classic Token이 2025년 12월 9일부터 폐기되면서, OIDC Trusted Publishing을 사용한 자동 배포 설정이 필수가 되었습니다.  
> 해당 포스팅은 배포환경 구축 과정과 난항을 겪었던 이슈들에 대해서 정리한 글입니다.  
> 자세한 내용은 [클래식 토큰 폐기 관련 공식사이트](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/)
> 에서 확인 가능합니다.

## ⛅ 목차

1. [프로젝트 구조](#프로젝트-구조)
2. [Changesets 설정](#changesets-설정)
3. [GitHub Actions Workflow 설정](#github-actions-workflow-설정)
4. [npm Trusted Publishing 설정](#npm-trusted-publishing-설정)
5. [트러블슈팅](#트러블슈팅)
6. [사용 방법](#사용-방법)

## ⛅ 프로젝트 구조

```
shared-config/
├── packages/
│   ├── eslint-config/
│   ├── prettier-config/
│   └── tsconfig/
├── .changeset/
│   ├── config.json
│   └── README.md
├── .github/
│   └── workflows/
│       └── release.yml
└── package.json
```

## ⛅ Changesets 설정

### 1. Changesets 설치

루트 `package.json` 파일 구성은 아래와 같습니다.

```json
{
  "name": "shared-config",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.29.8"
  },
  "packageManager": "pnpm@10.17.1" 
}
```

### 2. Changesets 초기화

```bash
pnpm changeset init
```

initializing 하면 루트 경로에 .changeset(`config.json`, `README.md`) 디렉터리가 추가됩니다.

## GitHub Actions Workflow 설정

`.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write  # OIDC Trusted Publishing에 필수!

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24  # npm OIDC는 Node.js 24+ 필요!
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm run release
          title: "chore: version packages"
          commit: "chore: version packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_CONFIG_PROVENANCE: true
```

### 주요 포인트

> pnpm은 필자가 쓰는 패키지매니저라서 다른 패키지매니저 사용하시는 분들은 알잘딱으로 바꿔주기

- **Node.js 24+**: npm OIDC Trusted Publishing은 node.js 24+가 필요하다고 합니다. (이거 때문에 삽질 엄청함..ㅠ)
- **id-token: write**: OIDC 토큰 발급을 위해 필수
- **NPM_CONFIG_PROVENANCE: true**: Provenance 검증 활성화 (NPM에 publish 하기 위해 필수인 옵션)

## ⛅ npm Trusted Publishing 설정

### 1. 각 패키지에 repository 정보 추가

**(중요!!)** Provenance 검증을 위해 모든 패키지의 `package.json`에 repository 정보가 필요합니다!

`packages/*/package.json`:

```json
{
  "name": "@{your-scope}/prettier-config",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://{본인 레포 주소}.git",
    "directory": "packages/prettier-config"
  },
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

### 2. npm에서 Trusted Publishing 설정

**각 패키지마다** 다음 URL에서 설정:

```
https://www.npmjs.com/package/@your-scope/package-name/access
```

1. **Publishing Access** 섹션에서 **"Add Trusted Publisher"** 클릭
2. 다음 정보 입력:
   - **Provider**: GitHub Actions
   - **Organization or user**: `your gitHub username` (GitHub username)
   - **Repository**: `your github repo`
   - **Workflow filename**: `workflow.yml`
   - **Environment name**: (필자는 그냥 비워둠)
3. **Save changes** 클릭

### 3. 2FA 설정 확인

다음 두 옵션 중 하나만 선택:

- ✅ Require two-factor authentication or a granular access token with bypass 2fa enabled
- ⬜ Require two-factor authentication and disallow tokens (recommended)

**OIDC 사용 시 첫 번째 옵션 권장**

### 4. GitHub Repository 권한 설정

```
https://github.com/{username}/{repo}/settings/actions
```

1. **Workflow permissions** 섹션에서:
   - ✅ "Read and write permissions" 선택
   - ✅ "Allow GitHub Actions to create and approve pull requests" 체크

## 🌤 트러블슈팅

### 문제 1: `Access token expired or revoked`

**원인**: Node.js 버전이 24 미만

**해결**:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 24  # 22에서 24로 변경
```

### 문제 2: `Error verifying sigstore provenance bundle`

**에러 메시지**:

```
package.json: "repository.url" is "", expected to match "https://github.com/..."
```

**원인**: package.json에 repository 정보 누락

**해결**: 모든 패키지의 package.json에 repository 추가:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/{user}/{repo}.git",
    "directory": "packages/{package-name}"
  }
}
```

### 문제 3: `GitHub Actions is not permitted to create or approve pull requests`

**원인**: GitHub Actions 권한 부족

**해결**: Repository Settings → Actions → Workflow permissions에서:

- "Allow GitHub Actions to create and approve pull requests" 체크

### 문제 4: 최초 publish 시 404 에러

**원인**: npm에 패키지가 아예 존재하지 않음

**해결**: 최초 1회는 수동으로 publish 필요:
> 가끔 NPM에 등록 안되는 이슈도 있는데 provenance 무시하고 올리려면 --no-provenance 옵션도 추가

```bash
cd packages/{package-name}
npm publish --access public (--no-provenance)
```

이후부터는 자동화가 작동합니다.

## 사용 방법

### 1. 코드 변경 후 changeset 생성

```bash
# 코드 수정 후
pnpm changeset
```

대화형으로 진행:

1. 변경된 패키지 선택 (스페이스바)
    - 처음에 그냥 무지성으로 Enter만 누르니까 계속 에러나서 뭐지 했는데 space로 체크 활성화 해줘야함...ㅎㅎ

2. 버전 타입 선택:
   - **patch**: 1.0.0 → 1.0.1 (버그 수정)
   - **minor**: 1.0.0 → 1.1.0 (새 기능)
   - **major**: 1.0.0 → 2.0.0 (Breaking changes)
3. 변경사항 설명 입력

### 2. Commit & Push

> ⚠ 무조건 changeset 까지는 수동 작업 선행 해줘야합니다. (changeset 파일 없으면 flow 실패하거나 PR 안생깁니다)

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### 3. 자동 PR 생성

GitHub Actions가 자동으로:

- `.changeset/` 폴더의 변경사항 감지
- **"Version Packages"** PR 생성
- PR에 버전 업데이트 + CHANGELOG 포함

### 4. PR 머지 → 자동 배포

PR을 머지하면:

- GitHub Actions가 자동으로 `pnpm run release` 실행
- npm에 새 버전 자동 publish
- Provenance 정보 포함

## 전체 플로우 요약

![npm publish flow](/assets/npm-changeset-flow-white.png)

1. **수동**: 코드 변경 + changeset 생성 + push
2. **GitHub Actions**: Version PR 자동 생성 (push flow가 성공했다면)
3. **수동**: PR 검토 후 머지
4. **GitHub Actions**: npm 자동 배포 (OIDC 인증) - NPM 사이트 public 패키지 버전 갱신

## 참고 자료

- [npm Trusted Publishing 공식 문서](https://docs.npmjs.com/trusted-publishers/)
- [npm OIDC is Generally Available](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/)
- [Changesets 문서](https://github.com/changesets/changesets)
- [npm Classic Tokens Revoked 공지](https://github.blog/changelog/2025-12-09-npm-classic-tokens-revoked-session-based-auth-and-cli-token-management-now-available/)

## 마무리

여러 레포에서 사용하는 공통 패키지를 수정할 때마다 각각 반영해야 해서 번거로움이 컸다.  
서브모듈도 고민했지만, 관리 복잡도를 줄이기 위해 아예 public 패키지로 배포하는 방향을 선택했다.

배포 과정에서는 토큰 발급·갱신 관리 대신 OIDC Trusted Publishing을 적용해 보안과 유지보수 부담을 줄였다.
또한 NPM 릴리즈 기반으로 버전 관리가 가능해지면서, 각 레포에서 필요한 버전의 공통 패키지를 선택적으로 사용할 수 있는 환경이 마련되었다.

**핵심 체크리스트**:
> 참고하실분들은 꼭 체크리스트 확인해서 삽질 시간 줄이시길...

- ✅ Node.js `24+` 사용
- ✅ `id-token: write` 권한 설정
- ✅ 모든 패키지에 `repository 정보` 추가
- ✅ npm에서 각 `패키지마다 Trusted Publishing 설정`
- ✅ GitHub Actions에 `PR 생성 권한` 부여
