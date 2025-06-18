import cors from "cors"
import connectDB from "./DB/connection.js"
import authRouter from "./routes/auth/auth.controller.js"
import globalErrorHandler from "./utils/errorHandeling/globalErrorHandler.js"
import notFoundHandler from "./utils/errorHandeling/notFoundHandler.js"
import dotenv from "dotenv"
import { rateLimit } from 'express-rate-limit';
import helmet from "helmet";
import swaggerUi from 'swagger-ui-express';
import specs from './docs/swagger.js';

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

    // Swagger documentation route
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Chat Application API Documentation'
    }));

    /**
     * @swagger
     * /api/health:
     *   get:
     *     summary: Health check endpoint
     *     tags: [System]
     *     responses:
     *       200:
     *         description: Server is healthy
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "OK"
     *                 message:
     *                   type: string
     *                   example: "Server is running"
     *                 timestamp:
     *                   type: string
     *                   format: date-time
     */
    app.get('/api/health', (req, res) => {
        res.status(200).json({
            status: 'OK',
            message: 'Server is running',
            timestamp: new Date().toISOString()
        });
    });

    app.use('/api', authRouter)

    app.use(globalErrorHandler)
    app.use(notFoundHandler)
}

export default bootstrap;