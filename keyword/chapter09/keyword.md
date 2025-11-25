- **`Redux Toolkit`** 사용법을 공식문서를 보며 직접 정리해보기 🍠
    
    - Provider
        
        React에서 Redux를 쓰려면 앱 전체를 Store에 연결해야 한다.
        
        Provider로 App을 감싸주면 내부 컴포넌트들이 Redux 상태에 접근할 수 있다.
        
        ```tsx
        <Provider store={store}>
          <App />
        </Provider>
        
        ```
        
    - configureStore
        
        기존 Redux의 createStore보다 훨씬 단순하다.
        
        slice들을 reducer로 자동 합쳐주고, thunk도 기본으로 들어가 있다.
        
        DevTools도 바로 연결됨.
        
        ```tsx
        export const store = configureStore({
          reducer: {
            counter: counterSlice.reducer,
          },
        })
        
        ```
        
    - createSlice
        
        Redux Toolkit의 핵심 기능.
        
        slice 하나로 상태, reducer, action creator를 한 번에 만든다.
        
        Immer가 내장되어 있어서 불변성 걱정할 필요가 없다.
        
        ```tsx
        const counterSlice = createSlice({
          name: "counter",
          initialState: { value: 0 },
          reducers: {
            increase: (state) => { state.value++ },
            decrease: (state) => { state.value-- },
            setCount: (state, action) => { state.value = action.payload },
          },
        })
        
        ```
        
    - useSelector
        
        store 안의 특정 상태만 골라서 가져오는 hook.
        
        컴포넌트는 필요한 데이터만 구독한다.
        
        ```tsx
        const count = useSelector((state) => state.counter.value)
        
        ```
        
    - useDispatch
        
        action을 실행할 때 사용하는 hook.
        
        slice에서 만들어진 액션을 호출하면 된다.
        
        ```tsx
        const dispatch = useDispatch()
        dispatch(increase())
        
        ```
        
    - 기타 **`Redux Toolkit`** 사용 방법을 상세하게 정리해 보세요
        - **createAsyncThunk**
            
            비동기 요청(pending/fulfilled/rejected 액션)이 자동으로 만들어진다.
            
        - **createEntityAdapter**
            
            리스트 구조 데이터를 정규화해서 관리할 때 편하다.
            
        - **createSelector**
            
            reselect 기반 메모이제이션 selector. 렌더링 최적화할 때 사용.

            - **Zustand**란 무엇인가요? 🍠
    
    # **Zustand**란 무엇인가요?
    
    ---
    
    Zustand는 React에서 사용할 수 있는 **아주 가볍고 단순한 전역 상태 관리 라이브러리**이다.
    
    Redux처럼 복잡한 설정이 필요 없고, store 하나 만들어서 훅처럼 바로 불러 쓸 수 있다.
    
    Provider로 감싸줄 필요도 없기 때문에 구조가 단순하고 직관적이다.
    
- 왜 **Zustand**를 사용할까요? 🍠
    
    # 왜 Zustand를 사용할까요?
    
    ---
    
    - 설정이 거의 필요 없어서 속도 빠름
    - store를 간단한 함수만으로 정의할 수 있음
    - 필요한 상태만 선택해서 구독 → 리렌더 최소화
    - 비동기 로직도 store 안에 자연스럽게 작성 가능
    - 미들웨어로 persist, immer 등 붙이기 쉬움
    - 작은 앱부터 중간 규모까지 사용하기 좋음
- **Zustand** 기본 사용법 🍠
    
    # **Zustand** 기본 사용법
    
    ---
    
    ### 1) Store 만들기
    
    ```tsx
    import { create } from "zustand"
    
    const useCounterStore = create((set) => ({
      count: 0,
      increase: () => set((s) => ({ count: s.count + 1 })),
      decrease: () => set((s) => ({ count: s.count - 1 })),
    }))
    ```
    
    ### 2) 컴포넌트에서 사용하기
    
    ```tsx
    const count = useCounterStore((state) => state.count)
    const increase = useCounterStore((state) => state.increase)
    
    <button onClick={increase}>+</button>
    <div>{count}</div>
    ```
    
- **Zustand**에서 중요한 개념 🍠
    
    # **Zustand**에서 중요한 개념
    
    ---
    
    ### 1) set 함수
    
    상태 업데이트 함수.
    
    `set((state) => ({ ... }))` 형태로 업데이트한다.
    
    ### 2) get 함수
    
    store 내부에서 현재 상태를 조회해야 할 때 사용한다.
    
    ### 3) 선택적 구독 (selector)
    
    컴포넌트가 필요한 상태만 골라서 구독 → 불필요한 렌더링 줄여줌.
    
    ```tsx
    useStore((state) => state.user.name)
    
    ```
    
- **Zustand** 객체 상태 관리 예시 🍠
    
    # **Zustand** 객체 상태 관리 예시
    
    ---
    
    ```tsx
    const useUserStore = create((set) => ({
      user: { name: "Tom", age: 21 },
      setName: (name) =>
        set((state) => ({
          user: { ...state.user, name },
        })),
    }))
    ```
    
- **Zustand** 비동기 로직 예시 🍠
    
    # **Zustand** 비동기 로직 예시
    
    ---
    
    **Zustand**에서는 비동기 API 호출도 간단하게 store 안에서 사용할 수 있어요.
    
    ```tsx
    const usePostStore = create((set) => ({
      posts: [],
      fetchPosts: async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/posts")
        const data = await res.json()
        set({ posts: data })
      },
    }))
    
    ```
    
