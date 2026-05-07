const express = require("express");
const router=express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} =require("../middleware.js");
const { listingSchema, reviewSchema } = require("../schema.js");





// index route 1.
router.get("/",wrapAsync( async(req,res)=>{ // to print title data adn indi id in index ejs in loop
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})
);

// new route 3.
router.get("/new",isLoggedIn,(req,res)=>{  // 1. index ejs new get req "/listins/new" in form botton main page
  // console.log(req.user); 
  
  res.render("listings/new.ejs");  // 2. in new ejs new data input and action =post req /listings
});

// show route 2.
router.get("/:id",wrapAsync( async(req,res)=>{ // 1. req from index route 2. take req id and find 3. render and print all detail in show ejs
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error","Listing u requested for doesn't exit!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
})
);

//create route 4.
router.post("/",isLoggedIn,validateListing, wrapAsync( async(req,res,next)=>{  // 1. all data will come in the body 2.exract and use mongodb single insert command
 // {title,description,img....location}=req.body old method
 //let listing=req.body.listing;
 listingSchema.validate(req.body);
 const newlisting= new Listing(req.body.listing);  // tips: best way to reqire from body 'name "listing[title]"' in new.ejs
 newlisting.owner = req.user._id; // its will new user owned_by is current user
 await newlisting.save();
 req.flash("success","New Listing Created!");
 res.redirect("/listings");
})
);

//edit route 5.
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( async(req,res)=>{ //1. show ejs add link /id req 2. edit.ejs form to take data and in action=send put req 
    let {id}= req.params;
    const listing = await Listing.findById(id);
     if(!listing){
      req.flash("error","Listing u requested for doesn't exit!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
})
);

// update route 6.
router.put(
  "/:id",isLoggedIn,isOwner,validateListing,
  wrapAsync(async (req, res) => {
    // 1. got all data frrom edit.ejs
   
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //2. find and update though put req
    req.flash("success"," Listing Update!");
    res.redirect(`/listings/${id}`);
    
    // console.log(req.body.listing);
  }),
);
    

// delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync( async(req,res)=>{ // 1. show.ejs add form action "/listings/:id" (for delete req)
    let {id}=req.params;
    let deleteListing= await Listing.findByIdAndDelete(id); // 2. find and delete
   console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
    
})
);

module.exports=router;