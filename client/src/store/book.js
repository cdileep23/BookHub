import { createSlice } from "@reduxjs/toolkit";


const booksReducer=createSlice({
    initialState:null,
    name:"books",
    reducers:{
        addBooks:(state,action)=>{
            return action.payload
        },
        resetBooks:()=>{
            return null;
        }
    }
})

export const {resetBooks,addBooks}=booksReducer.actions

export default booksReducer.reducer
