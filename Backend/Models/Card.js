import mongoose from 'mongoose';

const cardSchema = mongoose.Schema({
    CusID: {
        type: String,
    },
    Amount: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true,
    },
    Cardno: {
        type: String,
      
    },
    expMonth: {
        type: String,
        required: true,
    },
    expYear: {
        type: String,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
    }
});



export const Card = mongoose.model('Card', cardSchema);