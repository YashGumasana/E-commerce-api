import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';

import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';


import express from 'express';
const app = express();

//Connect DB
import connectDB from './db/connect.js';

//routers
import authRouter from './router/auth_r.js'
import orderRouter from './router/order_r.js'
import productRouter from './router/product_r.js'
import reviewRouter from './router/review_r.js'
import userRouter from './router/user_r.js'

//error handler
import notFound from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

//routes

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(fileUpload());


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/user', userRouter);



app.use(notFound);
app.use(errorHandlerMiddleware);

const port = 80;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
}

start();