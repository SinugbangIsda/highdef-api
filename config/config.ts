import { SERVER_PORT, MONGO_HOST, MONGO_PASSWORD, MONGO_USERNAME } from '../constants/constants';

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/highdef`;

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    }
};
