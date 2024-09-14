import express from "express"
import authRouter from "./controllers/user.controller.js"
// import authMiddleware from "./middlewares/auth.middleware.js";
import { authenticateToken, authorizeRole } from './middlewares/auth.middleware.js';
import {roles,permissions} from "./roles.js"
import connectDB from "./db/index.js";
import dotenv from "dotenv"



dotenv.config({
    path: './env'
})

const app = express();

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("mongodb connection failed !!!",err);
})


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));


app.use('/auth', authRouter);

// app.get('/public', (req, res) => {
//   res.send('Public route');
// });

// app.get('/user', authMiddleware([roles.USER, roles.ADMIN] ), (req, res) => {
//   res.send('User route');
// });

// app.get('/admin', authMiddleware([roles.ADMIN]), (req, res) => {
//   res.send('Admin route');
// });

app.get('/public', (req, res) => {
  res.json({ message: 'Public route' });
});

app.get('/user', authenticateToken, authorizeRole(roles.USER), (req, res) => {
  res.json({ message: 'User route' });
});

app.get('/admin', authenticateToken, authorizeRole(roles.ADMIN), (req, res) => {
  res.json({ message: 'Admin route' });
});

app.use((req, res, next) => {
  const { method, url } = req;
  const { role } = req.user || { role: 'Guest' };
  console.log(`[${new Date().toISOString()}] ${method} ${url} - Role: ${role}`);
  next();
});






