import express from 'express'
import { getUserProfile, Login, logout, Register, updateProfile } from '../controllers/user.controller.js';
import userAuth from "../MiddleWare/auth.js"
const router=express.Router();

router.route('/register').post(Register)
router.route('/login').post(Login)
router.route('/logout').get(userAuth,logout)
router.route('/profile').get(userAuth,getUserProfile).put(userAuth,updateProfile)

export default router