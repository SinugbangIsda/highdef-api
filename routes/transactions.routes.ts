import express from 'express';
import { TRANSACTIONS_BY_ID_ROUTE, TRANSACTIONS_PER_PAGE_ROUTE, TRANSACTIONS_ROUTE } from '../constants/routes';
import { createTransaction, deleteTransaction, deleteTransactions, getTransaction, getTransactions, getTransactionsPerPage, updateTransaction } from '../controllers/transaction.controller';

const router = express.Router();

router.get(TRANSACTIONS_PER_PAGE_ROUTE, getTransactionsPerPage);
router.get(TRANSACTIONS_BY_ID_ROUTE, getTransaction);
router.get(TRANSACTIONS_ROUTE, getTransactions);
router.post(TRANSACTIONS_ROUTE, createTransaction);
router.put(TRANSACTIONS_BY_ID_ROUTE, updateTransaction);
router.delete(TRANSACTIONS_ROUTE, deleteTransactions);
router.delete(TRANSACTIONS_BY_ID_ROUTE, deleteTransaction);

export default router;
