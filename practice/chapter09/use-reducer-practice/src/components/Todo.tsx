import { useReducer, useState, type FormEvent } from 'react';

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

type Action =
  | { type: 'ADD'; payload: string }
  | { type: 'TOGGLE'; payload: number }
  | { type: 'REMOVE'; payload: number };

function todoReducer(todos: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'ADD':
      return [...todos, { id: Date.now(), text: action.payload, done: false }];
    case 'TOGGLE':
      return todos.map((todo) =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    case 'REMOVE':
      return todos.filter((todo) => todo.id !== action.payload);
    default:
      return todos;
  }
}

const Todo = () => {
  const [text, setText] = useState('');
  const [todos, dispatch] = useReducer(todoReducer, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: 'ADD', payload: trimmed });
    setText('');
  };

  return (
    <section className="card">
      <h2>Todo Example (useReducer)</h2>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button type="submit">추가</button>
      </form>

      {todos.length === 0 ? (
        <p className="card__desc">아직 등록된 할 일이 없습니다.</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id}>
              <span className={todo.done ? 'done' : ''}>{todo.text}</span>
              <div className="button-row">
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'TOGGLE', payload: todo.id })}
                >
                  {todo.done ? '되돌리기' : '완료'}
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'REMOVE', payload: todo.id })}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Todo;
