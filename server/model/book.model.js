import mongoose from "mongoose";


const BookSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String,
        min:6,
        trim:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    genre: {
        type: String,
        required: true,
        trim: true,
        enum: [
            'Action', 'Adventure', 'Biography', 'Comedy', 'Drama', 'Fantasy',
            'Fiction', 'History', 'Horror', 'Mystery', 'Non-fiction', 'Romance',
            'Science Fiction', 'Self-help', 'Thriller'
          ], 
    },
    city:{
        type:String,
        required:true,
        trim:true

    },
    contact:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    }
    

},{
    timestamps:true
})


const bookModel=mongoose.model('Book',BookSchema)

export default bookModel
