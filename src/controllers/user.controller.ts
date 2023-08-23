import { Request, Response } from 'express';
import User from '../models/user.model';

export const getUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const findUser = await User.find({ _id: id });
        res.status(200).json(findUser);
    } catch (error) {
        res.status(400).json({ message: error });
    }
};
