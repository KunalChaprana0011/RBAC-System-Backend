import express from "express";
import authRouter from "./controllers/user.controller.js";
// import authMiddleware from "./middlewares/auth.middleware.js";
import {
  authenticateToken,
  authorizeRole,
  logger,
} from "./middlewares/auth.middleware.js";
import { roles, permissions } from "./roles.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { User } from "./models/users.model.js";

dotenv.config({
  path: "./env",
});

const app = express();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongodb connection failed !!!", err);
  });

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

// app.get('/public', (req, res) => {
//   res.send('Public route');
// });

// app.get('/user', authMiddleware([roles.USER, roles.ADMIN] ), (req, res) => {
//   res.send('User route');
// });

// app.get('/admin', authMiddleware([roles.ADMIN]), (req, res) => {
//   res.send('Admin route');
// });

app.get("/public", (req, res) => {
  res.json({ message: "Public route" });
});

app.get(
  "/user",
  authenticateToken,
  logger,
  authorizeRole(roles.USER),
  (req, res) => {
    res.json({ message: "User route" , user : req.user });
  }
);

app.get(
  "/admin",
  authenticateToken,
  logger,
  authorizeRole(roles.ADMIN),
  (req, res) => {
    res.json({ message: "Admin route" });
  }
);
// app.get("/user", (req,res) => {
//   res.json({message : "User" , user : req.user})
// })
app.put(
  "/admin/update-role/:id",
  authenticateToken,
  logger,
  authorizeRole(roles.ADMIN), // Only admins can access this route
  async (req, res) => {
    const { id } = req.params; // The user ID to be updated
    const { newRole } = req.body; // The new role from the request body

    if (!Object.values(roles).includes(newRole)) {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    try {
      // Find the user by ID and update their role
      const user = await User.findByIdAndUpdate(
        id,
        { role: newRole },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      res
        .status(200)
        .json({ message: `User role updated to ${newRole}`, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);