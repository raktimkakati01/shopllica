const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
};



// Register User
const registerUser = asyncHandler( async (req, res) => {
    const{name, email, password} = req.body;

    //Validation add
    if(!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be 6 characters");
    }
    // Check user email is already exist
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400);
        throw new Error("Email has already been registered");
    }
    

    // Create new User
    const user = await User.create({
        name,
        email,
        password,
    });

      // Generate Token
     const token = generateToken(user._id);


     // send HTTP only cookie
     res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1day
        sameSite: "none",
        secure: true,
     });

     

    if (user){
        const {_id, name, email, photo, phone, bio} = user;
        res.status(201).json({
            _id,
             name,
             email, 
             photo, 
             phone, 
             bio,
             token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user details");
    }
});

// login user

const loginUser = asyncHandler( async(req, res) => {

   const {email, password} = req.body

   // Validate Request
   if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
   }

   const user = await User.findOne({email})

   if(!user) {
    res.status(400);
    throw new Error("User not found, Please SignUp");
   }

   // User exists, check if password is correct

   const passwordIsCorrect = await bcrypt.compare(password, user.password);

   // Generate Token
   const token = generateToken(user._id);


   // send HTTP only cookie
   res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1day
      sameSite: "none",
      secure: true,
   });

   if(user && passwordIsCorrect) {
    const {_id, name, email, photo, phone, bio} = user;
        res.status(200).json({
            _id,
             name,
             email, 
             photo, 
             phone, 
             bio,
             token,
        });

   } else {
    res.status(400);
    throw new Error("Invalid email Or Password");
   }

});

//logout User
const logout = asyncHandler (async (req, res) => {
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0), // 1day
        sameSite: "none",
        secure: true,
     });
     return res.status(200).json({ message: "Successfully Logged Out"});
});


// Get User Data
const getUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user){
        const {_id, name, email, photo, phone, bio} = user;
        res.status(200).json({
            _id,
             name,
             email, 
             photo, 
             phone, 
             bio,
        });
    } else {
        res.status(400);
        throw new Error("User Not Found");
    }
});

//Get login status
const loginStatus = asyncHandler (async (req, res) => {

    const token = req.cookies.token;
    if(!token) {
        return res.json(false);
    }

    // verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
        return res.json(true);
    }
    return res.json(false);

});

// Update USer
const updateUser = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { _id, name, email, photo, phone, bio } = user;
        user.email = email;
        user.name  = req.body.name  || name;
        user.phone = req.body.phone || phone;
        user.bio   = req.body.bio   || bio;
        user.photo = req.body.photo || photo;


        const updatedUser = await user.save()
        res.status(200).json({
            _id   : updatedUser._id,
            name  : updatedUser.name,
            email : updatedUser.email,
            photo : updatedUser.photo,
            phone : updatedUser.phone,
            bio   : updatedUser.bio,
        })
    } else {
        res.status(404)
        throw new Error("User Not found")
    }
});

// Changed Password
const changePassword = asyncHandler (async (req, res) => {
    const user = await User.findById(req.user._id);

    const {oldPassword, password} = req.body

    if (!user) {
        res.status(400);
        throw new Error("User not found, Please singUp");
    }

    // Validate
    if (!oldPassword || !password) {
        res.status(400);
        throw new Error("Please add Old and New Password");
    }

    // check if old password matches password db
    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

    // Save new Password
    if (user && passwordIsCorrect) {
        user.password = password
        await user.save()
        res.status(200).send("Password Change Successfully");
    } else {
        res.status(400);
        throw new Error("Old Password is incorrect")
    }
});

module.exports = {
    registerUser,
    loginUser,
    logout,
    getUser,
    loginStatus,
    updateUser,
    changePassword,
};
