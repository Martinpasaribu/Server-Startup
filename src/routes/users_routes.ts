import { Router } from "express";
import UserModel from "../models/user_models";
import { verifyToken } from "../middlewares/verifyToken";

const CustomerRouter = Router();

CustomerRouter.get("/", verifyToken, async (req, res) => {
  const userData = (req as any).user;
  const user = await UserModel.findById(userData.id).select("email name picture");
  res.json(user);
});

export default CustomerRouter;
