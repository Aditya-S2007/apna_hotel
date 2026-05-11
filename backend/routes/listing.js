const express = require("express");
const router=express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} =require("../middleware.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({ storage });




router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createListing )
);

// new route 3.
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,
  wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyLisitng));

//edit route 5.
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


// index route 1.
// router.get("/",wrapAsync(listingController.index));



// show route 2.
// router.get("/:id",wrapAsync(listingController.showListing)
// );

//create route 4.
// router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing )
// );



// update route 6.
// router.put(
//   "/:id",isLoggedIn,isOwner,validateListing,
//   wrapAsync(listingController.updateListing)
// );
    

// delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyLisitng)
// );

module.exports=router;