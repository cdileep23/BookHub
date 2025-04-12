import bookModel from "../model/book.model.js";
import { UserModel } from "../model/user.model.js";



export const addBook=async(req,res)=>{
    try {
        const{title,genre,city,imageUrl}=req.body
if(!title||!genre||!city ||!imageUrl){
    throw new Error("All Field are Required")
}

        const userData = req.userData
  
          if(userData.role!=='Owner'){
            throw new Error("Only Owner can Add Books")
          }

        const newBook=await bookModel.create({
            title,city,imageUrl,genre,author:userData._id,contact:userData.email
        })
 return res.status(201).json({
    message:"new Book Added successfully",
    success:true,
    book:newBook

 })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
          });
    }
}

export const getBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const existBook = await bookModel.findById(bookId).populate({
      path: 'author',
      select: '-password',
    });

    if (!existBook) {
      return res.status(404).json({
        message: "Book not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Book fetched successfully",
      success: true,
      book: existBook,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const deleteBook = async (req, res) => {
    try {
      const { bookId } = req.params;
      const userId = req.userData._id;
  
      const existBook = await bookModel.findById(bookId);
      if (!existBook) {
        return res.status(404).json({
          message: "Book not found",
          success: false,
        });
      }
  
      if (existBook.author.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You cannot delete someone else's book",
        });
      }
  
      await bookModel.findByIdAndDelete(bookId);
  
      return res.status(200).json({
        success: true,
        message: "Book deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };

  export const getBookByOwner=async(req,res)=>{
    try {
      const {_id,role}=req.userData;
      if(role!=='Owner'){
        return res.status(400).json({
          success:false,
          message:"Only Owner can have books"
        })
      }

      const Books=await bookModel.find({author:_id}).sort({createdAt:-1})
      return res.status(200).json({
        message:"Sucessfully fetched Books",
        success:true,
        books:Books
      })
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  export const getBooksFeed = async (req, res) => {
    try {
      const userId = req.userData._id;
  
      const books = await bookModel.find({
        author: { $ne: userId }, 
      }).populate({
        path: 'author',
        select: '-password',
      });
  
      return res.status(200).json({
        success: true,
        message: "Books feed fetched successfully",
        books,
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  

  export const updateBookByOwner = async (req, res) => {
    try {
      const { bookId } = req.params;
      const userId = req.userData._id;
  
      const existingBook = await bookModel.findById(bookId);
  
      if (!existingBook) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }
  
      if (existingBook.author.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to update this book",
        });
      }
  
     
      const { genre, title, city, imageUrl } = req.body;
  
      if (!genre && !title && !city && !imageUrl) {
        return res.status(400).json({
          success: false,
          message: "At least one field (genre, title, city, imageUrl) is required to update",
        });
      }
  
      const updates = {};
      if (genre) updates.genre = genre;
      if (title) updates.title = title;
      if (city) updates.city = city;
      if (imageUrl) updates.imageUrl = imageUrl;
  
      const updatedBook = await bookModel.findByIdAndUpdate(bookId, updates, {
        new: true,
        runValidators: true,
      });
  
      return res.status(200).json({
        success: true,
        message: "Book updated successfully",
        book: updatedBook,
      });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
  
