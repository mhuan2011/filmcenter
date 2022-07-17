import axios from "axios";
import { createContext, useEffect, useReducer } from "react";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : { role_id: '' },
  cart: [],
  cart_length: 0,
  money: 0,
};

const actions = {
  SET_USER: "SET_USER",
  ADD_CART: "ADD_CART",
  SUM_MONEY: "SUM_MONEY",
  MINUS_CART: "MINUS_CART",
  RESET_CART: "RESET_CART",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SET_USER:
      return {
        ...state,
        user: action.user,
      }
    case actions.SUM_MONEY:
      let sumTemp = 0
      let sumpLength = 0
      state.cart.map(item => {
        sumTemp += item.price * item.qty
        sumpLength += item.qty
      })
      return { ...state, money: sumTemp, cart_length: sumpLength }
    case actions.ADD_CART:
      // console.log(action.data)
      let orderDetail = {
        name: action.data.name,
        pic: action.data.pic,
        id: action.data.id,
        price: action.data.price,
        qty: 1,
      }
      let i = -1;
      state.cart.map((itemD, index) => {
        if (itemD.id == orderDetail.id) {
          i = index
        }
      })
      if (i < 0) {
        let newState = { ...state, cart: [...state.cart, orderDetail] }
        return newState
      } else {
        orderDetail = {
          name: action.data.name,
          pic: action.data.pic,
          id: action.data.id,
          price: action.data.price,
          qty: state.cart[i].qty,
        }
        let newArr = [...state.cart];
        newArr[i] = orderDetail;
        newArr[i].qty = newArr[i].qty + 1
        let newState = { ...state, cart: newArr }
        return newState
      }
    case actions.MINUS_CART:
      state.cart.map((itemD, index) => {
        if (itemD.id == action.data.id) {
          i = index
        }
      })
      if (i < 0) {
        let newState = { ...state, cart: [...state.cart, orderDetail] }
        return newState
      } else {
        orderDetail = {
          name: action.data.name,
          pic: action.data.pic,
          id: action.data.id,
          price: action.data.price,
          qty: state.cart[i].qty,
        }
        let newArr = [...state.cart];
        newArr[i] = orderDetail;
        newArr[i].qty = newArr[i].qty - 1
        if (newArr[i].qty == 0) {
          newArr = state.cart.filter((itemD) => itemD.id !== orderDetail.id)
        }
        let newState = { ...state, cart: newArr }
        return newState
      }
    case actions.RESET_CART:
      let newState = { ...state, cart: [], cart_length: 0, money: 0 }
      return newState
    default:
      return state;
  }
};

export const AppContext = createContext();

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    user: state.user,
    users: state.users,
    setUser: (user) => {
      dispatch({ type: actions.SET_USER, user });
    },
    cart: state.cart,
    money: state.money,
    cart_length: state.cart_length,
    addCart: (data) => {
      dispatch({ type: actions.ADD_CART, data });
      dispatch({ type: actions.SUM_MONEY });
    },
  }
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default Provider