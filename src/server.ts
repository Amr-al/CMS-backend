require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss";
import { conect } from "./utils/DBConnection";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import userRoutes from './routers/userRoutes'
import articleRoutes from './routers/articleRoutes'

app.use(express.json());

//Allow cors for all domains
app.use(
  cors({
    origin: "*",
    credentials: true,
  }) as any
);
conect();

//Use morgan logger in the develpment
app.use(morgan("dev"));

//Set security http headers
app.use(helmet());

//Data sanitization against xss attacks
xss('<script>alert("xss");</script>');

// global routes
app.use('/api/auth',userRoutes);
app.use('/api/article',articleRoutes )

app.all("*", (req: any, res: any, next: any) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
});
app.use(globalErrorHandler);

export default app;
