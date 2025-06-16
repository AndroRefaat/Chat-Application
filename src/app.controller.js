import cors from "cors"
import connectDB from "./DB/connection.js"
import { fileURLToPath } from 'url';
import path from "path"
import authRouter from "./routes/auth/auth.controller.js"
import globalErrorHandler from "./utils/errorHandeling/globalErrorHandler.js"
import notFoundHandler from "./utils/errorHandeling/notFoundHandler.js"

const bootstrap = async (app, express) => {
    await connectDB()
    app.use(express.json());

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, '../../public')));

    app.use(cors())

    app.use('/api', authRouter)

    app.use(globalErrorHandler)
    app.use(notFoundHandler)
}

export default bootstrap;