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

        const transaction = new Transaction({ ...req.body, isDeleted: false });
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

export const getTransactionsPerPage = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, isDeleted = false } = req.query;
        const query = { isDeleted: isDeleted === 'true' };
        const transactions = await Transaction.aggregate([{ $match: query }, { $sort: { createdAt: -1 } }, { $skip: (+page - 1) * +limit }, { $limit: +limit }]);
        const count = await Transaction.countDocuments(query);

        res.status(200).json({ transactions, totalPages: Math.ceil(count / +limit), currentPage: parseInt(page as string) });
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getRecentTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(transactions);
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
