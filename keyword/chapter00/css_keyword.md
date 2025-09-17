- border vs outline의 차이점 🍠
    
    **border**
    
    ![이미지 2025. 9. 15. 오후 3.45.jpeg](attachment:86b7ccb3-7f4a-47b6-b50b-164f08ce95c4:이미지_2025._9._15._오후_3.45.jpeg)
    
    width:100px에 border:10px을 주어도 전체 박스 외곽 크기는 100×100으로 유지됩니다. 대신 콘텐츠 영역이 100 - 2×10 = 80px로 줄어듭니다.. DevTools Box Model에서 border 영역이 분명히 보이며, content가 줄어든 것을 수치로 확인할 수 있습니다.
    
    **outline**
    
    ![이미지 2025. 9. 15. 오후 3.45 (1).jpeg](attachment:1e4a637f-7540-4538-8aae-4c9f430e0001:이미지_2025._9._15._오후_3.45_(1).jpeg)
    
    width:100px이 콘텐츠 영역 그대로이며, 바깥에 outline:10px이 겹쳐 보일 뿐 크기 계산에 포함되지 않습니다. 따라서 전체 외곽 크기는 여전히 100×100, 레이아웃 영향 없음. Box Model에는 outline이 아예 나타나지 않습니다.



### 위의 키워드를 활용해서 가운데 정렬을 구현해보세요! 🍠

<aside>
💡

HTML 요소는 여러분이 직접 만들어서, 가운데 정렬을 구현한 영상과 코드를 남겨주세요.
향후 학습에 있어서 매우 중요한 부분이니, 꼭 직접 코드를 작성하면서 실습해보세요!

</aside>

- text-align
    
    ```html
    <!DOCTYPE html>
    <body>
        <div style="text-align:center;">
            <h1>가운데 정렬</h1>
        </div>
    </body>
    </html>
    ```
    
- margin
    
    ```html
    <!DOCTYPE html>
    <body>
        <div style="width:200px;
                    margin:0 auto;">
    <h1>가운데 정렬</h1>
    </div>
    </body>
    </html>
    ```
    
- flex
    
    ```html
    <!DOCTYPE html>
    <body>
        <div style="display: flex;
                    justify-content:center;
                    align-items:center;">
    <h1>가운데 정렬</h1>
    </div>
    </body>
    </html>
    ```
    
- translate
    
    ```html
    <!DOCTYPE html>
    <body>
        <div style="position:absolute;
        top:50%;
        left: 50%;
        transform:translate(-50%, -50%);">
    <h1>가운데 정렬</h1>
    </div>
    </body>
    </html>
    ```
    
- grid
    
    ```html
    <!DOCTYPE html>
    <body>
        <div style="display:grid;
        place-items:center;
        height:100vh;">
    <h1>가운데 정렬</h1>
    </div>
    </body>
    </html>
    ```
    
- 반응형 background 🍠
    
    ### 아래 반응형 background 관련 키워드를 정리해보세요 🍠
    
    <aside>
    💡
    
    아래 키워드에 대해 정리한 후,  코드와 실행 영상을 남겨주세요!
    
    </aside>
    
    - background-image
        요소에 배경 이미지를 지정한다
        
        ```css
        .box {
          background-image: url("bg.jpg");
        }
        ```
        
    - background-repeat
        - 배경이미지를 반복할지 여부를 결정한다
        - 기본값은 `repeat`(가로/세로 모두 반복)
        - 주요 값:
            - `repeat-x`: 가로 방향만 반복
            - `repeat-y`: 세로 방향만 반복
            - `no-repeat`: 반복하지 않음
        
        ```css
        .box {
          background-repeat: no-repeat;
        }
        ```
        
    - background-position
        - 배경 이미지의 시작 위치를 지정한다
        - 키워드( `left`, `right`, `top`, `center`, `bottom`) 또는 px/퍼센트 단위 사용 가능
        
        ```css
        .box {
          background-position: center center;
        }
        ```
        
    - background-size
        - 배경 이미지의 크기를 지정한다
        - 주요 값:
            - `auto`: 원본 크기
            - `cover`: 요소 크기에 꽉 채움( 잘릴 수 있음→반응형에서 자주 사용)
            - `contain`: 요소 안에 전부 들어가도록 맞춤 ( 잘리진 않음, 여백 생길 수 있음)
            - `100% 100%`: 요소 너비/높이에 맞춤
    
    ```css
    .box {
      background-size: cover;
    }
    ```
    
    - 축약형
        - 위 속성들을 한 줄로 묶어 쓸 수 있다
        - 순서: background: [color] [image] [repeat] [position] / [size];
        
        ```css
        .box {
          background: url("bg.jpg") no-repeat center/cover;
        }
        ```
        
    
    [background - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/background)
    
