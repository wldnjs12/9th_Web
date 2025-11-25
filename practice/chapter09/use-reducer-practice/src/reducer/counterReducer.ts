export type CounterState = {
    count: number;
  };
  
  export type CounterAction =
    | { type: 'INCREMENT' }
    | { type: 'DECREMENT' }
    | { type: 'RESET' };
  
  export const initialState: CounterState = {
    count: 0,
  };
  
  export function counterReducer(
    state: CounterState,
    action: CounterAction
  ): CounterState {
    switch (action.type) {
      case 'INCREMENT':
        return { count: state.count + 1 };
      case 'DECREMENT':
        return { count: state.count - 1 };
      case 'RESET':
        return initialState;
      default:
        return state;
    }
  }
  