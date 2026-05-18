---
title: React Fragment
description: ""
pubDatetime: 2025-11-28
modDatetime: 2025-11-28
author: Jaemin
tags:
  - react
featured: false
draft: false
ogImage: "#"
canonicalURL: ""
hideEditPost: false
timezone: Asia/Seoul
---

### ☁ Fragment 란?

React에서는 여러 JSX 요소를 하나로 묶어서 반환해야 할 때,  
불필요한 DOM 태그를 만들지 않도록 `Fragment` 컴포넌트를 제공한다.

`Fragment`는 실제 DOM에는 아무런 요소도 렌더하지 않으면서  
여러 자식을 그룹화할 수 있는 리액트의 특수한 컨테이너 역할을 한다.

### ⛅ 사용 방식

- 정석적인 방법

```typescript
<React.Fragment>
  <div>item 1</div>
  <div>item 2</div>
</React.Fragment>
```

- `Shorthand` fragment 사용 방식

```typescript
<>
  <div>item 1</div>
  <div>item 2</div>
</>
```

### 🌤 React.Fragment VS shorthand

> ⚠ shorthand 방식은 비교적 최신 문법이기 때문에, 레거시 프로젝트에서는 구문 오류로 인식되거나
> 테스트 도구에서 에러로 처리되는 경우가 있다.

간단한 wrapping 용도로 사용하는 경우, shorthand 방식을 많이 사용해왔다.  
종종 문제가 되는 경우는 동적 사이즈만큼 요소를 추가하는 경우이다.

shorthand 방식의 경우 데이터 속성이나 key 속성을 사용할 수 없다.  
동적으로 요소를 중복 추가하는 경우 key를 unique하게 할당해주지 않으면, key 매핑 에러에 직면하게 된다.

그리고 테스트를 위해 attribute를 할당하는 경우도 shorthand 방식은 사용할 수 없다.

```typescript
interface Item {
  title: string;
  content: string;
}

// 🚨 Error! -> <key=""></> 이런 문법은 지원x
array.map((item: Item, idx: number) => (
    <>
      <div>{item.title}</div>
      <p>{item.content}</p>
    </>
));

// ✅ success!
array.map((item: Item, idx: number) => (
    <React.Fragment key={idx} data-test="fragment">
      <div>{item.title}</div>
      <p>{item.content}</p>
    </React.Fragment>
));
```
