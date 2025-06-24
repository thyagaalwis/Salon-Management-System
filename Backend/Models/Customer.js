import mongoose from "mongoose";

const customerSchema = mongoose.Schema(
    {
    CusID: {
        type: String,
        unique: true
    },
    image: { type: String,
           
    
    },
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Age: {
        type: String,
        required: true,
    },
    Gender: {
        type: String,
        required: true,
    },
    ContactNo: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    // UserName: {
    //     type: String,
    //     required: true,
    // },
    Password: {
        type: String,
        required: true,
    }

    }
);


export const Customer = mongoose.model('Customer' ,customerSchema);