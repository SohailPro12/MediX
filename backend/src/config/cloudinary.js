const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,

});

module.exports = cloudinary;
