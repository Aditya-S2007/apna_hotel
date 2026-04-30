const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing=require("../models/listing.js");

const validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
  
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};


// post review route

router.post("/",validateReview,wrapAsync(async(req,res)=>{  // 1.create form in show.ejs and send req to this route
    let listing = await Listing.findById(req.params.id); //2. find listing schema id by params which have its id
    let newReview= new Review(req.body.review); //3. use new to insert to retrived data sent by the form

    listing.reviews.push(newReview); // 4. push in listing.js which was  findbyid  and lisiting review array 

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created");

   res.redirect(`/listings/${listing.id}`);

})
);

//  review delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{ // 1.create form in show.ejs send req to this delete route
  let {id,reviewId} = req.params; //2. reqire all data and collet id's
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); //3. use find and update to delete all reviewid which match with review arry in listings
  await Review.findByIdAndDelete(reviewId); // 4. findanddelete to delete the matched reviewID from its collection callled Review
  req.flash("success","Review Deleted!");
  res.redirect(`/listings/${id}`);
})); 

module.exports=router;