---
title: Git 기본 구조 이해하기
description: 능숙하게 Git 활용하기, 그 첫번째 단계
pubDatetime: 2026-06-15
modDatetime: 2026-07-03
author: Jaemin
tags:
  - git
featured: false
draft: false
ogImage: "#"
canonicalURL: ""
hideEditPost: false
timezone: Asia/Seoul
---

## Git은 Key-Value 저장소 구조

> Git은 `content-addressable filesystem`이다.

Git에 어떤 내용을 담으면 그 내용은 `SHA-1 Hash` 키로 매핑되고  
내용을 필요로 할 때마다 그 키를 통해 값을 사용하는 방식이다.

커밋, 브랜치, 머지 같은 모든 개념이 단순 저장소 위에 얹힌 레이어 인 것이다.

## Git init

```bash
git init
```

`git init` 명령으로 이니셜라이징 시 .git 디렉토리가 생성된다.

```bash
# .git directory structure
├─hooks
├─info
├─objects
│  ├─info
│  └─pack
├─config      (file)
├─description (file)
├─HEAD        (file)
└─refs
    ├─heads
    └─tags
```

여기서 주의깊게 봐야할 것들은 `objects`, `refs`, `HEAD(file)` 이 세가지이다.

### Objects

파일 내용, 디렉토리 구조, 커밋 등 모든 데이터가 저장되는 곳이다.  
데이터베이스라고 보면 된다.

이 Objects에는 딱 4가지(`blob`, `tree`, `commit`, `tag`) 객체가 들어간다.  

#### blob

blob은 파일의 내용 그 자체이다. 파일명은 없으며 순수하게 내용만 저장한다.

#### tree

blob에서 저장하지 않던 파일명은 tree에서 저장한다.  
해당 디렉토리 안에 무엇이 있는지를 나타내는 객체로 파일명과 해시를 매핑한다.

tree가 다른 tree를 가리키면 그것이 하위 디렉토리이다.

#### commit

cat-file 명령으로 커밋을 뜯어보면 루트 tree 하나의 해시와  
부모 커밋 해시(첫 커밋 시 존재하지 않음) + 작성자 정보 + 메세지를 가지는 것을 확인할 수 있다.  

커밋이 작업의 변경분을 저장한다고 생각할 수 있지만,  
커밋은 그 시점의 스냅샷을 가리키는 포인터이다.  
작업의 diff 확인은 두 스냅샷을 비교해서 그때그때 계산하는 방식이다.

![blob-tree-commit](/assets/git_object_model_commit_tree_blob.svg)

### refs와 HEAD

main 브랜치 파일을 직접 확인해보면  

```bash
cat .git/refs/heads/main
# a14edc2aaf1bf163321609...
```

이렇게 그냥 40자리 해시 텍스트 한줄 딸랑 써있는걸 볼 수 있다.  
새로운 브랜치를 생성하면 이 파일의 내용을 새 커밋 해시로 갱신만 할 뿐이라 저장소가 무거워지지 않는 핵심 이유이다.

.git 경로에 HEAD는 마찬가지로 텍스트지만 약간 다르다.

```bash
cat .git/HEAD
# ref: refs/heads/main
```

HEAD는 커밋을 직접 바라보게 하는게 아니라 브랜치를 가리키는 포인터이다.  
즉 포인터를 추적하는 포인터인 셈이다. (나는 심볼릭 폴더와 유사하다고 이해했다.)

`HEAD → refs/heads/main → 커밋 {Hash} → tree → blob`

그래서 checkout으로 브랜치를 전환하면 HEAD가 변경하고자 하는 브랜치 해시를 바라보도록 바꾸는 것이다.

> 주의!) (detached HEAD) Git 변경사항을 바로 추적하려고 git checkout {hash} 처럼 특정 커밋의 해시에 바로
> 접근할 수 있는데 이렇게 접근한 상태에서 커밋을 하면 해당 커밋은 어떤 브랜치도 갱신되지 않기 때문에 `미아 커밋`이 된다.  
> 나도 가끔 코드 자체를 원복하려는 의도로 사용하긴 하는데 이런 접근에서 코드의 변경은 절대 하지 않는다

### index

`git add` 명령으로 변경사항을 스테이징 영역에 올린다.  
여기서 말하는 스테이징 영역이 바로 이 `.git/index` 바이너리 파일이다.  

```bash
git ls-files --stage
# 100644 2a93d00994fbd8c484f38b0423b7c42e87a55d48 0 README.md
```

출력되는 형태를 보면 tree 구조와 거의 흡사한 것을 확인할 수 있다.  
commit 이라는 것이 index의 내용을 tree 객체로 굳혀서 저장하는 행위이기 때문이다.  
즉, index는 작성 중인 tree의 초안으로 보면 된다.

흔히 `git status` 명령으로 스테이징 관리를 해왔을 것이다.  

여기서 status 명령은  

- HEAD의 커밋 (마지막으로 확정된 스냅샷)
- index (다음 커밋이 될 스냅샷 - 초안)
- 작업 영역 디렉토리 (현재 관리하는 실제 파일들)

이 세 가지를 비교한다.  

HEAD와 index가 다르다면 초록색 로그 (Changes to be committed)  
index와 작업 영역 디렉토리가 다르면 빨간색 로그 (Changes not staged)  

지금 껏 status를 통해 많이 보던 결과가 저 세 가지를 diff check 해서 나온 결과였던 것!
