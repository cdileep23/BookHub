import express from "express"
import { addBook, deleteBook, getBook, getBookByOwner, getBooksFeed, updateBookByOwner } from "../controllers/book.controller.js"
import userAuth from "../MiddleWare/auth.js"


const router=express.Router()

router.route('/add-book').post(userAuth,addBook)
router.route('/get-book/:bookId').get(userAuth,getBook)
router.route('/delete-book/:bookId').delete(userAuth,deleteBook)
router.route('/owner/get-books').get(userAuth,getBookByOwner)
router.route('/get-books-feed').get(userAuth,getBooksFeed)
router.route('/update-book-owner/:bookId').put(userAuth,updateBookByOwner)
export default router