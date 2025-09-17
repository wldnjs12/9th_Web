# ⚡9th_Web

UMC-9th Web 워크북 &amp; 미션 제출 레포지토리입니다!

## 💻 Member

## 📁 디렉토리 구조

```bash
.
├─ README.md             # UMC web 스터디 깃허브 규칙
├─ keyword/
│   └─ Chater_00/        # 주차별 폴더 생성
│       └─ README.md     # 키워드 정리
├─ mission/
│   └─ Chater_00/        # 주차별 폴더 생성
│       ├─ README.md     # 미션 설명 (선택)
│       ├─ index.html    # 미션 코드 (단일 파일)
│       ├─ style.css
│       ├─ script.js
│       └─ react-todo/   # 미션 코드가 프로젝트 단위일 경우 폴더
│           └─ src/
│               └─ App.tsx
│               └─ ...
└─ practice/
    └─ Chater_00/        # 주차별 폴더 생성
        ├─ README.md     # 실습 설명 (선택)
        ├─ test.html     # 실습 코드 (단일 파일)
        ├─ test.js
        └─ mini-app/     # 실습 코드가 프로젝트 단위일 경우 폴더
            └─ src/
                └─ App.tsx
                └─ ...

```

### keyword 폴더

키워드를 정리한 파일을 올리는 폴더입니다.

### practice 폴더

실습 코드를 정리한 파일을 올리는 공간입니다.

### mission 폴더

미션을 진행하신 내용을 정리한 파일을 올리는 폴더입니다.

## 🌳 branch 규칙

```bash
├─main
    ├─thunder/main
	...
```

1. `닉네임/main 브랜치`가 기본 브랜치로 pr 보낼 때 root 브랜치(main 브랜치)가 아닌 닉네임/main 브랜치로 올립니다.
2. 매주 워크북, 실습, 그리고 미션은 각자의 닉네임/main 브랜치를 base 브랜치로 삼아 fork한 레포지터리 에서 base branch에 pull request를 생성합니다.
3. 파트장의 approve를 받으면, pr을 머지하고 이때, pr 제목은
   `[n주차/닉네임] 워크북 제출합니다` 형식으로 작성합니다.

## 🔖 커밋 컨벤션

예시 ) `mission: 0주차 미션 인증`
| Message | 설명 |
| :------: | :------------------------------------------------ |
| mission | 미션 수행 |
| practice | 실습 수행 |
| keyword | 키워드 정리 |
| fix | 버그 수정 |
| docs | 문서 수정 |
| comment | 주석 추가 및 변경 |
| test | 테스트 코드 추가 |
| rename | 파일 혹은 폴더명 수정 |
| remove | 파일 혹은 폴더 삭제 |
| chore | 기타 변경사항 |
