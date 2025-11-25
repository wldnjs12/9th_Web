import { useAppSelector } from '../app/hooks';

const Navbar = () => {
  const { amount } = useAppSelector((state) => state.cart);

  return (
    <nav className="w-full bg-slate-900 text-white">
      <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Ohtani Ahn</h1>

        <div className="relative flex items-center gap-2">
          {/* 장바구니 아이콘 (간단한 SVG) */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 7h14l-2-7M10 21a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z"
            />
          </svg>
          <span className="text-lg font-semibold">{amount}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
