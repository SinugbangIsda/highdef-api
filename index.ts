import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import cors from 'cors';
import transactionsRoute from './routes/transactions.routes';
import authRoute from './routes/auth.routes';
import userRoute from './routes/user.routes';
import cron from 'node-cron';
import Transaction from './models/transaction';

const app = express();

mongoose
    .connect(config.mongo.url)
    .then(() => {
        console.log('Connected to MongoDB!');
        startServer();
    })
    .catch((error) => {
        console.log(error);
    });

const startServer = () => {
    app.use((req, res, next) => {
        console.log(`Incoming -> Method:[${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            console.log(`Incoming -> Method:[${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });

        next();
    });

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());

    // API Rules
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    // Routes
    app.use(authRoute);
    app.use(userRoute);
    app.use(transactionsRoute);

    // Health check
    app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    // Error handling
    app.use((req, res, next) => {
        const error = new Error('Not found');
        console.log(error);

        res.status(404).json({
            message: error.message
        });
    });

    // CRON
    const schedule = () => {
        const cronJobPattern = '0 0 */14 * *'; // This will run the task at midnight every 2 weeks

        const cronTask = async () => {
            try {
                console.log('Deleting transactions...');
                const deletedTransactions = await Transaction.deleteMany({ is_deleted: true });
                console.log(`Deleted ${deletedTransactions.deletedCount} transactions.`);
            } catch (error) {
                console.error('An error occurred while deleting transactions:', error);
            }
        };

        cron.schedule(cronJobPattern, cronTask);
    };

    schedule();

    http.createServer(app).listen(config.server.port, () => console.log(`Server is running on port ${config.server.port}.`));
};
