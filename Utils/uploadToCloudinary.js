const cloudinary = require("cloudinary").v2;

const uploadeToCloudinary = async(file, folder, quality) => {
    const options = {
        folder: folder,
        quality: quality,
    }

    const result = await cloudinary.uploader.upload(file,options);

    return result;
}

module.exports = uploadeToCloudinary;