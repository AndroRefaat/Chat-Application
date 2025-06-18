import cors from "cors"
import connectDB from "./DB/connection.js"
import authRouter from "./routes/auth/auth.controller.js"
import globalErrorHandler from "./utils/errorHandeling/globalErrorHandler.js"
import notFoundHandler from "./utils/errorHandeling/notFoundHandler.js"
import dotenv from "dotenv"
import { rateLimit } from 'express-rate-limit';
import helmet from "helmet";
const bootstrap = async (app, express) => {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        message: 'Too many requests from this IP, please try again after 15 minutes',
        legacyHeaders: false,
        standardHeaders: true,
    })
    app.use(limiter);
    await connectDB()
    app.use(express.json());
    dotenv.config();

    app.use(cors())
    app.use(helmet());
    app.use('/api', authRouter)

    app.use(globalErrorHandler)
    app.use(notFoundHandler)
}

export default bootstrap;