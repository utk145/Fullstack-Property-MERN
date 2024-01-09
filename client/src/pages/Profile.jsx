import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signOutUserSuccess } from '../redux/user/user.slice'

const Profile = () => {

  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 '>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser?.data?.user?.avatar} alt="bgo" className='w-28 h-28 rounded-full object-cover cursor-pointer self-center mt-2' />
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' />
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' />
        <input type="text" placeholder='password' className='border p-3 rounded-lg' id='password' />
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