import { Router } from "express";
import { attachUser } from "../middleware/attachUser";
import { validateRequest } from "../middleware/validateRequest";
import {
  createAddressValidator,
  updateAddressValidator,
} from "../validators/address.validator";
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller";
import { param } from "express-validator";

const router = Router();

router.use(attachUser);

router.get("/", listAddresses);
router.post("/", createAddressValidator, validateRequest, createAddress);
router.patch("/:id", updateAddressValidator, validateRequest, updateAddress);
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid address id"),
  validateRequest,
  deleteAddress,
);
export default router;
