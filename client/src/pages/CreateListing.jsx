import React from 'react'

const CreateListing = () => {
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
                        <input type="file" id='images' accept='image/*' multiple className='p-3 border border-gray-700 rounded-lg w-full' />
                        <button className='p-3 border border-fuchsia-600 text-fuchsia-600 rounded-lg uppercase hover:shadow-2xl disabled:opacity-80'>Upload</button>
                    </div>
                    <button className='bg-fuchsia-900 p-3 rounded-lg uppercase font-semibold text-center hover:opacity-95'>Create Listing</button>
                </div>
            </form>
        </div>
    )
}

export default CreateListing