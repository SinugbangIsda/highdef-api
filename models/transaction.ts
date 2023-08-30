import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        transaction_name: {
            type: String,
            required: true
        },
        products: {
            type: Array<Object>,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        total_price: {
            type: Number,
            required: true
        },
        is_deleted: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.model('Transactions', transactionSchema);

export default Transaction;
