import jwt from "jsonwebtoken"
import { UserModel } from "../model/user.model.js";
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login! ");
    }

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { userId } = decodedObj;
    

    const userData = await UserModel.findById(userId);
    if (!userData) {
      throw new Error("User not found");
    }
    

    req.userData = userData;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

export default userAuth