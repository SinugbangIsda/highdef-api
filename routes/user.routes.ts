import express from 'express';
import { USER_BY_ID_ROUTE } from '../constants/routes';
import { getUser } from '../controllers/user.controller';
import verifyToken from '../middlewares/verifyToken';

const router = express();

router.get(USER_BY_ID_ROUTE, verifyToken, getUser);

export default router;
