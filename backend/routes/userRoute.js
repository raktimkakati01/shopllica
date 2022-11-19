const express = require("express");
const router = express.Router();
const { registerUser,
        loginUser,
        logout, 
        getUser, 
        loginStatus, 
        updateUser, 
        changePassword 
} 
= require("../controllers/userController");
const protect = require("../middleWare/authMiddleware");


// const registerUser = () => {};

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser", protect, getUser);
router.get("/loggedin", loginStatus);
router.patch("/updateuser", protect, updateUser);
router.patch("/changepassword", protect, changePassword);



module.exports = router;



//3:20:37