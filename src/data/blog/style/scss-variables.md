---
title: SCSS variables 구조 개선
description: SCSS 변수를 단순 나열 방식에서 모듈 구조로 개선
pubDatetime: 2025-12-22
modDatetime: 2025-12-22
author: Jaemin
tags:
  - style
  - UI
  - CSS
featured: false
draft: false
ogImage: "#"
canonicalURL: ""
hideEditPost: false
timezone: Asia/Seoul
---


> 기존에도 color 들을 정의해두고 모든 스타일 파일에서 쉽게 활용하였는데, 문득 좀 더 나은 구조로 개선할 순 없을까 고민 끝에 구조를 개선하였다

### ☁ 기존에는 그냥 활용할 값들을 모두 나열해서 정의했는데

```tsx
/* === media size === */
$desktop-4k: 1921px;
$desktop: 1024px;
$tablet-max: 1023px;
$tablet-min: 768px;
$mobile-max: 767px;
$mobile-min: 320px;

/* === Pure Black & White === */
$black: #0f0f0f;
$white: #fdfdfd;

... // 너무 많아서 생략

/* === Information === */
$info-900: #091a7a;
$info-800: #102693;
$info-700: #1939b7;
$info-600: #254edb;
$info-500: #3366ff;
$info-400: #6690ff;
$info-300: #84a9ff;
$info-200: #adc8ff;
$info-100: #d6e4ff;
```

### ⛅ 이러한 구조 내에서도 모듈 구조로 개선을 진행하였다

```tsx
/* ==============================
   Breakpoints
============================== */
$breakpoints: (...);

/* ==============================
   Base Colors
============================== */
$colors: (...);

/* ==============================
   Font Sizes
============================== */
$font-sizes: (...);

/* ==============================
   Color Palette
============================== */
$palette: (
  black: (...),
  tangerine: (...),
  cool-gray: (...),
  warm-gray: (...),
  warning: (...),
  danger: (...),
  success: (...),
  info: (...),
);

/* ==============================
   Helper Functions
============================== */
@function bp($key) {
  @return map-get($breakpoints, $key);
}

@function color($group, $shade: null) {
  $palette-group: map-get($palette, $group);
  @if $shade == null {
    @return $palette-group;
  }
  @return map-get($palette-group, $shade);
}

@function font-size($size) {
  @return map-get($font-sizes, $size);
}
```

이렇게 각각 카테고리화 하여 각각 카테고리 별 값을 호출해서 사용하는 helper 함수를 정의했다

### 🌤 사용 방식의 변경점

#### 기존에는 variables 정의 스타일 변수를 직접 호출해서 사용했는데

```scss
@use '@scss/abstracts' as *; // abstracts 모듈에 variables가 포함되어있음

h1 {
 color: $black;
}
```

#### helper 함수를 통해 받아온 값을 사용하는 방식으로 개선하였다

```scss
@use '@scss/abstracts' as *;

h1 {
 color: color(success, 500) // $palette - success - 500
}
```
