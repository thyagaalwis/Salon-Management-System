import mongoose from "mongoose";

const inventorySchema = mongoose.Schema(
    {
    ItemNo : {
        type: String,
        unique: true
    },
    ItemName: {
        type: String,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    },
    Quantity: {
        type: String,
        required: true,
    },
    Price: {
        type: String,
        required: true,
    },
    SupplierName: {
        type: String,
        required: true,
    },
    SupplierEmail: {
        type: String,
        required: true,
    },

    }
);

const counterSchema = mongoose.Schema({
    _id: { type: String, required: true},
    seq: { type: Number, default: 1 }
});

const ICounterr = mongoose.model('ICounterr', counterSchema);

inventorySchema.pre('save', async function (next) {
    try{
        if (this.isNew) {
            const doc = await ICounterr.findOneAndUpdate(
                { _id: 'ItemNo ' }, 
                { $inc: { seq: 1 } }, 
                { new: true, upsert: true });
            this.ItemNo  = 'Item' + doc.seq; // Modified to 'ItemNo '
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const Inventory = mongoose.model('Inventory' ,inventorySchema);