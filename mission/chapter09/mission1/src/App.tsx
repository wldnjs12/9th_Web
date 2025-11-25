import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { calculateTotals } from './features/cart/cartSlice';
import CartList from './components/CartList';

const App = () => {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);

  // cartItems 가 변할 때마다 전체 합계 자동 계산
  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* navbar (첫 번째 스크린샷 상단) */}
      <Navbar />

      {/* 리스트 영역 (Outlet 처럼 가운데에 위치) */}
      <main className="flex-1">
        <CartList />
      </main>

      {/* footer (두 번째 스크린샷 하단) */}
      <Footer />
    </div>
  );
};

export default App;
