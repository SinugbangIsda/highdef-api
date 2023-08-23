import express from 'express';
import { signin, signup } from '../controllers/auth.controller';
import { SIGNIN_ROUTE, SIGNUP_ROUTE } from '../constants/routes';

const router = express.Router();

router.post(SIGNIN_ROUTE, signin);
router.post(SIGNUP_ROUTE, signup);

export default router;
