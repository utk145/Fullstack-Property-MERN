import ImageKit from "imagekit";
import fs from "fs"

var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


const uploadOnImagekit = async (localFilePath) => {
    try {

        if (!localFilePath) return null;

        // upload file on imagekit
        // Resource: https://github.com/imagekit-developer/imagekit-nodejs#file-upload  , https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload
        const response = await imagekit.upload({ file: localFilePath, fileName: "tms", useUniqueFileName: true })
        console.log(response); // https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload#response-code-and-structure-json
        console.log("File has been uploaded succefully on imagekit");
        console.log("obtained url is: ", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove locally saved temporary file as upload operation failed
        return null;
    }
}



export { uploadOnImagekit }