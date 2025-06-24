import mongoose from "mongoose";

// Counter Schema
const counterSchema = mongoose.Schema({
    _id: { type: String, required: true }, // This will hold the collection name (e.g., 'p_ID')
    seq: { type: Number, default: 1 } // Sequence number starts at 1
});

// Model for the counter collection
const PkgCounter = mongoose.model('PkgCounter', counterSchema);

// SaloonPackage Schema
const pkgSchema = mongoose.Schema(
    {
        ID: {
            type: String,
            unique: true
        },
        p_name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        base_price: {
            type: Number,
            required: true
        },
        discount_rate: {
            type: Number,
            required: true
        },
        final_price: {
            type: Number,
            required: true
        },
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
            required: true
        },
        conditions: {
            type: String,
        },
        package_type: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    }
);

// Pre-save hook to generate p_ID
pkgSchema.pre('save', async function (next) {
    try {
        if (this.isNew) {
            // Fetch the sequence and increment it
            const doc = await PkgCounter.findOneAndUpdate(
                { _id: 'ID' }, // Counter for p_ID
                { $inc: { seq: 1 } }, // Increment by 1
                { new: true, upsert: true } // Create counter if it doesn't exist
            );
            this.ID = 'package' + doc.seq; // Generate unique p_ID, e.g., 'package1'
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Export the Pkg model
export const Pkg = mongoose.model('Pkg', pkgSchema);
