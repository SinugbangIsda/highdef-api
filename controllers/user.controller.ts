import { Request, Response } from 'express';
import User from '../models/user.model';

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const findUser = await User.find({ _id: id });
        res.status(200).json(findUser);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getUsersPerPage = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const Users = await User.aggregate([{ $sort: { createdAt: -1 } }, { $skip: ((page as number) - 1) * (limit as number) }, { $limit: (limit as number) * 1 }]);
        const count = await User.countDocuments();
        res.status(200).json({
            Users,
            totalPages: Math.ceil(count / (limit as number)),
            currentPage: parseInt(page as string)
        });
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const Users = await User.find();
        res.status(200).json(Users);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const findAndUpdateUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(findAndUpdateUser);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};
