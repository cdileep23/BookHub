import { createSlice } from "@reduxjs/toolkit";

const userReducer=createSlice({
    initialState:null,
    name:'user',
    reducers:{
        userLoggedIn:(state,action)=>{
            return action.payload
        },
        userLoggedOut:()=>{
            return null
        }
    }
})

export const{userLoggedIn,userLoggedOut}=userReducer.actions
export default userReducer.reducer
