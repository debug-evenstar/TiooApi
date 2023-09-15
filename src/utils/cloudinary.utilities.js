const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ?? "dbgorivob",
  api_key: process.env.CLOUD_API_KEY ?? "315432741815641",
  api_secret: process.env.CLOUD_SECRET ?? "OqVKZl5cyov6w762Rw4Kn9LulAI",
});

const cloudinaryUploadImage = async(fileToUpload)=>{

    const res = await cloudinary.uploader.upload(fileToUpload, {public_id: "olympic_flag"});
   
    return res;
}

module.exports = cloudinaryUploadImage