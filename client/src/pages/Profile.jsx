import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserSuccess, signOutUserSuccess, updateUserSuccess } from '../redux/user/user.slice'
import { Link, useNavigate } from 'react-router-dom'

const Profile = () => {

  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({})
  const nav = useNavigate();

  const handleLogout = async () => {
    const response = await fetch("/api/v1/users/logout",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )
    const data = await response.json();
    // console.log(data);
    dispatch(signOutUserSuccess(data))
  }

  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    )
  }
  // console.log(formData);
  const handleUpdateDetailsSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/v1/users/update-details", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = await response.json();
    // console.log(data);
    dispatch(updateUserSuccess(data))


    setTimeout(() => {
      setFormData({})
      nav('/')
    }, 1000)

  }

  const handleDeleteUser = async () => {
    const response = await fetch("/api/v1/users/delete-user",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )
    const data = await response.json();
    // console.log(data);
    dispatch(deleteUserSuccess(data))
  }

  const [showListingError, setShowListingError] = useState();
  const [userListings, setUserListings] = useState([]);
  const showListings = async () => {
    try {
      const response = await fetch(`/api/v1/listings/user-listings/${currentUser.data.user._id}`);
      const data = await response.json();
      if (data.success === false) {
        setShowListingError(data.message);
        return;
      }
      // console.log("listings are ", data.data);
      setUserListings(data.data)
    } catch (error) {
      showListingError(error.message)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const response = await fetch(`/api/v1/listings/delete-listing/${listingId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await response.json();
      setUserListings(prevListings => prevListings.filter(item => item._id !== listingId))
      // console.log(data);
    } catch (error) {
      console.error("Error deleting listing:", error.message)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 '>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleUpdateDetailsSubmit}>
        <img src={currentUser?.data?.user?.avatar} alt="bgo" className='w-28 h-28 rounded-full object-cover cursor-pointer self-center mt-2' />
        <p className='text-center'> <span>@</span><span className='italic'> {currentUser?.data?.user?.username}</span></p>
        <input onChange={handleChange} type="text" placeholder='username' className='border p-3 text-black rounded-lg' id='username' />
        <input onChange={handleChange} type="email" placeholder='email' className='border p-3 text-black rounded-lg' id='email' />
        {/* <input type="text" placeholder='password' className='border p-3 text-black rounded-lg' id='password' /> */}
        <Link to="/profile/change-password" className="text-blue-500 cursor-pointer font-medium">
          Change Password
        </Link>

        <button className='bg-[#FD356E] p-3 rounded-lg uppercase mt-6 hover:bg-pink-600 disabled:bg-[#FD356E]'>Update</button>
        <Link to={"/create-listing"} className='bg-fuchsia-900 p-3 rounded-lg uppercase text-center hover:opacity-95'>Create a Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer font-medium' onClick={handleDeleteUser}>Delete account</span>
        <span className='text-red-700 cursor-pointer font-medium' onClick={handleLogout}>Signout</span>
      </div>
      <button className='bg-amber-500 px-2 py-1  w-full mt-4 self-center rounded-md' onClick={showListings}>Show listings</button>
      <p className='text-red-400 text-center mt-6'>{showListingError ? showListingError : ""}</p>
      {userListings && userListings.length > 0 &&
        <div className='flex flex-col gap-2 '>
          <h1 className='text-2xl text-center my-3 font-bold'>Your Listings</h1>
          {userListings.map((item, indx) => (
            <div key={indx + 1} className='border border-gray-800 rounded-md p-3 flex justify-between items-center gap-3'>
              <Link to={`/listings/${item._id}`}>
                <img src={item.imageUrls[0]} alt="listing-cover-image-alt" className='h-20 w-20 object-cover rounded-lg' />
              </Link>
              <Link to={`/listings/${item._id}`} className='flex-1'>
                <p className='font-semibold text-gray-400  hover:underline truncate'>{item.name}</p>
                <p className='font-thin text-gray-400  hover:underline truncate'>{item.address}</p>
                <p className='font-thin text-gray-400  truncate'>Pics: {item.imageUrls.length}</p>
              </Link>
              <div className='flex flex-col gap-2 items-center'>
                <button className='text-red-600' onClick={() => handleListingDelete(item._id)}> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z"></path></svg></button>
                <Link to={`/update-listing/${item._id}`}>
                  <button className='text-green-300' ><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path></svg></button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}

export default Profile