import { useAppDispatch, useAppSelector } from '../app/hooks';
import { openModal } from '../features/modal/modalSlice';

const Footer = () => {
  const dispatch = useAppDispatch();
  const { amount, total } = useAppSelector((state) => state.cart);

  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-6">
        <div className="flex flex-col items-center gap-1 text-slate-800">
          <p className="text-sm">
            총 수량:{' '}
            <span className="font-semibold text-slate-900">{amount}</span> 장
          </p>
          <p className="text-base">
            총 금액:{' '}
            <span className="font-semibold text-slate-900">
              ₩{total.toLocaleString()}
            </span>
          </p>
        </div>
        <button
          className="rounded-md border border-slate-800 px-6 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white"
          onClick={() => dispatch(openModal())}
        >
          전체 삭제
        </button>
      </div>
    </footer>
  );
};

export default Footer;
