import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export type TodoResponse = Todo; 


// 1) 가짜 API 유틸 (생성/삭제/조회)
let __MEMO_DB: Todo[] = [
  { id: 1, title: '리액트 문서 읽기', completed: false },
  { id: 2, title: 'TanStack Query 설치', completed: true },
];
let __nextId = 3;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const fetchTodos = async (): Promise<TodoResponse[]> => {
  await delay(300);
  return JSON.parse(JSON.stringify(__MEMO_DB));
};

export const createTodo = async (
  payload: Pick<Todo, 'title' | 'completed'>
): Promise<Todo> => {
  await delay(400);
  const created: Todo = { id: __nextId++, ...payload };
  __MEMO_DB = [created, ...__MEMO_DB];
  return JSON.parse(JSON.stringify(created));
};

export const deleteTodo = async (id: number): Promise<{ success: boolean; id: number }> => {
  await delay(250);
  __MEMO_DB = __MEMO_DB.filter((t) => t.id !== id);
  return { success: true, id };
};


// 2) 목록: useQuery로 ['todos'] 가져오기
const TodoList: React.FC = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 0, 
  });

  if (isPending) return <p>목록 불러오는 중...</p>;
  if (isError) return <p>에러: {(error as Error).message}</p>;

  if (!data || data.length === 0) return <p>할 일이 없습니다. 새로 추가해 보세요!</p>;

  return (
    <ul className="grid gap-2">
      {data.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={todo.completed} readOnly />
            <span>{todo.title}</span>
          </div>
          <DeleteButton id={todo.id} />
        </li>
      ))}
    </ul>
  );
};


// 3) useMutation으로 생성 + 자동 동기화 (핵심)
const TodoActions: React.FC = () => {
  const qc = useQueryClient();
  const [title, setTitle] = useState('');

  const create = useMutation({
    mutationKey: ['createTodo'],
    mutationFn: createTodo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['todos'] });
      setTitle('');
    },
  });

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <input
          className="w-full rounded-xl border px-3 py-2"
          placeholder="할 일을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && title.trim()) {
              create.mutate({ title: title.trim(), completed: false });
            }
          }}
        />
        <button
          className="rounded-xl border px-4 py-2 disabled:opacity-50"
          onClick={() => title.trim() && create.mutate({ title: title.trim(), completed: false })}
          disabled={create.isPending}
        >
          {create.isPending ? '추가 중…' : '추가'}
        </button>
      </div>
      {create.isError && <span className="text-red-600">에러: {(create.error as Error).message}</span>}
      <p className="text-xs text-gray-500">
        생성 성공 시 <code>invalidateQueries(['todos'])</code>가 즉시 호출되어 목록이 자동 새로고침됩니다.
      </p>
    </div>
  );
};

//삭제 버튼: 동일하게 invalidate 시연
const DeleteButton: React.FC<{ id: number }> = ({ id }) => {
  const qc = useQueryClient();
  const del = useMutation({
    mutationKey: ['deleteTodo'],
    mutationFn: deleteTodo,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['todos'] }),
  });
  return (
    <button
      className="rounded-lg border px-2 py-1 text-xs disabled:opacity-50"
      onClick={() => del.mutate(id)}
      disabled={del.isPending}
    >
      {del.isPending ? '삭제 중…' : '삭제'}
    </button>
  );
};

// 4) 샌드박스 App
const queryClient = new QueryClient();

const Practice07_01: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="mx-auto grid max-w-xl gap-4 p-4">
        <header className="grid gap-1">
          <h1 className="text-xl font-semibold">실습: useMutation으로 안전하게 변경하기</h1>
          <p className="text-sm text-gray-600">
            목표: <strong>할 일 추가(createTodo) 성공</strong> 시 <code>['todos']</code> 목록을 자동 동기화
          </p>
        </header>
        <TodoActions />
        <hr />
        <TodoList />
      </div>
    </QueryClientProvider>
  );
};

export default Practice07_01;
