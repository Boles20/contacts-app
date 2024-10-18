const express = require("express");
const contactController = require("../controllers/contactController");
const router = express.Router();

router.post("/", contactController.createContact);
router.get("/", contactController.getAllContacts);
router.get("/:id", contactController.getContactById);
router.put("/:id", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);
router.put("/lock/:id", contactController.lockContact);
router.put("/unlock/:id", contactController.unlockContact);

module.exports = router;
