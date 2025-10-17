---
title: React custom hooks - useWatchAndAutoClear
description: Antd 라이브러리 사용하면서 개발 환경 개선을 위해 도입한 커스텀 훅
pubDatetime: 2025-10-17
modDatetime: 2025-10-17
author: Jaemin
tags:
  - hook
  - react
featured: false
draft: false
ogImage: "#"
canonicalURL: ""
hideEditPost: false
timezone: Asia/Seoul
---
## useWatchAndAutoClear

> **antd**의 form 기능의 편의성을 위해 추가한 **custom hook**이며, </br>
> 입력 form들을 추적하여 변화를 감지하고 변화에 따라 입력 필드를 초기화해주는 hook이다.

### ☁ 기본 구성

```typescript
// useWatchAndAutoClear.tsx
import { useEffect } from 'react';
import { Form, FormInstance } from 'antd';

type Comparator = (val: any) => boolean; // clear 수행할 조건식 타입 

export const useWatchAndAutoClear = (
  form: FormInstance,
  watchFieldPath: string[], // 변경 주시할 필드
  clearFieldPath: string[], // 폼 초기화 할 필드
  isNegative: Comparator = (val) => val !== 'Y' && val !== '있음' // 클리어 조건
): any => {
  // 넘겨줄 form의 field name path에 해당하는 필드를 감시
  const value = Form.useWatch(watchFieldPath, form);

  // 감시하는 폼 필드가 변경되면 조건 검사 (조건에 해당되는 경우 초기화 수행)
  useEffect(() => {
    if (isNegative(value)) {
      form.setFieldValue(clearFieldPath, '');
    }
  }, [value, form]);

  return value;
};
```

#### ⛅ Hook 프로세스

1. 모체가 되는 form 받아옴
2. 감시할 필드`(watchFieldPath)`와 초기화할 필드 정보`(clearFieldPath)`를 받아옴
3. 감시할 필드와 초기화할 필드 처리 조건을 받아옴
4. 감시할 필드의 값이 변경됨에 따라 조건을 지속적으로 검증
5. 조건 검사 결과에 따라 초기화 수행 여부 결정

### 🌤 간단한 사용 예시

```typescript
import { Form } from "antd"

export const exFn = () => {
  ...
  
  const [임의form] = Form.useForm();
  // ex) 감시할 필드가 라디오 버튼이라면 감시당할필드_현재값은 true | false
  const 감시당할필드_현재값 = useWatchAndAutoClear(
    임의form,
    ['감시할 필드'],
    ['초기화할 필드']
  );

  return {
   ...
   
   <Form form={임의form}>
    <Form.Item name={['감시할 필드']} />
    <Form.Item name={['초기화할 필드']} />
   </Form>
   
   ...
  }
}
```

#### 🌞 코드 설명

* antd Form 메서드를 통해 form 정의
* Form과 Form.Item 에 정의한 폼과 필드 path 부여하기 (name 속성)
* custom hook에 정의한 form과 부여한 필드 path 정보를 전달
