const User = require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res,next)=>{
    try {
        let{username,email,password} = req.body; // to exract data from form in signup.ejs
    const newUser= new User ({email,username}); // creating new document in user collection
    const registeredUser= await User.register(newUser,password); // insert schema with user password
    console.log(registeredUser);
   req.login(registeredUser,(err)=>{
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
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req,res)=>{ // authi will help with built in authentiation then our stratgy is "local" , f.r "if we fail it will redirect to login page" , f.f "it will flash the error"
   req.flash("success","Welcome back master.... its ur Wanderlust 😘");
   let redirectUrl=res.locals.redirectUrl || "/listings"
   res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings");
    })
};