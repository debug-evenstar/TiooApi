const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ?? "dbgorivob",
  api_key: process.env.CLOUD_API_KEY ?? "315432741815641",
  api_secret: process.env.CLOUD_SECRET ?? "OqVKZl5cyov6w762Rw4Kn9LulAI",
});

const cloudinaryUploadImage = async(fileToUpload)=>{

    const timestamp = new Date().getTime(); // Generate a unique timestamp
    const publicId = `image_${timestamp}`; // Create a unique public_id

    const res = await cloudinary.uploader.upload(fileToUpload, {public_id: publicId, resource_type: 'auto'});
   
    return res;
}

module.exports = cloudinaryUploadImage