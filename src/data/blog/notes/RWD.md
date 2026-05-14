---
title: RWD (Responsive Web Design)
description: 디바이스 환경 별로 만족도 높은 사용자 경험을 제공하는 방법
pubDatetime: 2026-05-13
modDatetime: 2026-05-13
author: Jaemin
tags:
  - UI
  - UX
  - design
  - style
featured: false
draft: false
ogImage: "#"
canonicalURL: ""
hideEditPost: false
timezone: Asia/Seoul
---

## RWD (Responsive Web Design)란 무엇인가 ?

Responsive Web Design은  

> 하나의 코드 베이스가 모든 화면에 적응된다  

해당 개념이 핵심이다.

이전에는 웹 페이지에서 **PC버전에서 보기/모바일버전에서 보기**와 같은  
웹 뷰 전환 트리거들을 통해 내 디바이스에 적합한 뷰잉 경험을 선택할 수 있었다.

이러한 방식들은 웹과 모바일 사이트를 각각 구축해두고 이를 스위칭하는 개념이다.  

RWD는 이러한 방식보다는 같은 HTML이라면 CSS 코드만으로 화면을 재배치되도록 한 것이다.

## RWD 동작을 위한 핵심 개념

1. Fluid Grid  
기존에 대부분 사용한 **PX** 단위 대신 **%**, **fr**, **flex**와 같은 비율 처리 단위를 사용해서 레이아웃 설정

2. Flexible Media  
이미지나 영상 컨텐츠가 컨테이너에 맞게 늘어나거나 줄어들도록 처리

3. Media Queries  
디바이스 규격에 맞게 스타일 코드를 분리해서 관리하는 방식

세 가지 핵심 내용을 기반으로 사이트를 구축하면 거의 모든 디바이스 환경에서 원활한 UX를 제공할 수 있다.

> 사실 미디어쿼리 없이도 Flex, Grid 설정을 통해 유동적인 레이아웃을 만들고  
> 해당 레이아웃 내부에서 비율을 조작하여 반응형 웹을 구축하는 방식으로 보편화되었다.

### Viewport 이해

구축중인 웹 서비스 코드베이스를 관심있게 보면 `index.html`에서  

```html
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

이런 설정을 확인할 수 있다.  

반응형 처리를 위해 무조건 붙여둬야하는 설정이다.

해당 설정이 의미하는 바는 현재 사용하는 디바이스 폭을 viewport 폭으로 사용하도록 하는 것이다.
