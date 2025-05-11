const express = require("express");
const {register,login}= require("../controllers/authController");
const {authenticateToken} = require("../middlewares/authMiddleware");
const {getDashboard} = require("../controllers/authController")

const router = express.Router();


router.post("/register",register);
router.post("/login",login);


router.get("/dashboard",authenticateToken, getDashboard); //Get Dashboard


module.exports = router;
