import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInSuccess } from '../redux/user/user.slice.js'

const Login = () => {

  const [formData, setFormData] = useState({})
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    )
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/v1/users/login",
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    )
    const data = await response.json();
    console.log(data);
    if (data?.success === false) {
      return;
    }
    dispatch(signInSuccess(data))
    setTimeout(() => {
      setFormData(null)
      nav('/')
    }, 1000)
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
        <input onChange={handleChange} type="email" className="border p-3 rounded-lg text-black" id='email' placeholder='Email' />
        <input onChange={handleChange} type="password" className="border p-3 rounded-lg text-black" id='password' placeholder='Password' />

        <button className='bg-[#FD356E] p-3 rounded-lg uppercase mt-6 hover:bg-pink-600 disabled:bg-[#FD356E]'>
          Login
        </button>
      </form>
      <div>
        <p className='flex gap-2 m-2'>New here?
          <Link to={"/register"}>
            <span className='text-pink-500 font-semibold hover:underline'>Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login