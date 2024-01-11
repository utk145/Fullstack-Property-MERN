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

    const handleDelImage = (index) => {
        setFormData(
            {
                ...formData,
                imageUrls: formData.imageUrls.filter((url, i) => i !== index)
            }
        )
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
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url, indx) => (
                        // <img src={url} alt="image-urls" className='w-40 h-40 object-cover rounded-lg' key={indx + 1} />
                        <div className="flex items-center justify-between p-3">
                            <img src={url} alt="listing-image" className='w-20 h-20 object-contain rounded-lg' key={indx + 1} />
                            <button type='button' onClick={() => handleDelImage(indx)} className='text-red-500 font-bold flex items-center justify-center gap-2 hover:opacity-60'> <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z"></path></svg></button>
                        </div>
                    ))}
                    <button className='bg-fuchsia-900 p-3 rounded-lg uppercase font-semibold text-center hover:opacity-95'>Create Listing</button>
                </div>
            </form>
        </div>
    )
}

export default CreateListing