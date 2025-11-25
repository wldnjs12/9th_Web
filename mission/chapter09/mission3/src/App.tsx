import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Modal from './components/Modal';
import CartList from './components/CartList';

const App = () => {
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

      {/* Modal */}
      <Modal />
    </div>
  );
};

export default App;
