import { Router } from "express";
import validate from "../../../middlewares/validate.js";
import asyncHandler from "../../../utils/async-handler.js";
import { userPayloadSchema } from "../validators.js";
import { createUser, getUserById } from "../controller/user-controller.js";

const router = Router();

router.post("/", validate(userPayloadSchema), asyncHandler(createUser));

router.get("/:id", asyncHandler(getUserById));

export default router;
