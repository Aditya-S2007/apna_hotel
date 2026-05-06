const express = require("express");
const router = express.Router();  //{mergeParams:true}
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("users/signup");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try {
        let{username,email,password} = req.body; // to exract data from form in signup.ejs
    const newUser= new User ({email,username}); // creating new document in user collection
    const registeredUser= await User.register(newUser,password); // insert schema with user password
    console.log(registeredUser);
   req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Airbnb"); // to flash msg of success
            res.redirect("/listings");
        });
    } catch (e) {
       req.flash("error",e.message); // to convert error of flash msg
       res.redirect("/signup"); 
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async (req,res)=>{ // authi will help with built in authentiation then our stratgy is "local" , f.r "if we fail it will redirect to login page" , f.f "it will flash the error"
   req.flash("success","Welcome back master.... its ur Wanderlust 😘");
   let redirectUrl=res.locals.redirectUrl || "/listings"
   res.redirect(redirectUrl);
});

//logout
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    })
});

module.exports=router;

