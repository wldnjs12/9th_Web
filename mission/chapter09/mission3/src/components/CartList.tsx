import CartItem from './CartItem';
import { useStore } from '../store/useStore';

const CartList = () => {
  const cartItems = useStore((state) => state.cartItems);

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto mt-10 max-w-4xl px-6">
        <p className="text-center text-lg text-slate-500">
          장바구니가 비어 있습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-6 max-w-4xl px-6">
      <ul className="divide-y divide-slate-200">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
};

export default CartList;
