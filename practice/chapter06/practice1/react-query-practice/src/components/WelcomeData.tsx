import { useState } from 'react';
import { useCustomFetch } from '../hooks/useCustomFetch';

interface UserData {
  id: number;
  name: string;
  email: string;
}

export const WelcomeData = () => {
  const [userId, setUserId] = useState(1);
  const [visible, setVisible] = useState(true);

  const handleChange = () => {
    const random = Math.floor(Math.random() * 10) + 1;
    setUserId(random);
  };

  const handleTestRetry = () => {
    setUserId(999999);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <button onClick={handleChange}>다른 사용자 불러오기</button>
        <button onClick={() => setVisible(!visible)}>
          컴포넌트 토글 (Unmount)
        </button>
        <button
          onClick={handleTestRetry}
          style={{ background: '#f57c00', color: '#fff' }}
        >
          재시도 테스트 (404)
        </button>
      </div>

      {visible && <UserDataDisplay userId={userId} />}
    </div>
  );
};

const UserDataDisplay = ({ userId }: { userId: number }) => {
  const { data, isPending, isError } = useCustomFetch<UserData>(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (isPending) return <p>Loading... (User ID: {userId})</p>;
  if (isError) return <p style={{ color: 'red' }}>Error Occurred</p>;

  return (
    <div>
      <h2>{data?.name}</h2>
      <p>{data?.email}</p>
      <small style={{ color: '#888' }}>User ID: {data?.id}</small>
    </div>
  );
};
