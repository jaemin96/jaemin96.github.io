---
title: 성능 최적화 지표 Web Core Vitals
description: LCP, INP, CLS 등 핵심 지표를 파악하고 React 개발자로서 성능 개선해보기
pubDatetime: 2026-05-04
modDatetime: 2026-05-04
author: Jaemin
tags:
  - UX
  - Performance
  - vitals
  - Lighthouse
featured: false
draft: false
ogImage: "#"
canonicalURL: ""
hideEditPost: false
timezone: Asia/Seoul
---

## Web Core Vitals 지표에 대하여 알아보자

<table style="width:100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th style="padding: 8px; text-align: left;">지표</th>
      <th style="padding: 8px; text-align: left;">의미</th>
      <th style="padding: 8px; text-align: left;">임계값</th>
      <th style="padding: 8px; text-align: left;">중요도</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; vertical-align: top;">
        <strong>LCP</strong><br/>
        <span style="color: gray; font-size: 0.8em;">Largest Contentful Paint</span>
      </td>
      <td style="padding: 8px; vertical-align: top;">메인 콘텐츠가 화면에 나타나는 속도</td>
      <td style="padding: 8px; vertical-align: top;">
        <span style="color: #16a34a;">≤ 2.5s Good</span> ·
        <span style="color: #ea580c;">≤ 4.0s Needs</span> ·
        <span style="color: #dc2626;">&gt; 4.0s Poor</span><br/>
      </td>
      <td style="padding: 8px; vertical-align: top;">
        <strong>최상</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; vertical-align: top;">
        <strong>INP</strong><br/>
        <span style="color: gray; font-size: 0.8em;">Interaction to Next Paint</span>
      </td>
      <td style="padding: 8px; vertical-align: top;">클릭/입력 시 화면이 반응하는 속도 (세션 전체)</td>
      <td style="padding: 8px; vertical-align: top;">
        <span style="color: #16a34a;">≤ 200ms Good</span> ·
        <span style="color: #ea580c;">≤ 500ms Needs</span> ·
        <span style="color: #dc2626;">&gt; 500ms Poor</span>
      </td>
      <td style="padding: 8px; vertical-align: top;">
        <strong>최상</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 8px; vertical-align: top;">
        <strong>CLS</strong><br/>
        <span style="color: gray; font-size: 0.8em;">Cumulative Layout Shift</span>
      </td>
      <td style="padding: 8px; vertical-align: top;">로딩 중 화면 요소의 갑작스러운 흔들림</td>
      <td style="padding: 8px; vertical-align: top;">
        <span style="color: #16a34a;">≤ 0.1 Good</span> ·
        <span style="color: #ea580c;">≤ 0.25 Needs</span> ·
        <span style="color: #dc2626;">&gt; 0.25 Poor</span>
      </td>
      <td style="padding: 8px; vertical-align: top;">
        <strong>상</strong>
      </td>
    </tr>
  </tbody>
</table>

## 3대 지표 중 가장 예의주시 해야할 지표는 `INP`

> LCP나 CLS는 정해진 패턴으로 개선 포인트가 명확한 편이지만,  
> INP의 경우 Javascript 아키텍처 자체적인 영향을 받다보니 아키텍처 설계가 중요하다.

`INP`는 기존에 `FID` 측정 지표를 2024년부터 정식 대체한 새로운 지표이다.

### FID와 INP 차이는 무엇일까?

`FID`는 첫 입력 지연만 측정한다. 그래서 페이지 로드 자체는 빠르지만,  
그 이후 필터링이나 정렬 등 추가적인 행동으로 버벅임이 생기더라도 해당 페이지는 적합한 사이트로 통과되는 모순이 있었다.

`INP`는 세션 전체에 걸친 모든 인터렉션의 응답을 측정하여 이러한 첫 로드만 빠른 페이지들이 적합한 사이트로 통과되지 못하도록 측정 범위를 강화하었다.

### INP 관리 해야할 3가지 단계에 대하여 알아보자

- **Input Delay (입력 지연)**  
  사용자가 클릭 했는데, 메인 스레드가 바쁘다고 이를 무시한다

  Sol) async/defer, scheduler.yield

- **Processing Time (처리 시간)**  
  클릭은 접수 완료.  
  단, 클릭을 수행하기 위한 핸들러 자체가 너무 무거워서 오래걸림

  Sol) scheduler.yield, useTransition/useDeferredValue, web-worker, debounce

- **Presentation Delay (출현 지연)**  
  클릭 완료했고 핸들링까지 신속하게 완료.  
  단, 변화한 내역을 화면에 표시하려하니 DOM 요소가 너무 많거나 레이아웃이 꼬여서 힘들어함
  Sol) React-window, React-virtuoso, css(content-visibility: auto), div -> Fragment

> **async/defer** : 해당 작업은 중요하지 않다고 우선순위를 뒤로 미뤄준다.  
> **yield** : 양보의 개념으로 해당 작업 수행보다 급한게 있으면 먼저 하라고 양보해준다.  
> **useTransition** : React 자체 지원 훅으로 무거운 리렌더링 작업을 긴급하지 않은 것으로 분류해준다.  
> **useDeferredValue** : 긴급한 렌더링부터 처리한 후 지연된 처리를 할 수 있게 해준다.

### React 기반 성능 최적화 방법들

> useMemo나 useCallback도 알고 있었으나, manual memoization은 점점 사라지는 추세라고 한다.
>
> React Compiler가 빌드 타임에 자동으로 정적 분석 후 필요한 부분에만 useMemo / useCallback 을 삽입해준다고 하며, 이러한 컴파일링 과정에서 코드 변경 없이 10~15% 성능이 향상 되었다는 보고가 있다.
>
> memo·useMemo·useCallback을 그냥 다 붙이는 방식은 안티패턴이 되어가는 중이며 필요한 곳에만 수동 적용하거나 Compiler에게 맡기는 것이 효율적이라고 한다.

#### **동시성 Hooks 활용**

- useTransition : state 업데이트 우선순위 분리 (검색 필터링, 탭 전환, 대량 리스트 패치)
- useDeferredValue : 값 자체를 지연 렌더링 처리 (직접 컨트롤할 수 없는 props 전달 받은 게 무거운 경우)
- useOptimistic : 서버 응답 전 UI 즉시 업데이트 (댓글, 좋아요)
- useActionState : 비동기 액션 + state 통합 (폼 제출 + 로딩/에러 상태 관리)

#### **TanStack Query (React Query)**

- API 응답을 캐싱하여 불필요한 중복 요청을 방지
- staleTime 설정으로 사용자가 로딩 바 보는 빈도를 최소화
- 캐시된 데이터 활용으로 Presentation Delay 감소, 인터렉션 데이터 패칭 대기 제거

#### **Zustand / 정밀 상태 관리**

- 상태 변경 시 구독한 컴포넌트만 정교하게 리렌더링해서 부하 감소
- 도메인별로 store를 분리하여 불필요한 cascading re-render 차단

#### **react-window / react-virtual (가상화)**

- 대량의 리스트는 DOM 노드를 그만큼 만들기 때문에 가상화로 화면에 보이는것 + 약간의 버퍼만 렌더링 하여 DOM 노드 수를 줄일 수 있다.
