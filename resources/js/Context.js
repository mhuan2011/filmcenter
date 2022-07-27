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


    //category
    getItemCategory: (keyID) => {
      return axios.get(`/api/category/getitem/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getListCategory: () => {
      return axios.get('/api/category/getlist', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getFilterCategory: () => {
      return axios.get('/api/category/getfilter', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    storeCategory: (values) => {
      return axios.post('/api/category/store', values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    updateCategory: (keyID, values) => {
      return axios.post(`/api/category/update/${keyID}`, values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    deleteCategory: () => {
      return axios.get('/api/category/delete/{id}', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },

    //person
    getPerson: (keyID) => {
      return axios.get(`/api/person/getitem/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getListPerson: () => {
      return axios.get('/api/person/getlist', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    storePerson: (values) => {
      return axios.post('/api/person/store', values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    updatePerson: (values) => {
      return axios.post(`/api/person/update`, values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    deletePerson: () => {
      return axios.get('/api/person/delete/{id}', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },

    // 
    getListCountry: () => {
      return axios.get('/api/country/getlist', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    
    // Movies
    getMovies: (keyID) => {
      return axios.get(`/api/movies/getitem/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getListMovies: () => {
      return axios.get('/api/movies/getlist', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    storeMovies: (values) => {
      return axios.post('/api/movies/store', values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    updateMovies: (values) => {
      return axios.post(`/api/movies/update`, values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    deleteMovies: () => {
      return axios.get('/api/movies/delete/{id}', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },

    // Cinemal hall
    getCinemalHall: (keyID) => {
      return axios.get(`/api/cinema-hall/getitem/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getListCinemalHall: () => {
      return axios.get('/api/cinema-hall/getlist', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    storeCinemalHall: (values) => {
      return axios.post('/api/cinema-hall/store', values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    updateCinemalHall: (values) => {
      return axios.post(`/api/cinema-hall/update`, values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    deleteCinemalHall: (keyID) => {
      return axios.get(`/api/cinema-hall/delete/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },

    // show h
    getShow: (keyID) => {
      return axios.get(`/api/show/getitem/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getTicket: (keyID) => {
      return axios.get(`/api/show/getlist/ticket/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getSeatMap: (values) => {
      return axios.post(`/api/show/getseatmap`, values,  { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getListShow: () => {
      return axios.get('/api/show/getlist', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    storeShow: (values) => {
      return axios.post('/api/show/store', values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    updateShow: (values) => {
      return axios.post(`/api/show/update`, values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    deleteShow: (keyID) => {
      return axios.get(`/api/show/delete/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    //Cinema
    getCinemaWithMovie: (keyID) => {
      return axios.get(`/api/cinema/getitem-with-movie/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getCinema: (keyID) => {
      return axios.get(`/api/cinema/getitem/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    getListCinema: () => {
      return axios.get('/api/cinema/getlist', { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    storeCinema: (values) => {
      return axios.post('/api/cinema/store', values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    updateCinema: (values) => {
      return axios.post(`/api/cinema/update`, values, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },
    deleteCinema: (keyID) => {
      return axios.get(`/api/cinema/delete/${keyID}`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },


    // Client

    getMoviesShow: () => {
      return axios.get(`/api/getmovies-show`, { headers: { "Authorization": `Bearer ${state.user.access_token}` } })
    },

  }

  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export default Provider