- transform 🍠
    
    ### transform 🍠
    
    CSS **`transform`** 속성으로, 요소에 회전 크기 조절, 기울이기, 이동 효과를 부여할 수 있어요.
    
     `transform`은 CSS [시각적 서식 모델](https://developer.mozilla.org/en-US/docs/Web/CSS/Visual_formatting_model)의 좌표 공간을 변경해요.
    
    <aside>
    💡 아래 키워드에 대해 정리한 후, 코드와 실행 영상을 남겨주세요!
    
    </aside>
    
    - translate
        - 요소를 X, Y축 방향으로 이동시킨다
        - %단위를 쓰면 요소 자신의 크기를 기준으로 계산한다
        
        ```css
        .box {
          transform: translate(50px, 100px); /* X=50px, Y=100px 이동 */
        }
        ```
        
    - scale
        - 요소의 크기를 확대/축소한다
        - 1보다 크면 확대, 0과 1 사이면 축소
        - X, Y 축 각각 따로도 조절 가능
        
        ```css
        .box {
          transform: scale(1.5);      /* 1.5배 확대 */
          transform: scale(2, 0.5);   /* 가로 2배, 세로 0.5배 */
        }
        
        ```
        
    - rotate
        - 요소를 지정한 각도만큼 회전시킨다
        - 단위는 deg, rad 등을 사용
        
        ```css
        .box {
          transform: rotate(45deg);   /* 45도 회전 */
        }
        ```
        
    - skew
        - 요소를 지정한 각도만큼 기울인다
        - 글자나 박스를 비스듬히 표현할 때 사용
        
        ```css
        .box {
          transform: skew(20deg, 10deg); /* X축 20도, Y축 10도 기울임 */
        }
        ```
        
    - matrix
        - `translate`, `scale`, `rotate`, `skew`를 한 줄에 표현할 수 있는 행렬 방식
        - 잘 쓰이지는 않지만, 복잡한 애니메이션이나 수학적 계산에 필요할 때 사용한다.
        
        ```css
        .box {
          /* matrix(scaleX, skewY, skewX, scaleY, translateX, translateY) */
          transform: matrix(1, 0.3, 0.5, 1, 50, 100);
        }
        ```
        
    
    [transform - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)
    
- transition 🍠
    
    ### transition  🍠
    
    <aside>
    💡 아래 키워드에 대해 정리한 후, 실습을 진행해주시고, 코드와 실행 영상을 남겨주세요!
    
    </aside>
    
    - transition-property
        - 어떤 속성에 전환 효과를 줄 지 지정한다
        
        ```css
        .box {
          transition-property: background-color;
        }
        ```
        
    - transition-duration
        - 전환이 얼마나 걸릴지 시간 단위로 지정한다
        
        ```css
        .box {
          transition-duration: 0.5s; /* 0.5초 */
        }
        ```
        
    - transition-timing-function
        - 애니메이션 속도 곡선을 정의한다
        - 주요 값:
            - `linear` : 일정한 속도
            - `ease`: 천천히 시작 → 빨라짐 → 천천히 끝
            - `ease-in` : 천천히 시작
            - `ease-out`: 천천히 끝
            - `cubic-bezier()`: 커스텀
            
            ```css
            .box {
              transition-timing-function: ease-in-out;
            }
            ```
            
    - transition-delay
        - 전환 효과가 시작되기 전 기다리는 시간을 지정한다
        
        ```css
        .box {
          transition-delay: 0.3s;
        }
        ```
        
    - transition-behavior
        - 실험적 속성으로, 현재 대부분 브라우저에서는 지원하지 않음
        - 브라우저가 전환 중인 속성을 어떻게 다룰지 제어하는 것
        - 기본값은 `normal`

        ### animation 🍠

<aside>
💡 아래 키워드에 대해 학습한 후, 실습을 진행하시고 코드와 실행 영상을 남겨주세요!

</aside>

- animation-name
    - 사용할 `@keyframes` 이름을 지정
    
    ```css
    .box {
      animation-name: moveBox;
    }
    ```
    
- animation-duration
    - 애니메이션 실행 시간
    
    ```css
    .box {
      animation-duration: 2s;
    }
    ```
    
- animation-delay
    - 애니메이션이 시작되기 전 기다리는 시간
    
    ```css
    .box {
      animation-delay: 1s;
    }
    ```
    
- animation-direction
    - 애니메이션 진행 방향
    - 값:
        - `normal` 기본
        - `reverse` 역방향
        - `alternate` 정방향 → 역방향 반복
        - `alternate-reverse` 역방향 → 정방향 반복
    
    ```css
    .box {
      animation-direction: alternate;
    }
    ```
    
- animation-iteration-count
    - 애니메이션 반복 횟수
    - 숫자, 혹은 `infinite`
    
    ```css
    .box {
      animation-iteration-count: infinite;
    }
    ```
    
- animation-play-state
    - 애니메이션 재생/일시정지 제어
    - 값: `running`(기본), `paused`
    
    ```css
    .box:hover {
      animation-play-state: paused; /* hover 시 멈춤 */
    }
    ```
    
- animation-timing-function
    - 속도 곡선 지정
    - 값: `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `cubic-bezier()`
    
    ```css
    .box {
      animation-timing-function: ease-in-out;
    }
    ```
    
- animation-fill-mode
    - 애니메이션 시작 전/종료 후 스타일을 어떻게 유지할지 설정
    - 값:
        - `none` : 기본값 (애니메이션 전/후엔 원래 상태)
        - `forwards` :마지막 상태 유지
        - `backwards`: 시작 상태 미리 적용
        - `both`: 시작과 끝 상태 모두 유지
    
    ```css
    .box {
      animation-fill-mode: forwards;
    }
    ```
    
- @keyframes
    - 애니메이션의 단계별 동작을 정의하는 규칙
    - % 단위 또는 from ~ to 키워드로 지정
    
    ```css
    @keyframes moveBox {
      from { transform: translateX(0); }
      to   { transform: translateX(200px); }
    }
    ```
    
- 축약형
    - 순서:
        
        animation: `name` `duration` `timing-funcion` `delay` `iteration-count` `direction` `fill-mode` `play-state`;


- CSS 방법론 BEM 🍠
    
    BEM은 “Block, Element, Modifier”의 약자이며, CSS 클래스 네이밍을 구조 있게 작성함으로써 스타일 충돌을 줄이고 유지보수를 쉽게 하기 위한 방법론이다.
    
    - Block
        
         독립적인 컴포넌트. 동작, 스타일이 다른 것들과 격리 가능해야 하고, 다양한 곳에서 재사용 가능
        
        예) .card, .button, .menu 등
        
    - Element
        
        Block의 하위 구성요소. Block 없이 존재하지 않으며, `block__element` 형식으로 네이밍
        
        예) .card__title, .menu__item
        
    - Modifier
        
        Block 또는 Element의 상태나 테마를 바꾸는 클래스. `—`로 연결
        
        예) .button—large, .menu__item—active 
        
    - 예시
        - Block만 있는 형태:
            
            ```css
            .card { … }
            ```
            
        - Element (Block의 구성요소):
            
            ```html
            <div class="card">
              <h3 class="card__title">제목</h3>
              <p class="card__description">설명</p>
            </div>
            ```
            
        - Modifier (변형된 상태):
            
            ```html
            <button class="button button--large">큰 버튼</button>
            <span class="menu__item menu__item--active">활성 메뉴</span>
            ```
            
       - Block + Element + Modifier 조합 가능:
    
    ```css
    .card__button--disabled { … }
    ```
    
        