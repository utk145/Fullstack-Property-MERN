import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signOutUserSuccess } from '../redux/user/user.slice'

const PasswordChange = () => {
    const { currentUser } = useSelector(state => state.user)
    const [formData, setFormData] = useState({})
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData(
            {
                ...formData,
                [e.target.id]: e.target.value
            }
        )
    }
    // console.log(formData);
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/v1/users/update-password",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }
        )

        const data = await response.json();
        if (data?.success === false) {
            return;
        }

        // Password change was successful, initiate logout
        const logoutResponse = await fetch("/api/v1/users/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const logoutData = await logoutResponse.json();
        console.log("logout data after pass change: ", logoutData);
        dispatch(signOutUserSuccess(data))
        setFormData({})


    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7 '>Changing Password</h1>
            <form className='flex flex-col gap-4' onSubmit={handlePasswordChange}>
                <img src={currentUser?.data?.user?.avatar} alt="bgo" className='w-28 h-28 rounded-full object-cover cursor-pointer self-center mt-2' />
                <input onChange={handleChange} type="text" placeholder='old password' className='border p-3 text-black rounded-lg' id='oldPassword' />
                <input onChange={handleChange} type="text" placeholder='new password' className='border p-3 text-black rounded-lg' id='newPassword' />
                <button className='bg-[#FD356E] p-3 rounded-lg uppercase mt-6 hover:bg-pink-600'>Update password</button>
            </form>
        </div>
    )
}

export default PasswordChange