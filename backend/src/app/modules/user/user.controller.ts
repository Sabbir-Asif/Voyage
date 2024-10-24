import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { User } from "./user.interface";

const createUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const { email, username } = user;
    if (!email || !username) {
      return res
        .status(400)
        .json({ message: "Username, email and password are required." });
    }

    const existingAccounts = await UserServices.getUserByEmailOnly({ email });
    if (existingAccounts) {
      return res
        .status(400)
        .json({ success: false, message: "This email is already registered." });
    }

    const result = await UserServices.createUserIntoDB(user);
    console.log("User data: ", user);
    res.status(200).json({
      success: true,
      message: "New user created successfully",
      data: result,
    });
  } catch (err) {
    console.log("Error ocurred while creating new user: ", err);
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await UserServices.getUserByEmail({ email });
    if (!result) {
      return res.status(200).json({
        authSuccess: false,
        message: "No user found with these credentials.",
        data: null,
      });
    }
    res.status(200).json({
      authSuccess: true,
      message: "User data fetched successfully.",
      data: result,
    });
  } catch (err) {
    console.log("Error occurred while fetching user info: ", err);
  }
};

// Controller function to handle search user requests
const searchUsers = async (req: Request, res: Response) => {
  try {
    // Extract search key from the query parameters
    const searchKey: string = req.query.searchKey as string;

    // Validate if search key is provided
    if (!searchKey || searchKey.trim() === "") {
      return res.status(400).json({ message: "Search key is required" });
    }

    // Call the service to search users
    const users = await UserServices.searchUsersByName(searchKey);

    // If no users are found
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the found users
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error while searching for users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const UserControllers = {
  createUser,
  getUsers,
  searchUsers,
};
