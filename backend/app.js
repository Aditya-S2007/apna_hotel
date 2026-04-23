const express=require("express");
const app = express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const path =require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{console.log("connected to db")})
    .catch((err)=>{
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);

}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// index route 1.
app.get("/listings",async(req,res)=>{ // to print title data adn indi id in index ejs in loop
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

// new route 3.
app.get("/listings/new",(req,res)=>{  // 1. index ejs new get req "/listins/new" in form botton main page
    res.render("listings/new.ejs");  // 2. in new ejs new data input and action =post req /listings
});

// show route 2.
app.get("/listings/:id", async(req,res)=>{ // 1. req from index route 2. take req id and find 3. render and print all detail in show ejs
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//create route 4.
app.post("/listings", wrapAsync( async(req,res,next)=>{  // 1. all data will come in the body 2.exract and use mongodb single insert command
 // {title,description,img....location}=req.body old method
 //let listing=req.body.listing;
 const newlisting= new Listing(req.body.listing);  // tips: best way to reqire from body 'name "listing[title]"' in new.ejs
 await newlisting.save();
 res.redirect("/listings");
})
);

//edit route 5.
app.get("/listings/:id/edit",async(req,res)=>{ //1. show ejs add link /id req 2. edit.ejs form to take data and in action=send put req 
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

// update route 6.
    app.put("/listings/:id", async(req,res)=>{ // 1. got all data frrom edit.ejs 
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); //2. find and update though put req 
    res.redirect(`/listings/${id}`);
    // console.log(req.body.listing);
});
    

// delete route
app.delete("/listings/:id",async(req,res)=>{ // 1. show.ejs add form action "/listings/:id" (for delete req)
    let {id}=req.params;
    let deleteListing= await Listing.findByIdAndDelete(id); // 2. find and delete
    res.redirect("/listings");
    console.log(deleteListing);
}); 


// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"india",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("success");
// });
app.get("/",(req,res)=>{
   res.send("I AM GROOT");
});

app.use((err,req,res,next)=>{
    res.send("something went wrong");
});
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});