import { create } from 'zustand';
import type { CartItem } from '../constants/cartItems';
import cartItems from '../constants/cartItems';

// 합계 계산 유틸리티
const computeTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      acc.amount += item.amount;
      acc.total += item.amount * item.price;
      return acc;
    },
    { amount: 0, total: 0 }
  );
};

// Zustand Store 타입 정의
type StoreState = {
  // Cart 상태
  cartItems: CartItem[];
  amount: number;
  total: number;
  
  // Modal 상태
  isOpen: boolean;
  
  // Cart 액션
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  
  // Modal 액션
  openModal: () => void;
  closeModal: () => void;
};

export const useStore = create<StoreState>((set) => ({
  // 초기 상태
  cartItems,
  ...computeTotals(cartItems),
  isOpen: false,

  // Cart 액션
  increase: (id: string) =>
    set((state) => {
      const updatedItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      );
      return {
        ...state,
        cartItems: updatedItems,
        ...computeTotals(updatedItems),
      };
    }),

  decrease: (id: string) =>
    set((state) => {
      const updatedItems = state.cartItems
        .map((item) =>
          item.id === id ? { ...item, amount: item.amount - 1 } : item
        )
        .filter((item) => item.amount > 0);
      return {
        ...state,
        cartItems: updatedItems,
        ...computeTotals(updatedItems),
      };
    }),

  removeItem: (id: string) =>
    set((state) => {
      const updatedItems = state.cartItems.filter((item) => item.id !== id);
      return {
        ...state,
        cartItems: updatedItems,
        ...computeTotals(updatedItems),
      };
    }),

  clearCart: () =>
    set((state) => ({
      ...state,
      cartItems: [],
      amount: 0,
      total: 0,
    })),

  calculateTotals: () =>
    set((state) => {
      return {
        ...state,
        ...computeTotals(state.cartItems),
      };
    }),

  // Modal 액션
  openModal: () => set((state) => ({ ...state, isOpen: true })),
  closeModal: () => set((state) => ({ ...state, isOpen: false })),
}));

