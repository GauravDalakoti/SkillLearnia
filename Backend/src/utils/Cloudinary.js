import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true

});

const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null;


        if (!fs.existsSync(localFilePath)) {
            console.error("File does not exist:", localFilePath);
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto", secure: true });

        console.log("Deleting local file:", localFilePath);
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        } else {
            console.warn("File not found, skipping delete:", localFilePath);
        }

        response.secure_url = response.secure_url || response.url.replace(/^http:/, "https:");
        response.url = response.secure_url;

        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);

        if (fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (unlinkError) {
                console.error("Failed to delete local file after error:", unlinkError);
            }
        }

        return null;
    }
}

function getCloudinaryPublicId(url) {
    // Example: https://res.cloudinary.com/demo/video/upload/v1730000000/folder/video123.mp4
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    // Get everything after "upload/"
    const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/'); // skip "v..."
    return publicIdWithExtension.replace(/\.[^/.]+$/, ''); // remove .mp4, .jpg etc.
}

const deleteFromCloudinary = async (url) => {
    try {
        const publicId = getCloudinaryPublicId(url);
        if (!publicId) throw new Error("Invalid Cloudinary URL");

        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Deleted from Cloudinary:", result);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
    }
};


export { uploadOnCloudinary, deleteFromCloudinary }