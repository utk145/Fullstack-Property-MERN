import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signOutUserSuccess, updateUserSuccess } from '../redux/user/user.slice'
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
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer font-medium'>Delete account</span>
        <span className='text-red-700 cursor-pointer font-medium' onClick={handleLogout}>Signout</span>
      </div>
    </div>
  )
}

export default Profile