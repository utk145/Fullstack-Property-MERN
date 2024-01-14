import React from 'react'
import { useParams } from 'react-router-dom'
import SwiperCore from "swiper"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import "swiper/css/bundle";
import { useSelector } from "react-redux"
import { FaBath, FaBed, FaChair,  FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import Contact from '../components/Contact';


const Listing = () => {

    SwiperCore.use([Navigation]);

    const params = useParams();
    const [listingInformation, setListingInformation] = React.useState({})

    const [loading, setLoading] = React.useState(true)

    const [copied, setCopied] = React.useState(false);
    const [contact, setContact] = React.useState(false);

    const { currentUser } = useSelector((state) => state.user);


    React.useEffect(() => {
        async function fetchListingInfo() {
            setLoading(true);
            try {
                const response = await fetch(`/api/v1/listings/get-listing-info/${params.id}`)
                const data = await response.json();
                console.log("Listing info is", data);
                if (data.success === false) {
                    setLoading(false);
                    return;
                }
                setListingInformation(data.data);
                setLoading(false)
            } catch (error) {
                console.error("Error :", error.message);
            }
        }
        fetchListingInfo();
    }, [])

    const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, parking, type, offer, furnished, userRef, imageUrls } = listingInformation;

    return (
        <div className='text-white'>
            {
                loading ? (
                    // https://flowbite.com/docs/components/spinner/
                    <div role="status" className='flex w-full justify-center my-7'>
                        <svg aria-hidden="true" className="w-[100px] h-[100px] text-gray-200 animate-spin dark:text-gray-600 fill-orange-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                )
                    :
                    <>
                        <Swiper navigation>
                            {imageUrls?.map((item, indx) =>
                                <SwiperSlide key={indx + 1}>
                                    <div className='h-[500px]' style={{ background: `url(${item}) center no-repeat`, backgroundSize: "auto" }}>

                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>
                        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-800 cursor-pointer'>
                            <FaShare
                                className='text-slate-500'
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setCopied(true);
                                    setTimeout(() => {
                                        setCopied(false);
                                    }, 2000);
                                }}
                            />
                        </div>
                        {copied && (
                            <p className='fixed top-[23%] right-[5%] z-10 rounded-lg bg-slate-600 p-2'>
                                Link copied!
                            </p>
                        )}
                        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                            <p className='text-2xl font-semibold'>
                                {name} - ${' '}
                                {offer
                                    ? discountPrice.toLocaleString('en-US')
                                    : regularPrice.toLocaleString('en-US')}
                                {type === 'rent' && ' / month'}
                            </p>
                            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                                <FaMapMarkerAlt className='text-green-700' />
                                {address}
                            </p>
                            <div className='flex gap-4'>
                                <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    {type === 'rent' ? 'For Rent' : 'For Sale'}
                                </p>
                                {offer && (
                                    <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                        ${+regularPrice - +discountPrice} OFF
                                    </p>
                                )}
                            </div>
                            <p className='text-slate-300'>
                                <span className='font-semibold text-white'>Description - </span>
                                {description}
                            </p>
                            <ul className='text-green-500 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaBed className='text-lg' />
                                    {bedrooms > 1
                                        ? `${bedrooms} beds `
                                        : `${bedrooms} bed `}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaBath className='text-lg' />
                                    {bathrooms > 1
                                        ? `${bathrooms} baths `
                                        : `${bathrooms} bath `}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaParking className='text-lg' />
                                    {parking ? 'Parking spot' : 'No Parking'}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaChair className='text-lg' />
                                    {furnished ? 'Furnished' : 'Unfurnished'}
                                </li>
                            </ul>
                            {currentUser && userRef !== currentUser._id && !contact && (
                                <button
                                    onClick={() => setContact(true)}
                                    className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                                >
                                    Contact landlord
                                </button>
                            )}
                            {contact && <Contact listingInformation={listingInformation} />}
                        </div>
                    </>
            }

        </div>
    )
}

export default Listing