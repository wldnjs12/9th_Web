- 기타 태그 추가 정리해보기 🍠
    
    **폼 관련 태그들:**
    
    - `<form>` : 사용자 입력 양식
    - `<input>` : 다양한 입력 필드
    - `<button>` : 클릭 가능한 버튼
    - `<select>`, `<option>` : 드롭다운 선택 메뉴
    
    **텍스트 관련 태그들:**
    
    - `<strong>` : 중요한 텍스트 (굵게)
    - `<em>` : 강조 텍스트 (기울임)
    - `<mark>` : 하이라이트된 텍스트
    
    **추가로 태그를 정리해주세요:**
    
    **목록 관련 태그들:**
    
    - `<ul>`  : 순서 없는 목록(unordered list)
    - `<ol>` : 순서 있는 목룍(ordered list)
    - `<li>` :  목록의 각 항목(list item)
    - `<dl>` : 정의 목록(definition list)
    - `<dt>` : 정의할 용어(definition term)
    - `<dd>` : 용어 설명(definition description)
    
    **표 관련 태그들:**
    
    - `<table>` : 표 생성
    - `<tr>` : 표의 행
    - `<td>` : 표의 일반 셀
    - `<th>` : 표의 제목 셀
    - `<thead>` : 표의 머리글 부분
    - `<tbody>` : 표의 본문 부분
    - `<tfoot>` : 표의 바닥 부분
    
    **문서 메타데이터 관련 태그:**
    
    - `<meta>` : 문서 정보
    - `<title>` : 브라우저 탭에 표시되는 제목
    - `<link>` : 외부 리소스 연결
    - `<base>` : 문서의 기본 URL 설정
    
    **텍스트 구조 보조 태그:**
    
    - `<span>` : 인라인 요소 묶음
    - `<br>` : 줄 바꿈
    - `<hr>` : 수평선(구분선)
    - `<blockquote>` : 인용문 표시
    - `<pre>` : 공백/줄바꿈 유지한 텍스트 블록
    - `<code>` : 코드 조각 표시

    - Element Level과 Container Level은 무엇을 의미하며, 어떤 것이 다른지 정리해주세요.
    
    ## Element Level
    
    - **의미**: 화면에 직접적으로 표시되는 UI 요소(콘텐츠)를 담당
    - **역할**: 텍스트, 링크, 이미지, 오디오, 코드 블록 등 **내용 자체**를 표현.
    - **특징**:
        - 그 자체로 의미 있는 UI가 됨
        - 보통 문단 단위, 인라인 단위 콘텐츠
    - **예시**:
        - `<p>`, `<h1>~<h6>`, `<a>`, `<ul>`, `<li>`, `<blockquote>`, `<span>`, `<b>`, `<i>` 등
    
    ## Container Level
    
    - **의미**: 여러 개의 요소(Element)를 담아 **구조적 영역**을 형성
    - **역할**: UI 요소들을 묶어 **레이아웃 구조**와 문서 의미(시멘틱)를 드러냄
    - **특징**:
        - 단독으로는 UI 의미가 크지 않음
        - 내부에 어떤 콘텐츠를 담느냐에 따라 역할이 정해짐
    - **예시**:
        - `<div>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<nav>`, `<main>`, `<aside>`

        ### 실습 🍠

- 그러면, **`inline-block`**은 어떠한 방식으로 동작할까요? 🍠
    - **`block`**
        - 한 줄 전체를 차지 (줄바꿈 발생)
        - 가로·세로 크기(width/height) 지정 가능
        - 예: `<div>`, `<p>`, `<h1>`
    - **`inline`**
        - 내용(content)만큼만 차지
        - 줄바꿈 없음 (옆으로 나란히 배치)
        - width/height 지정 불가
        - 예: `<span>`, `<a>`, `<strong>`
    - **`inline-block`**
        - 옆으로 나란히 배치(= inline처럼 동작)
        - **width/height 지정 가능** (block처럼 동작)
        - 그래서 두 가지 성질을 섞음
- **`block`**, **`inline`**, **`inline-block`** 직접 html과 css를 활용해서 무엇이 다른지, **`VS Code Live Server Extension을 활용`**하여, 실습 한 이미지를 첨부하여 설명해주세요. 🍠
    - Block : 각각 줄바꿈이 자동으로 일어남
    - Inline : 옆으로 나란히 배치되지만, width/height 적용이 안 됨 → 내용 크기만큼 차지
    - Inline-Block : 옆으로 나란히 배치 + width/height 지정 가능
    
    ![이미지 2025. 9. 18. 오후 4.41.jpeg](attachment:2fa7d1aa-222e-4d73-9166-7c800e42829b:이미지_2025._9._18._오후_4.41.jpeg)

## HTML: 추가 정리 (2025-09-18 16:51:49)
- 시맨틱 태그 요약 보완