- **Zustand** + Persist 미들웨어 🍠
    
    # **Zustand** + Persist 미들웨어
    
    ---
    
    **Zustand**는 미들웨어를 활용해 로컬스토리지 등에 상태를 저장할 수 있어요.
    
    ```tsx
    import { create } from "zustand"
    import { persist } from "zustand/middleware"
    
    const useStore = create(
      persist(
        (set) => ({
          count: 0,
          increase: () => set((s) => ({ count: s.count + 1 })),
        }),
        { name: "counter-storage" }
      )
    )
    
    ```
    
- **Zustand** + Immer 함께 쓰기 🍠
    
    # **Zustand** + Immer 함께 쓰기
    
    ---
    
    불변성 관리를 쉽게 하고 싶다면 Immer 미들웨어도 사용 가능해요.
    
    ```tsx
    import { create } from "zustand"
    import { immer } from "zustand/middleware/immer"
    
    const useTodoStore = create(
      immer((set) => ({
        todos: [],
        addTodo: (text) =>
          set((state) => {
            state.todos.push({ id: Date.now(), text })
          }),
      }))
    )
    ```
    
- **Zustand** vs Context API 🍠
    
    # **Zustand** vs Context API
    
    ---
    
    - Context API는 값을 “공유”하는 데 초점
    - Zustand는 전역 상태 관리에 초점
    - Context는 Provider가 재렌더링되면 하위 컴포넌트도 영향 받음
    - Zustand는 필요한 상태만 구독하기 때문에 훨씬 효율적
    - 비동기/상태 업데이트 구조도 Zustand가 훨씬 단순함

    # **React 전역 상태 관리 완벽 가이드 블로그** 읽고 개념 정리하기  **🍠**

---

[개발자 매튜 | React 전역 상태 관리 완벽 가이드: Context API vs Zustand vs Jotai](https://www.yolog.co.kr/post/global-state/)

- **`Context API`**의 **`value 전체 구독 메커니즘`**과 **`Zustand`**의 **`selector 기반 구독`**의 성능 차이를 설명해보세요.
    
    **Context API**는 Provider의 `value` 객체가 바뀌면
    
    그 안의 어떤 속성이 변했는지와 상관없이 **모든 Consumer가 다시 평가**된다.
    
    즉, 한 필드가 바뀌어도 *value 전체가 바뀐 것처럼 취급*되므로
    
    규모가 커질수록 불필요한 렌더링이 눈덩이처럼 늘어난다.
    
    반면 **Zustand**는 React 18의 `useSyncExternalStore` 기반으로 동작하며,
    
    컴포넌트는 `selector`가 반환하는 **필요한 부분만** 구독한다.
    
    그 필드가 실제로 변했을 때만 렌더링되기 때문에
    
    큰 UI에서도 성능이 안정적으로 유지된다.
    
    > 핵심 차이:
    > 
    > 
    > **Context = 전체 묶음 구독**,
    > 
    > **Zustand = 필요한 조각만 구독**
    > 
- **`Jotai`**의 **`atom`** 조합 방식이 파생 상태 관리에서 Zustand 대비 갖는 장점을 의존성 추적 관점에서 설명해보세요.
    
    **Jotai**는 상태를 작은 atom 단위로 쪼개고,
    
    각 atom이 어떤 atom을 참조하는지 **의존성 그래프를 자동으로 추적**한다.
    
    그래서 특정 atom이 변경되면
    
    - 그 atom에 *직접* 의존하는 atom만 재계산되고
    - 해당 atom을 구독하는 컴포넌트만 렌더링된다
    
    즉, 파생 상태(계산된 값)나 필터링 로직이 많을수록
    
    Jotai의 구조는 더 강력해진다.
    
    Zustand처럼 "하나의 큰 store에서 selector로 계산"하는 방식보다
    
    “작은 atom을 조합하는 방식”이 자연스럽고 유지보수성이 좋다.
    
    > 핵심 차이:
    > 
    > 
    > **Zustand = 계산 로직을 selector에서 직접 작성**
    > 
    > **Jotai = atom들끼리 자동으로 연결되는 계산 그래프**
    > 
- 서버 상태를 **`useEffect`**로 관리할 때 발생하는 캐싱/중복 요청/불일치 문제를 설명해보세요.
    
    `useEffect` 기반의 서버 상태 관리는 본질적으로
    
    컴포넌트 생명주기 기반이기 때문에 구조적 한계가 존재한다.
    
    - **캐싱 없음**
        
        컴포넌트가 unmount되면 데이터가 바로 사라짐.
        
        따라서 동일 데이터를 필요로 하는 다른 컴포넌트는 다시 fetch해야 함.
        
    - **중복 요청 발생**
        
        같은 데이터라도 각 컴포넌트마다 useEffect가 실행되며
        
        여러 번 요청이 보내지는 일이 흔함.
        
    - **불일치 문제(Stale Data)**
        
        서로 다른 컴포넌트가 같은 서버 데이터의 “자신만의 로컬 복사본”을 갖게 되면서
        
        화면마다 데이터가 어긋나는 문제가 자주 일어남.
        
    
    이런 이유로 서버 상태는
    
    캐싱·동기화·중복요청 방지 등 기능이 내장된
    
    **React Query / SWR / RTK Query** 같은 전용 도구가 더 적합하다.
    
    > 핵심 차이:
    > 
    > 
    > **useEffect = 요청만 보낼 뿐, 캐싱·동기화는 제공하지 않음**
    > 
    > **전문 라이브러리 = 서버 상태를 앱 전체에 일관되게 유지**
    >