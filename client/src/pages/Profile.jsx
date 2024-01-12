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
    console.log(data);
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
    console.log(data);
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
    console.log(data);
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
      console.log("listings are ", data.data);
      setUserListings(data.data)
    } catch (error) {
      showListingError(error.message)
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
        userListings.map((item, indx) => (
          <div key={indx + 1}>
            <Link to={`/listings/${item._id}`}>
              <img src={item.imageUrls[0]} alt="listing-cover-image-alt" />
            </Link>
          </div>
        ))
      }
    </div>
  )
}

export default Profile