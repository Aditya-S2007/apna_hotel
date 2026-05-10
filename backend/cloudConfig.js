const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



cloudinary.config({       // meaing of this config to connect js with cloud
    cloud_name:process.env. CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust-DEV',
    allowerdFormats: ["png","jpg","jpeg"],
   
  },
});

module.exports={
    cloudinary,
    storage,

};
