import React from 'react'

const About = () => {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto  text-justify text-gray-500'>
      <h1 className='text-3xl font-bold mb-4 text-slate-300'>About NewWorld Properties</h1>
      <p className='mb-4'>NewWorld Properties is a dummy leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.</p>
      <p className='mb-4 '>
        Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
      </p>      
      <p className='mb-4 '>Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.</p>
      <p className='mb-4 italic text-amber-700 font-semibold'>
        Please note that NewWorld Properties is a dummy app created for demonstration purposes. The property listings and information presented here are fictional and do not represent real properties or transactions.
      </p>
      <div className='flex items-center justify-center gap-6 max-w-lg mx-auto mt-20'>
        <img src="https://avatars.githubusercontent.com/u/122993091?v=4" alt="my-img" className='rounded-full w-1/2' />
        <p className='text-yellow-300'>If you want to check out my other projects, head over to my GitHub page at <a href="https://github.com/utk145"  target='_blank' className='text-red-500'>github.com/utk145</a>. <br />Thanks for viewing this app!</p>
      </div>
    </div>
  )
}

export default About