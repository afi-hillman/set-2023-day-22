import { Router } from "express";
import userController from "../controllers/userController";

const apiRoutes = Router();

apiRoutes.post("/user", userController.createNewUser);

export default apiRoutes;
