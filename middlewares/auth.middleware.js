import jwt from "jsonwebtoken"
import {roles,permissions} from "../roles.js"
// const authMiddleware = (requiredRole) => {
//   // return (req, res, next) => {
//   //   const authHeader = req.header('Authorization');
//   //   if (!authHeader) {
//   //     return res.status(401).json({ message: 'Unauthorized mY' });
//   //   }

//   //   const token  = authHeader.split(' ')[1];
//   //   try {
//   //     const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   //     const userRole = decodedToken.role;

//   //     if (!permissions[userRole].includes('*') && !permissions[userRole].includes(req.path)) {
//   //       return res.status(403).json({ message: 'Forbidden' });
//   //     }

//   //     req.user = decodedToken;
//   //     next();
//   //   } catch (error) {
//   //     return res.status(401).json({ message: 'Unauthorized' });
//   //   }
//   // };
// //   return (req, res, next) => {
// //     const token = req.header('Authorization');
// //     if (!token) {
// //         return res.status(401).json({ message: 'Unauthorized' });
// //     }
// //     try {
// //         const decoded = jwt.verify(token,   
// // 'your-secret-key');
// //         const userRole = decoded.role;
// //         if (!allowedRoles.includes(userRole)) {
// //             return res.status(403).json({ message: 'Forbidden' });
// //         }
// //         req.user = decoded;
// //         next();
// //     } catch (error) {
// //         res.status(401).json({ message: 'Unauthorized' });
// //     }
// // };
// };

// export default authMiddleware


// auth.middleware.js


export function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Please login to access this resource.' });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token. Please login again.' });
    }
    req.user = decoded;
    next();
  });
}



export function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please login to access this resource.' });
    }
    if (req.user.role !== role && req.user.role != roles.ADMIN) {
      return res.status(403).json({ error: `Forbidden. Your role (${req.user.role}) does not have permission to access this resource. Required role: ${role}` });
    }
    next();
  };
}

// Bonus feature: Update user roles
export function updateUserRole(newRole) {
  // Retrieve the user ID from the req.user object
  return (req,res,next) => {
    const userId = req.user._id;

  // Update the user's role in the database
  User.findByIdAndUpdate(userId, { role: newRole }, (err, user) => {
    if (err) {
      console.error(err);
    } else {
      res.status(200).json(`User role updated to ${newRole}`);
    }
  });
  }
}