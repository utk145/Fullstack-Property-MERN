import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {

  const [formData, setFormData] = useState({})
  const [file, setFile] = useState(null)
  const [avatarProvided, setAvatarProvided] = useState(false)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate();

  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value
      }
    )
  };
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!file) {
      console.log("No file selected");
      return;
    }
    const formDataWithFile = new FormData();

    // Append form data to FormData
    for (const key in formData) {
      formDataWithFile.append(key, formData[key]);
    }

    // Append file to FormData
    formDataWithFile.append('avatar', file);
    const response = await fetch("/api/v1/users/register",
      {
        method: "POST",
        body: formDataWithFile
      }
    )
    const data = await response.json();
    console.log(data);
    if (data?.success === false) {
      setLoading(false);
      return;
    }
    setLoading(false); 
    setTimeout(() => {
      setFormData(null)
      nav('/login')
    }, 1000)
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input onChange={handleChange} type="text" className="border p-3 rounded-lg text-black " id='username' placeholder='Username' />
        <input onChange={handleChange} type="email" className="border p-3 rounded-lg text-black" id='email' placeholder='Email' />
        <input onChange={handleChange} type="password" className="border p-3 rounded-lg text-black" id='password' placeholder='Password' />
        {
          !avatarProvided ? <>
            <label className='text-yellow-500'>Upload an image for avatar</label>
            <input type="file" name="avatar" id="avatar" onChange={(e) => { setFile(e.target.files[0]); setAvatarProvided(!avatarProvided) }} />
          </> : <>
            <p className='text-yellow-500'>Avatar uploaded.. Reload the page to reupload</p>
          </>
        }

        <button disabled={loading} className='bg-[#FD356E] p-3 rounded-lg uppercase mt-6 hover:bg-pink-600 disabled:bg-[#FD356E]'>
          {loading ? "Loading.." : "Register"}
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