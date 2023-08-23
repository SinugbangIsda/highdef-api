import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { SECRET_TOKEN } from '../constants/constants';

export const signin = async (req: Request, res: Response) => {
    try {
        const userExists = await User.findOne({
            emailAddress: req.body.emailAddress
        });

        if (!userExists) {
            throw { message: 'Account does not exist!' };
        }

        const verifyPassword = await bcrypt.compare(req.body.password, userExists.password);

        if (!verifyPassword) {
            throw { message: 'Incorrect password.' };
        }

        const token = jwt.sign({ _id: userExists._id }, SECRET_TOKEN, {
            expiresIn: '1h'
        });

        res.header('token', token).json({
            token: token,
            id: userExists.id
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

export const signup = async (req: Request, res: Response) => {
    try {
        const salt = await bcrypt.genSalt(14);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const userExists = await User.findOne({
            emailAddress: req.body.emailAddress
        });

        if (userExists) {
            throw { messagge: 'Account already exists!' };
        }

        const user = new User({
            ...req.body,
            password: hashedPassword
        });

        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
