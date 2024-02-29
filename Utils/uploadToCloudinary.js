const cloudinary = require("cloudinary").v2;

const uploadeToCloudinary = async(file, folder, height, quality) => {
    const options ={folder}
    if(quality){
        options.quality = quality;
    }

    if(height){
        options.height = height;
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath,options);

    return result;
}

module.exports = uploadeToCloudinary;