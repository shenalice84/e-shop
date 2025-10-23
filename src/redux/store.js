import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "./toastSlice"

const store = configureStore({
  reducer: {
    toast: toastReducer // slice 的 reducer
  }
})

export default store;