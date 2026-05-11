const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema.js");


module.exports.index=async(req,res)=>{ // to print title data adn indi id in index ejs in loop
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req,res)=>{  // 1. index ejs new get req "/listins/new" in form botton main page
  // console.log(req.user); 
  
  res.render("listings/new.ejs");  // 2. in new ejs new data input and action =post req /listings
};

module.exports.showListing= async(req,res)=>{ // 1. req from index route 2. take req id and find 3. render and print all detail in show ejs
    let {id}= req.params;
    const listing = await Listing.findById(id)
    .populate({  // for each review we used populate but for each review author we have use nested populate
      path : "reviews",
      populate:{
        path:"author",
      },
    })
    .populate("owner");

    if(!listing){
      req.flash("error","Listing u requested for doesn't exit!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async(req,res,next)=>{  // 1. all data will come in the body 2.exract and use mongodb single insert command
 // {title,description,img....location}=req.body old method
 //let listing=req.body.listing;
let url=req.file.path;
let filename= req.file.filename;
console.log(url,"..",filename);

 listingSchema.validate(req.body);
 const newlisting= new Listing(req.body.listing);  // tips: best way to reqire from body 'name "listing[title]"' in new.ejs
 newlisting.owner = req.user._id; // its will new user owned_by is current user
 newlisting.image = {url,filename};
 await newlisting.save();
 req.flash("success","New Listing Created!");
 res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{ //1. show ejs add link /id req 2. edit.ejs form to take data and in action=send put req 
    let {id}= req.params;
    const listing = await Listing.findById(id);
     if(!listing){
      req.flash("error","Listing u requested for doesn't exit!");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250"); // this is to crop image using cloudinary api
    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing=async (req, res) => {
    // 1. got all data frrom edit.ejs
   
    let { id } = req.params;
    const listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //2. find and update though put req
    if(typeof req.file !=="undefined"){  // it will change to new img but if we didn't change it will remain same
    let url = req.file.path;           //if it came undefined the if condition will not run
    let filename = req.file.filename;
    listing.image = { url,filename };
    await listing.save();
  }

    req.flash("success"," Listing Update!");
    res.redirect(`/listings/${id}`);
    
    // console.log(req.body.listing);
  };

module.exports.destroyLisitng= async(req,res)=>{ // 1. show.ejs add form action "/listings/:id" (for delete req)
    let {id}=req.params;
    let deleteListing= await Listing.findByIdAndDelete(id); // 2. find and delete
   console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
    
};