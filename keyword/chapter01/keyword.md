- 타입 스크립트에만 존재하는 타입 🍠
    - any 🍠
        - 모든 타입을 허용하는 특수 타입
        - 타입 검사를 하지 않기 때문에 안전성이 떨어짐
        - 기존 자바스크립트 코드를 빠르게 마이그레이션할 때는 편리하지만, 지양하는 것이 좋음
        - 사실상 “타입스크립트의 보호 장치 해제”라고 보면 됨
    - unknown 🍠
        - `any` 와 비슷하게 모든 값을 할당 가능하지만 사용하기 전에 타입 검사를 반드시 해야하는 `안전한 any`
        - 직접 연산이나 속성 접근은 불가능하고, 조건문,타입 좁히기(type narrowing) 후 사용해야 함
    - void 🍠
        - 반환값이 없음을 의미
        - 주로 함수의 리턴 타입으로 사용됨
        - 자바스크립트에서 `reuturn`이 없는 함수는 `undefined`를 반환하지만, 타입스크립트에선 이를 `void`로 표시해 “사용하지 않는다”는 의미를 줌
    - never 🍠
        - 절대로 도달할 수 없는 값을 나타냄
        - 예 ) 함수가 영원히 끝나지 않거나, 항상 오류를 던지는 경우
        - 모든 타입의 서브타입이지만, 어떤 값도 `never`에 할당할 수 없음
        - 주로 타입 안전성을 높이는 역할에 사용됨

        - null과 undefined의 차이점에 대해 직접 작성해주세요 🍠
    - null → 개발자가 의도적으로 비워둠
    - undefined → 자바스크립트가 자동으로 할당(초기화 안 됨)

    - 실습 정리 🍠
    - string
        
        ```css
        function getGreeting(): string {
          return "안녕"; // string OK
        }
        
        function getGreetingBad(): string {
          return 123; //number → string 불가
        }
        
        ```
        
    - number
        
        ```css
        function getAge(): number {
          return 22; // number OK
        }
        function getAgeBad(): number {
          return "22"; /string → number 불가
        }
        
        ```
        
    - boolean
        
        ```css
        function isMacUser(): boolean {
          return true; // boolean OK
        }
        function isMacUserBad(): boolean {
          return "true"; //string → boolean 불가
        }
        
        ```
        
    - null
        
        ```css
        function findUserName(): string | null {
          return null;        // OK
          // 또는 return "지니"; // OK
        }
        function findUserNameBad(): string | null {
          return undefined; //undefined → string|null 불가
        }
        
        ```
        
    - undefined
        
        ```css
        function notReady(): undefined {
          return undefined; // OK
        }
        function notReadyBad(): undefined {
          return null; //null → undefined 불가
        }
        
        ```
        
    - symbol
        
        ```css
        function makeId(): symbol {
          return Symbol("id"); // symbol OK
        }
        function makeId(): symbol {
          return "id"; 
        }
        
        ```
        
    
    - bigint
        
        ```css
        function bigCounter(): bigint {
          return 9007199254740993n; // bigint OK
        }
        function bigCounterBad(): bigint {
          return 9007199254740993; //number → bigint 불가
        }
        
        ```
        
    - object
        
        ```css
        type User = { name: string; age: number };
        
        function getUser(): User {
          return { name: "지니", age: 22 }; // OK
        }
        type User = { name: string; age: number };
        
        function getUserBad(): User {
          return { name: "지니" }; //'age' 프로퍼티 누락
        }
        
        ```
        
-

- 추가 미션 제출 🍠
    
    type vs interface 정리
    
    - 공통점: 객체 구조 정의, 클래스 implements, 확장 가능
    - interface: 선언 병합 가능, extends로 확장, API/클래스 구조 정의에 적합
    - type: 유니온/튜플/매핑 타입 가능, &로 확장, 복잡한 타입 조합에 적합
    - 정리: interface = 계약/확장, type = 조합/별칭