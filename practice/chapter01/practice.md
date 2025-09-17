반환값으로, 설정한 타입과 할당한 변수의 타입이 맞지 않으면, 어떻게 되는지 아래에 작성해주세요!
아래와 같이, 반환값이 문자열이라고 예상했지만, 숫자가 들어간 경우, 에러가 발생해요.

각 실습들의 성공케이스와, 실패 케이스를 아래에 정리해주세요!


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
        