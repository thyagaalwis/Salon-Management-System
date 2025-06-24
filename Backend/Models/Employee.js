import mongoose from "mongoose";

const employeeSchema = mongoose.Schema(
    {
    EmpID: {
        type: String,
        unique: true
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

    }
);

const counterSchema = mongoose.Schema({
    _id: { type: String, required: true},
    seq: { type: Number, default: 1 }
});

const ECounterr = mongoose.model('ECounterr', counterSchema);

employeeSchema.pre('save', async function (next) {
    try{
        if (this.isNew) {
            const doc = await ECounterr.findOneAndUpdate(
                { _id: 'EmpID' }, 
                { $inc: { seq: 1 } }, 
                { new: true, upsert: true });
            this.EmpID = 'EMP' + doc.seq; // Modified to 'EmpID'
        }
        next();
    } catch (error) {
        next(error);
    }
});

export const Employee = mongoose.model('Employee' ,employeeSchema);