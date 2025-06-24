import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema(
    {
    cusID: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    phone_number:{
        type:String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    employee:{
        type: String,
        required: true,
    },
    date_of_service:{
        type: Date,
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    star_rating:{
        type:Number,
        required: true,
    },
}
    
);
export const Feedback = mongoose.model('Feedback' ,feedbackSchema);