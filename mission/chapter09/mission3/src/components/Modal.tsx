import { useStore } from '../store/useStore';

const Modal = () => {
  const isOpen = useStore((state) => state.isOpen);
  const closeModal = useStore((state) => state.closeModal);
  const clearCart = useStore((state) => state.clearCart);

  if (!isOpen) return null;

  const handleNo = () => {
    closeModal();
  };

  const handleYes = () => {
    clearCart();
    closeModal();
  };

  return (
    <>
      {/* 오버레이 배경 */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleNo}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            장바구니 전체 삭제
          </h2>
          <p className="mb-6 text-slate-600">
            정말로 장바구니의 모든 항목을 삭제하시겠습니까?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              onClick={handleNo}
            >
              아니요
            </button>
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              onClick={handleYes}
            >
              네
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;

