import { Request, Response } from 'express';
import Transaction from '../models/transaction';

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const transactionExists = await Transaction.findOne({
            transaction_name: req.body.transaction_name
        });

        if (transactionExists) {
            throw 'Transaction name already exists!';
        }

        const transaction = new Transaction({ ...req.body, is_deleted: false });
        const savedTransaction = await transaction.save();
        res.status(200).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const findAndUpdateTransaction = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(findAndUpdateTransaction);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getTransaction = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const findTransaction = await Transaction.findById(id);
        res.status(200).json(findTransaction);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const { is_deleted, status } = req.query;
        const query = { is_deleted: is_deleted, status: status };

        if (status === undefined) {
            delete query.status;
        }

        if (is_deleted === undefined) {
            delete query.is_deleted;
        }

        const transactions = await Transaction.find(query).sort({ createdAt: -1 }).select('-__v');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getRecentTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find({ is_deleted: false, status: 'Completed' }).sort({ createdAt: -1 }).limit(5).select('-__v');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getTransactionsStatistics = async (req: Request, res: Response) => {
    try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const total_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    status: 'Completed',
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            { $group: { _id: null, val: { $sum: '$total_price' } } }
        ]);
        const average_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    status: 'Completed',
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            { $group: { _id: null, val: { $avg: '$total_price' } } }
        ]);
        const highest_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    status: 'Completed',
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            { $group: { _id: null, val: { $max: '$total_price' } } }
        ]);
        const pending_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    status: 'Pending',
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            { $group: { _id: null, val: { $sum: '$total_price' } } }
        ]);
        const daily_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    status: 'Completed',
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            { $group: { _id: null, val: { $sum: 1 } } }
        ]);

        const totalSalesValue = total_sales[0] && total_sales[0].val ? total_sales[0].val : 0;
        const highestSalesValue = highest_sales[0] && highest_sales[0].val ? highest_sales[0].val : 0;
        const averageSalesValue = average_sales[0] && average_sales[0].val ? average_sales[0].val : 0;
        const pendingSalesValue = pending_sales[0] && pending_sales[0].val ? pending_sales[0].val : 0;
        const dailySalesValue = daily_sales[0] && daily_sales[0].val ? daily_sales[0].val : 0;

        const statistics = {
            total: totalSalesValue,
            average: averageSalesValue,
            highest: highestSalesValue,
            pending: pendingSalesValue,
            daily: dailySalesValue
        };
        res.status(200).json(statistics);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const findAndDeleteTransaction = await Transaction.findByIdAndDelete(id);
        res.status(200).json(findAndDeleteTransaction);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const deleteTransactions = async (req: Request, res: Response) => {
    try {
        const deleteTransactions = await Transaction.deleteMany({ isDeleted: true });
        res.status(200).json(deleteTransactions);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const exportTransactionsFile = async (req: Request, res: Response) => {};
