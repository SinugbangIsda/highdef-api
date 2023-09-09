import { Request, Response } from 'express';
import Transaction from '../models/transaction';

export const createTransaction = async (req: Request, res: Response) => {
    try {
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
        const { is_deleted, is_completed } = req.query;
        const query = { is_deleted: is_deleted, is_completed: is_completed };

        if (is_completed === undefined) {
            delete query.is_completed;
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
        const transactions = await Transaction.find({ is_deleted: false, is_completed: true }).sort({ payment_date: -1 }).limit(5).select('-__v');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getTransactionsStatistics = async (req: Request, res: Response) => {
    try {
        const currentDate = new Date();
        const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const total_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_completed: true,
                    payment_date: {
                        $gte: firstDayOfCurrentMonth,
                        $lte: lastDayOfCurrentMonth
                    }
                }
            },
            { $group: { _id: null, val: { $sum: '$total_price' } } }
        ]);

        const average_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_completed: true,
                    payment_date: {
                        $gte: firstDayOfCurrentMonth,
                        $lte: lastDayOfCurrentMonth
                    }
                }
            },
            { $group: { _id: null, val: { $avg: '$total_price' } } }
        ]);

        const highest_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_completed: true,
                    payment_date: {
                        $gte: firstDayOfCurrentMonth,
                        $lte: lastDayOfCurrentMonth
                    }
                }
            },
            { $group: { _id: null, val: { $max: '$total_price' } } }
        ]);

        const pending_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_completed: false,
                    createdAt: {
                        $gte: firstDayOfCurrentMonth,
                        $lte: lastDayOfCurrentMonth
                    }
                }
            },
            { $group: { _id: null, val: { $sum: '$total_price' } } }
        ]);

        const daily_sales = await Transaction.aggregate([
            {
                $match: {
                    is_deleted: false,
                    is_completed: true,
                    payment_date: {
                        $gte: firstDayOfCurrentMonth,
                        $lte: lastDayOfCurrentMonth
                    }
                }
            },
            {
                $addFields: {
                    dayOfMonth: { $dayOfMonth: '$payment_date' },
                    date: {
                        $dateToString: {
                            format: '%m/%d/%Y',
                            date: '$payment_date'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$dayOfMonth',
                    date: { $first: '$date' },
                    total_sales: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    date: 1,
                    total_sales: 1
                }
            }
        ]);

        const getAllDatesInMonth = () => {
            const dates = [];

            for (let date = firstDayOfCurrentMonth; date <= lastDayOfCurrentMonth; date.setDate(date.getDate() + 1)) {
                dates.push(date);
            }

            return dates;
        };

        const allDatesInMonth = getAllDatesInMonth();

        const resultWithTotalSales = allDatesInMonth.map((date) => {
            const data = daily_sales.find((val) => val.date === date);
            return {
                date,
                total_sales: data ? data.total_sales : 0
            };
        });

        const totalSalesValue = total_sales[0] && total_sales[0].val ? total_sales[0].val : 0;
        const highestSalesValue = highest_sales[0] && highest_sales[0].val ? highest_sales[0].val : 0;
        const averageSalesValue = average_sales[0] && average_sales[0].val ? average_sales[0].val : 0;
        const pendingSalesValue = pending_sales[0] && pending_sales[0].val ? pending_sales[0].val : 0;
        const dailySalesValue = resultWithTotalSales.length > 0 ? resultWithTotalSales : [];

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
