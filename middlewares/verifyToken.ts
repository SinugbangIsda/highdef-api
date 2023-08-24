import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET_TOKEN } from '../constants/constants';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader === 'undefined' || null || '') {
        return res.status(403).json({ message: 'Access denied.' });
    }
    const bearer = bearerHeader;
    jwt.verify(bearer, SECRET_TOKEN, (error, verify) => {
        if (error) {
            res.status(403).json({ message: error });
        } else {
            next();
        }
    });
};

export default verifyToken;
