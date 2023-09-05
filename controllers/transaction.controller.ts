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
        const { is_deleted = false } = req.query;
        const query = { is_deleted: is_deleted === 'true' };
        const transactions = await Transaction.find(query).sort({ createdAt: -1 }).select('-__v');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getRecentTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find({ is_deleted: false }).sort({ createdAt: -1 }).limit(10).select('-__v');
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

export const exportTransactionsFile = async (req: Request, res: Response) => {};
