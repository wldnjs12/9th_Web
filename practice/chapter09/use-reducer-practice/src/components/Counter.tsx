import { useReducer } from 'react';
import { counterReducer, initialState } from '../reducer/counterReducer';

const Counter = () => {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <section className="card">
      <h2>Counter Example (useReducer)</h2>
      <p className="card__desc">현재 값: {state.count}</p>

      <div className="button-row">
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
        <button onClick={() => dispatch({ type: 'RESET' })}>RESET</button>
      </div>
    </section>
  );
};

export default Counter;
