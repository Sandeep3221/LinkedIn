import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs/promises'
const uploaadOnCloudinary=async(filePath)=>{
        cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
        });
        try {
                if(!filePath){
                        return null
                }
                const uploadResult = await cloudinary.uploader.upload(filePath)
                await fs.unlink(filePath)//to delete the image
                return uploadResult.secure_url//to get the url
        } catch (error) {
                await fs.unlink(filePath)
                console.log(error)
        }
}
export default uploaadOnCloudinary