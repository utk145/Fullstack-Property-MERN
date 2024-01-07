import React from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" className="border p-3 rounded-lg text-black " id='username' placeholder='Username' />
        <input type="email" className="border p-3 rounded-lg text-black" id='email' placeholder='Email' />
        <input type="password" className="border p-3 rounded-lg text-black" id='password' placeholder='Password' />
        <button className='bg-[#FD356E] p-3 rounded-lg uppercase mt-6 hover:bg-pink-600 disabled:bg-[#FD356E]'>
          Register
        </button>
      </form>
      <div>
        <p className='flex gap-2 m-2'>Already have an account?
          <Link to={"/login"}>
            <span className='text-pink-500 font-semibold hover:underline'>Sign In</span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register