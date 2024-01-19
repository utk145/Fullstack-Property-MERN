import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SwiperCore from "swiper"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";


const Home = () => {

  SwiperCore.use([Navigation]);

  // useEffect(() => {
  //   async function currUser() {
  //     const resp = await fetch("/api/v1/users/current-user")
  //     const data = await resp.json()
  //     console.log("cuureent user is ", data)
  //   }
  //   currUser()
  // }, [])
  // useEffect(() => {
  //   async function currUser() {
  //     const resp = await fetch("/api/v1/users/current-user", {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //     })
  //     const data = await resp.json()
  //     console.log("cuureent user is ", data)
  //   }
  //   currUser()
  // }, [])


  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  // Approach - 1 of fetching data one after another
  // useEffect(() => {
  //   async function fetchOfferListings() {
  //     try {
  //       const response = await fetch(`/api/v1/listings/get-listings?offer=true&limit=4`);
  //       const data = await response.json();
  //       if (!data.success) {
  //         return;
  //       }
  //       setOfferListings(data?.data);
  //       fetchRentListings();
  //     } catch (error) {
  //       console.error("Error is ", error.message);
  //     }
  //   };

  //   async function fetchRentListings() {
  //     try {
  //       const response = await fetch(`/api/v1/listings/get-listings?type=rent&limit=4`);
  //       const data = await response.json();
  //       if (!data.success) {
  //         return;
  //       }
  //       setRentListings(data?.data);
  //       fetchSellListings();
  //     } catch (error) {
  //       console.error("Error is ", error.message);
  //     }
  //   };
  //   async function fetchSellListings() {
  //     try {
  //       const response = await fetch(`/api/v1/listings/get-listings?type=sell&limit=4`);
  //       const data = await response.json();
  //       if (!data.success) {
  //         return;
  //       }
  //       setSaleListings(data?.data);
  //     } catch (error) {
  //       console.error("Error is ", error.message);
  //     }
  //   };

  //   fetchOfferListings();
  // }, [])



  // Approach 2 - This can potentially speed up the data fetching process since you're not waiting for one request to complete before starting the next one.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offerResponse, rentResponse, sellResponse] = await Promise.all([
          fetch(`/api/v1/listings/get-listings?offer=true&limit=5`),
          fetch(`/api/v1/listings/get-listings?type=rent&limit=5`),
          fetch(`/api/v1/listings/get-listings?type=sell&limit=5`),
        ]);

        const offerData = await offerResponse.json();
        const rentData = await rentResponse.json();
        const sellData = await sellResponse.json();

        if (offerData.success) {
          setOfferListings(offerData.data);
        }

        if (rentData.success) {
          setRentListings(rentData.data);
        }

        if (sellData.success) {
          setSaleListings(sellData.data);
        }
      } catch (error) {
        console.error("Error is ", error.message);
      }
    };

    fetchData();
  }, []);


  // console.log("offerListings", offerListings);
  // console.log("rentListings", rentListings);
  // console.log("saleListings", saleListings);



  return (
    <div>
      <div className="flex flex-col gap-6 py-20 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl text-slate-500 font-bold lg:text-6xl">Find your next <span className="text-slate-700">perfect</span><br /> home with ease</h1>
        <div className="text-gray-400 text-xs sm:text-sm">NewWorld Properties is the best place to find your next home faster, easier and affordable.<br /> With wide range of properties suiting your palette alongside 24x7 chat and call support</div>
        <Link to={"/search"} className="text-xs sm:text-sm text-purple-500 font-bold hover:underline ">Explore now..</Link>
      </div>

      <Swiper navigation>
        {offerListings && offerListings.length > 1 && offerListings.map((item, indx) => (
          <SwiperSlide key={indx+1}>
            <div className='h-[500px]' style={{ background: `url(${item.imageUrls[0]}) center no-repeat`, backgroundSize: "cover" }} key={indx + 1}>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-500'>Recent offers</h2>
              <Link className='text-sm text-sky-400 hover:underline hover:underline-offset-4' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-sky-400 hover:underline hover:underline-offset-4' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-sky-400 hover:underline hover:underline-offset-4' to={'/search?type=sell'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home