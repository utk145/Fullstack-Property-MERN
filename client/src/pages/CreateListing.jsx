import React, { useState } from 'react'
import { app } from '../configuration/firebase.config.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"

const CreateListing = () => {

    const [files, setFiles] = useState([])
    console.log(files);

    const [formData, setFormData] = useState(
        {
            imageUrls: [],
        }
    );
    console.log("listing page form data: ", formData);

    const [imageUploadError, setImageUploadError] = useState(false)

    const handleImageUpload = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setImageUploadError(false)
                }).catch((error) => setImageUploadError("Image upload failed.. (2MB max per image)"))
        } else if (files.length === 0) {
            setImageUploadError("Atleast one image is required")
        } else {
            setImageUploadError("You can only upload six images per listing")
        }
    };


    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on("state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done `);
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl)
                    })
                }
            )
        })
    }

    return (
        <div className='p-3 max-w-4xl mx-auto '>
            <h1 className='text-4xl text-center my-5 font-semibold'>Create a Listing</h1>
            <form className='flex flex-col sm:flex-row text-black gap-4 ' >
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' id="name" className='border p-3 rounded-lg' maxLength="62" minLength="10" required={true} />
                    <textarea type="text" placeholder='Description' id="description" className='border p-3 rounded-lg' required={true} />
                    <input type="text" placeholder='Address' id="address" className='border p-3 rounded-lg' required={true} />
                    <div className='flex gap-6 flex-wrap'>
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className='w-5' />
                            <span className='text-white'>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className='w-5' />
                            <span className='text-white'>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className='w-5' />
                            <span className='text-white'>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className='w-5' />
                            <span className='text-white'>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className='w-5' />
                            <span className='text-white'>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <div className='flex items-center gap-2 text-black'>
                            <input type="number" id='bedrooms' min={'1'} max={"10"} required={true} className='px-2 py-1 border border-gray-300 rounded-lg' />
                            <span className='text-white'>Bedrooms</span>
                        </div>
                        <div className='flex items-center gap-2 text-black'>
                            <input type="number" id='bathrooms' min={'1'} max={"10"} required={true} className='px-2 py-1 border border-gray-300 rounded-lg' />
                            <span className='text-white'>Bathrooms</span>
                        </div>
                        <div className='flex items-center gap-2 text-black'>
                            <input type="number" id='regularPrice' min={'1'} max={"10"} required={true} className='px-2 py-1 border border-gray-300 rounded-lg' />
                            <div className='text-white flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>( $/month )</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 text-black'>
                            <input type="number" id='discountPrice' min={'1'} max={"10"} required={true} className='px-2 py-1 border border-gray-300 rounded-lg' />
                            <div className='text-white flex flex-col items-center'>
                                <p>Discount Price</p>
                                <span className='text-xs'>( $/month )</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col flex-1 text-white gap-4'>
                    <p className='font-semibold'>Images: <span className='font-normal text-gray-400 ml-2'>The first image will be the cover (max 6) </span></p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files)} type="file" id='images' accept='image/*' multiple className='p-3 border border-gray-700 rounded-lg w-full' />
                        <button type='button' className='p-3 border border-fuchsia-600 text-fuchsia-600 rounded-lg uppercase hover:shadow-2xl disabled:opacity-80' onClick={handleImageUpload}>Upload</button>
                    </div>
                    <p className='text-red-700 font-semibold text-sm'>{imageUploadError && imageUploadError}</p>
                    <button className='bg-fuchsia-900 p-3 rounded-lg uppercase font-semibold text-center hover:opacity-95'>Create Listing</button>
                </div>
            </form>
        </div>
    )
}

export default CreateListing