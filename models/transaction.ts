import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        transaction_name: {
            type: String,
            required: true
        },
        products: {
            type: Array,
            required: true
        },
        isDeleted: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
);

const Transaction = mongoose.model('Transactions', transactionSchema);

export default Transaction;
