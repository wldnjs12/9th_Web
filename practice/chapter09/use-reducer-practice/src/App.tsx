import Counter from './components/Counter';
import Todo from './components/Todo';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1 className="title">useReducer 실습</h1>

      <div className="section-grid">
        <Counter />
        <Todo />
      </div>
    </div>
  );
}

export default App;
