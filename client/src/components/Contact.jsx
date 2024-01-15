// import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom';

// const Contact = ({ userRef, listingName }) => {

//   const [landlord, setlandlord] = React.useState({});
//   const [message, setMessage] = React.useState("")

//   useEffect(() => {
//     async function UserInfo() {
//       try {
//         const resp = await fetch(`/api/v1/users/getUserInfo/${userRef}`);
//         const data = await resp.json();
//         console.log(data);
//         setlandlord(data.data)
//       } catch (error) {
//         console.log("Error is", error);
//         return;
//       }
//     }
//     UserInfo();
//   }, [userRef]);

//   console.log("landlord", landlord);

//   const onChange = (e) => {
//     setMessage(e.target.value);
//   };



//   return (
//     <>
//       {landlord && (
//         <div className='flex flex-col gap-2 mt-7'>
//           <p>
//             Contact <span className=' text-yellow-300'>{landlord.username ? landlord.username.toUpperCase() : ''}</span>{' '}
//             for{' '}
//             <span className='font-semibold italic text-cyan-500'>{listingName}</span>
//           </p>
//           <textarea
//             name='message'
//             id='message'
//             rows='2'
//             value={message}
//             onChange={onChange}
//             placeholder='Enter your message here...'
//             className='w-full border p-3 rounded-lg text-black'
//           ></textarea>

//           <Link
//             to={`mailto:${landlord.email}?subject=Query regarding - ${listingName}&body=${message}`}
//             className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
//           >
//             Send Message
//           </Link>
//         </div>
//       )}
//     </>
//   )
// }

// export default Contact
// Not the above code because whenver i write anything in the textarea the whole page is rerendering, it is leading to soo many api calls and i dont want that everytime:


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Create a separate function to fetch user information
const fetchUserInfo = async (userRef, setLandlord) => {
  try {
    const resp = await fetch(`/api/v1/users/getUserInfo/${userRef}`);
    const data = await resp.json();
    console.log(data);
    setLandlord(data.data);
  } catch (error) {
    console.log('Error is', error);
    return;
  }
};

const Contact = ({ landlord, listingName }) => {
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2 mt-7">
          <p>
            Contact{' '}
            <span className="text-yellow-300">
              {landlord.username ? landlord.username.toUpperCase() : ''}
            </span>{' '}
            for{' '}
            <span className="font-semibold italic text-cyan-500">{listingName}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg text-black"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Query regarding - ${listingName}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

const ContactContainer = ({ userRef, listingName }) => {
  const [landlord, setLandlord] = useState({});

  useEffect(() => {
    fetchUserInfo(userRef, setLandlord);
  }, [userRef]);

  return <Contact landlord={landlord} listingName={listingName} />;
};

export default ContactContainer;
