import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./toastSlice"
import cartReducer from "./cartSlice"

const store = configureStore({
  reducer: {
    toast: toastReducer, // slice 的 reducer
    cart: cartReducer
  }
})

export default store;