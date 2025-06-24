import mongoose from "mongoose";

const CusIDSchema = mongoose.Schema({
    CusID: {
        type: String, // Changed to String type for custom format
        
    },

    username: {
        type: String, // Changed to String type for custom format
        
    }
});

export const HomeReadOne = mongoose.model('HomeReadOne', CusIDSchema);
