import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user";
import booksReducer from "./book";

export const appStore=configureStore({
    reducer:{
        user:userReducer,
        books:booksReducer
    }
})
