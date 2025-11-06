그러면, 위와 같이 **여러 개의 태그를 동시에 반환하려고 할 때**는 어떻게 해야 할까요?

- 답변 🍠
    
    ```jsx
    function App() {
      return (
        <>
          <strong>상명대학교</strong>
          <p>매튜/김용민</p>
        </>
      )
    }
    export default App
    
    ```
    
    <aside>
    🍠
    
    이유: 
    
    - JSX 문법 규칙상, **컴포넌트는 하나의 부모 노드만 반환**할 수 있어요.
    - 여러 요소를 나란히 반환하고 싶을 때는 `<div>...</div>` 같은 태그로 감싸거나, 불필요한 DOM을 만들고 싶지 않다면 **React.Fragment(`<> ... </>`)**를 사용해요.
    - `Fragment`는 화면에 추가적인 DOM을 만들지 않고 여러 요소를 묶어주는 역할을 합니다.
    </aside>

    여러분들이, 직접 한번 구조분해 할당을 활용해서 어떻게 깔끔하게 코드를 작성할 수 있을지 고민해보세요!! 
저는 두가지 방식이 크게 떠오르는데요, 여러분들이 생각하는 방식으로 한번 해결해보세요! 저는 해설로 한번 저의 생각을 공유드릴테니 여러분들도 한번 직접 고민해보세요

- 구조분해 할당 활용
    
    ### 함수 매개변수에서 바로 분해
    
    ```tsx
    const List = ({ tech }) => {
      return (
        <li>
          {tech}
        </li>
      )
    }
    
    export default List
    ```
    
    props 중 필요한 것만 매개변수에서 바로 꺼낼 수 있다
    

    - **위의 영상을 보고 Lazy Initialization(게으른 초기화)**에 대해 설명해주세요 🍠
    
    컴포넌트가 렌더링될 때 초기 state값을 딱 한번만 계산하게 하는 방법이다.
    
    useState에 값 대신 함수를 넘기면, 그 함수는 첫 렌더 때만 실행되고 이후 재랜더에서는 다시 돌지 않는다.
    
- **App.tsx** 파일에 직접 카운터가 1씩 증가, 1씩 감소하는 기능을 만들어주세요 🍠
    - 직접 작성한 코드 **App.tsx** 파일을 올려주세요!
        
        ```tsx
        import './App.css'
        import { useState } from 'react'
        
        export default function App() {
          const [count, setCount] = useState(0)
          return (
            <div>
              <button onClick={() => setCount(c => c - 1)}>-1</button>
              <span style={{ margin: '0 10px' }}>{count}</span>
              <button onClick={() => setCount(c => c + 1)}>+1</button>
            </div>
          )
        }
        ```
        
    -
    - 영상을 보고 실습을 하면서 몰랐던 개념들을 토글을 열어 정리해주세요 🍠
    
    ### useState 핵심 + 안전한 업데이트
    
    - 기본형
        
        ```tsx
        const [count, setCount] = useState(0)
        
        ```
        
    - **값 기반**: 같은 렌더에서 오래된 값 잡을 수 있음
        
        ```tsx
        setCount(count + 1)
        
        ```
        
    - **함수형 업데이트**: 항상 직전 상태 기준으로 정확
        
        ```tsx
        setCount(prev => prev + 1)
        
        ```
        
        ### Lazy Initialization(지연 초기화)
        
    
    - 렌더 때마다 초기 계산 실행됨
        
        ```tsx
        const [v] = useState(heavyWork())    // 매 렌더 실행
        
        ```
        
    - **최초 한 번만** 초기 계산 실행
        
        ```tsx
        const [v] = useState(() => heavyWork()) // 또는 useState(heavyWork)
        
        ```

        ## `useState`를 선택할 때

- 상태가 단순하고 **불린, 문자열, 숫자, 단일 객체/배열** 정도일 때
- 상태 변경 로직이 **한두 줄 정도로 단순할 때**
- UI에 직접적으로 연결된 값이어서 빠르게 관리하고 싶을 때
- 컴포넌트의 규모가 작아서 복잡한 흐름을 고려할 필요가 없을 때

```tsx
const [count, setCount] = useState(0);

function increase() {
  setCount(count + 1);
}
```

---

## `useReducer`를 선택할 때

- 상태 값이 **여러 개** 얽혀 있어서 함께 관리해야 할 때
- `if/else`나 `setState` 중첩이 늘어나서 코드 가독성이 떨어질 때
- 상태 업데이트 로직을 한 곳에 모아두고 싶을 때 → 유지보수성 ↑
- 팀 프로젝트에서 **명확한 액션 정의**로 협업 가독성을 높이고 싶을 때

```tsx
type State = { count: number };
type Action = { type: 'INCREMENT' } | { type: 'DECREMENT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    default: return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
```

---

##