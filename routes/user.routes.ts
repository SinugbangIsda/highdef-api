import express from 'express';
import { USER_BY_ID_ROUTE, USER_PER_PAGE_ROUTE, USER_ROUTE } from '../constants/routes';
import { deleteUser, deleteUsers, getUser, getUsers, getUsersPerPage, updateUser } from '../controllers/user.controller';
import verifyToken from '../middlewares/verifyToken';

const router = express();

router.get(USER_BY_ID_ROUTE, verifyToken, getUser);
router.get(USER_PER_PAGE_ROUTE, verifyToken, getUsersPerPage);
router.get(USER_ROUTE, verifyToken, getUsers);
router.put(USER_BY_ID_ROUTE, verifyToken, updateUser);
router.delete(USER_BY_ID_ROUTE, verifyToken, deleteUser);
router.delete(USER_ROUTE, verifyToken, deleteUsers);

export default router;
