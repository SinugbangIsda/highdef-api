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
        is_completed: {
            type: Boolean,
            required: true
        },
        payment_date: {
            type: Date,
            required: false
        },
        total_price: {
            type: Number,
            required: true
        },
        is_deleted: {
            type: Boolean,
            required: true
        }
});

const Transaction = mongoose.model('Transactions', transactionSchema);

export default Transaction;
