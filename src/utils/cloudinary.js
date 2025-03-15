import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

//Configuring Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//Method to upload a file on cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try 
    {
        //if local file path not found then return null
        if(!localFilePath) return null

        //upload the file on cloudinary
        //uploader function returns a promise that resolves to an object containing details about the uploaded file
        //Here respose will have the details about the uploaded file
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })

        //file has been uploaded successfully
        console.log("File has been uploaded on cloudinary ", response.url)
        return response

    } catch (error) {
        //We will remove the local file saved temporarily as upload operation got failed 
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}