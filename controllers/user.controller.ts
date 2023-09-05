import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const findUser = await User.find({ _id: id, is_activated: true });
        res.status(200).json(findUser);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { is_activated = true } = req.query;
        const query = { is_activated: is_activated === 'true' };
        const Users = await User.find(query).sort({ createdAt: -1 }).select('-__v');
        res.status(200).json(Users);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const requesterId = req.body.requesterId;
        let updatedBody = req.body;
        const userData = await User.findOne({ _id: id });

        if (requesterId !== id) {
            delete updatedBody.password;
            delete updatedBody.requesterId;
        } else {
            if (!/^\$2[ayb]\$.{56}$/.test(updatedBody.password)) {
                const verifyPassword = await bcrypt.compare(updatedBody.password, userData?.password!);
                if (verifyPassword) {
                    delete updatedBody.password;
                } else {
                    const salt = await bcrypt.genSalt(14);
                    const hashedPassword = await bcrypt.hash(updatedBody.password, salt);
                    updatedBody.password = hashedPassword;
                }
            }
        }

        const findAndUpdateUser = await User.findByIdAndUpdate(id, updatedBody, { new: true });
        res.status(200).json(findAndUpdateUser);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const findAndDeleteUser = await User.findByIdAndDelete(id);
        res.status(200).json(findAndDeleteUser);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};

export const deleteUsers = async (req: Request, res: Response) => {
    try {
        const deleteUsers = await User.deleteMany();
        res.status(200).json(deleteUsers);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};
