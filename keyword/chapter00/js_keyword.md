# DOM 조작 🍠

## 1. 개념
- 브라우저에서 HTML 문서를 **동적으로 수정**하고 사용자와 상호작용을 처리하는 핵심 개념
- React 같은 라이브러리도 DOM 조작을 효율적으로 관리하기 위해 만들어짐

## 2. 태그 가져오기
- `getElementById('id')`
- `querySelector('선택자')` → 첫 번째 요소
- `querySelectorAll('선택자')` → 모든 요소 (NodeList)

## 3. 이벤트 리스너
- `addEventListener` : 이벤트 등록
- `removeEventListener` : 이벤트 제거 (같은 함수 참조 필요)

## 4. 자주 쓰는 이벤트
- `click`, `mouseover` / `mouseout`, `keydown` / `keyup`, `input`

## 5. 속성 다루기
- `setAttribute`, `getAttribute`, `removeAttribute`
- 혹은 `element.id`, `element.className`

## 6. 부모·자식 태그 접근
- `parentElement`, `children`, `firstElementChild`, `lastElementChild`

## 7. 태그 생성/삽입
- `document.createElement`
- `appendChild`, `append`

## 8. 태그 복제
- `cloneNode(true/false)` → true는 자식까지 복사
