import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../constants/cartItems';
import cartItems from '../../constants/cartItems';

type CartState = {
  cartItems: CartItem[];
  amount: number; // 전체 수량
  total: number; // 전체 금액
};

// 초기값 계산 함수
const calculateInitialTotals = (items: CartItem[]) => {
  let amount = 0;
  let total = 0;
  items.forEach((item) => {
    amount += item.amount;
    total += item.amount * item.price;
  });
  return { amount, total };
};

const initialTotals = calculateInitialTotals(cartItems);

const initialState: CartState = {
  cartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (!item) return;

      item.amount -= 1;
      if (item.amount < 1) {
        state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });

      state.amount = amount;
      state.total = total;
    },
  },
});

export const { increase, decrease, removeItem, clearCart, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
