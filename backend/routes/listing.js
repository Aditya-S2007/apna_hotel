const express = require("express");
const router=express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} =require("../middleware.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const listingController = require("../controllers/listings.js");






// index route 1.
router.get("/",wrapAsync(listingController.index));

// new route 3.
router.get("/new",isLoggedIn,listingController.renderNewForm);

// show route 2.
router.get("/:id",wrapAsync(listingController.showListing)
);

//create route 4.
router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing )
);

//edit route 5.
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm)
);

// update route 6.
router.put(
  "/:id",isLoggedIn,isOwner,validateListing,
  wrapAsync(listingController.updateListing)
);
    

// delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyLisitng)
);

module.exports=router;