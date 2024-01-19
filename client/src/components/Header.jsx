import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"

const Header = () => {

    const { currentUser } = useSelector(state => state.user)
    // console.log("From header", currentUser);
    const [searchTerm, setSearchTerm] = React.useState('');
    const nav = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQueries = urlParams.toString();
        nav(`/search?${searchQueries}`)
    }

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if (searchTermFromUrl)
            setSearchTerm(searchTermFromUrl)

    }, [window.location.search])


    return (
        <header className='bg-slate-900 shadow-md shadow-slate-600'>
            <div className='flex items-center justify-between max-w-6xl mx-auto p-3 '>
                <Link to={"/"}>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>NewWorld</span>
                        <span className='text-slate-700'>Properties</span>
                    </h1>
                </Link>
                <form className='bg-slate-800 p-3 rounded-lg flex items-center' onSubmit={handleSubmit}>
                    <input type="text" placeholder='Search' className='bg-transparent focus:outline-none w-24 sm:w-64 '
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-slate-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg></button>
                </form>
                <ul className='flex gap-4'>
                    <Link to={"/"}>
                        <li className='hidden sm:inline text-slate-400 cursor-pointer hover:underline'>Home</li>
                    </Link>
                    <Link to={"/about"}>
                        <li className='hidden sm:inline text-slate-400 cursor-pointer hover:underline'>About</li>
                    </Link>
                    <Link to={"/profile"}>
                        {currentUser ? (
                            <img src={currentUser?.data?.user?.avatar} alt="bgo" className='w-7 h-7 rounded-full object-cover' />
                        ) : (
                            <li className='text-slate-400 cursor-pointer hover:underline'>Login</li>
                        )}
                    </Link>

                </ul>
            </div>
        </header>
    )
}

export default Header