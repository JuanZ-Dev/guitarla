import { db } from "../data/db";
import type { CartItem, Guitar } from "../types";

export type CartActions =
  | { type: "add-to-cart"; payload: { item: Guitar } }
  | { type: "remove-from-cart"; payload: { id: Guitar["id"] } }
  | { type: "decrease-quantity"; payload: { id: Guitar["id"] } }
  | { type: "increase-quantity"; payload: { id: Guitar["id"] } }
  | { type: "clear-cart" };

export type CartState = {
  data: Guitar[];
  cart: CartItem[];
};

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState: CartState = {
  data: db,
  cart: initialCart(),
};

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  switch (action.type) {
    case "add-to-cart": {
      const itemExists = state.cart.findIndex(
        (item) => item.id === action.payload.item.id
      );
      let updateCart: CartItem[] = [];
      if (itemExists >= 0) {
        if (state.cart[itemExists].quantity >= MAX_ITEMS) return state;
        updateCart = state.cart.map((item, index) =>
          index === itemExists ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newItem: CartItem = { ...action.payload.item, quantity: 1 };
        updateCart = [...state.cart, newItem];
      }
      return {
        ...state,
        cart: updateCart,
      };
    }

    case "remove-from-cart": {
      const cart = state.cart.filter((item) => item.id !== action.payload.id);
      return {
        ...state,
        cart,
      };
    }

    case "decrease-quantity": {
      const cart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      return {
        ...state,
        cart,
      };
    }

    case "increase-quantity": {
      const cart = state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      return {
        ...state,
        cart,
      };
    }

    case "clear-cart":
      return {
        ...state,
        cart: [],
      };
    default:
      throw new Error("Unknown action");
  }
};
