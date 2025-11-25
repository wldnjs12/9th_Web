import type { CartItem as CartItemType } from '../constants/cartItems';
import { useStore } from '../store/useStore';

type Props = {
  item: CartItemType;
};

const CartItem = ({ item }: Props) => {
  const increase = useStore((state) => state.increase);
  const decrease = useStore((state) => state.decrease);
  const removeItem = useStore((state) => state.removeItem);

  const handleDecrease = () => {
    if (item.amount === 1) {
      removeItem(item.id);
    } else {
      decrease(item.id);
    }
  };

  return (
    <li className="flex items-center justify-between gap-4 border-b border-slate-200 py-4">
      <div className="flex items-center gap-4">
        <img
          src={item.img}
          alt={item.title}
          className="h-20 w-20 rounded-md object-cover shadow"
        />
        <div>
          <h2 className="font-semibold text-slate-900">{item.title}</h2>
          <p className="text-sm text-slate-500">{item.singer}</p>
          <p className="mt-1 font-semibold text-slate-800">
            ₩{item.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="rounded-md border border-slate-300 px-3 py-1 text-lg font-semibold hover:bg-slate-100"
          onClick={handleDecrease}
        >
          -
        </button>
        <span className="inline-flex w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 py-1 text-sm font-medium">
          {item.amount}
        </span>
        <button
          className="rounded-md border border-slate-300 px-3 py-1 text-lg font-semibold hover:bg-slate-100"
          onClick={() => increase(item.id)}
        >
          +
        </button>
      </div>
    </li>
  );
};

export default CartItem;
