import User from "../models/users.js";
import jwt from "jsonwebtoken";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role, skills, experience } = req.body;

//     if (!name || !email || !password) {
//       return errorResponse(res, "Please fill all required fields", 400);
//     }

//     const userExists = await User.findOne({ email });

//     if (userExists) {
//       return errorResponse(res, "User already exists", 400);
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role: role || "user",

//       skills: role === "worker" ? skills : [],
//       experience: role === "worker" ? experience : 0,
//     });

//     return successResponse(
//       res,
//       "User registered successfully",
//       {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//       201
//     );
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, skills, experience } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, "Please fill all required fields", 400);
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return errorResponse(res, "User already exists", 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "user",
      skills: role === "worker" ? skills : [],
      experience: role === "worker" ? experience : 0,
    });

    return successResponse(
      res,
      "User registered successfully",
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      201
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");

      return errorResponse(res, validationErrors, 400);
    }

    if (error.code === 11000) {
      return errorResponse(res, "Email or username already exists", 400);
    }

    return errorResponse(res, error.message || "Registration failed", 500);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Please enter email and password", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    if (role && user.role !== role) {
      return errorResponse(
        res,
        `This account is registered as ${user.role}. Please use the correct login.`,
        403
      );
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return successResponse(res, "Login successful", {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
