import express from 'express';
import { TRANSACTIONS_BY_ID_ROUTE, TRANSACTIONS_PER_PAGE_ROUTE, TRANSACTIONS_ROUTE } from '../constants/routes';
import { createTransaction, deleteTransaction, deleteTransactions, getTransaction, getTransactions, getTransactionsPerPage, updateTransaction } from '../controllers/transaction.controller';
import verifyToken from '../middlewares/verifyToken';

const router = express.Router();

router.get(TRANSACTIONS_PER_PAGE_ROUTE, verifyToken, getTransactionsPerPage);
router.get(TRANSACTIONS_BY_ID_ROUTE, verifyToken, getTransaction);
router.get(TRANSACTIONS_ROUTE, verifyToken, getTransactions);
router.post(TRANSACTIONS_ROUTE, verifyToken, createTransaction);
router.put(TRANSACTIONS_BY_ID_ROUTE, verifyToken, updateTransaction);
router.delete(TRANSACTIONS_ROUTE, verifyToken, deleteTransactions);
router.delete(TRANSACTIONS_BY_ID_ROUTE, verifyToken, deleteTransaction);

export default router;
