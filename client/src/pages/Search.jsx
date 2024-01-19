import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Search = () => {
    const nav = useNavigate();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: "createdAt",
        order: 'desc',
    });

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(true);

    useEffect(() => {
        const urlInfo = new URLSearchParams(window.location.search)
        const searchTermFromUrl = urlInfo.get("searchTerm")
        const typeFromUrl = urlInfo.get("type")
        const parkingFromUrl = urlInfo.get("parking")
        const furnishedFromUrl = urlInfo.get("furnished")
        const sortFromUrl = urlInfo.get("sort")
        const offerFromUrl = urlInfo.get("offer")
        const orderFromUrl = urlInfo.get('order');


        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || sortFromUrl || offerFromUrl || orderFromUrl) {
            setSidebarData({
                searchTerm: searchTermFromUrl || "",
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === "true" ? true : false,
                furnished: furnishedFromUrl === "true" ? true : false,
                offer: offerFromUrl === "true" ? true : false,
                sort: sortFromUrl || "createdAt",
                order: orderFromUrl || "desc",
            })
        };


        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlInfo.toString();
            const response = await fetch(`/api/v1/listings/get-listings?${searchQuery}`);
            const data = await response.json();
            setListings(data?.data);
            setLoading(false);

            if (data.length < 9) {
                setShowMore(false);
            }

        }

        fetchListings();


    }, [window.location.search])

    console.log(listings);
    console.log(showMore);

    const handleSidebarDataChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === "sell") {
            setSidebarData({ ...sidebarData, type: e.target.id })
        };

        if (e.target.id === "searchTerm") {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value })
        };

        if (e.target.id === "parking" || e.target.id === "offer" || e.target.id === "furnished") {
            // setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked })
            setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked === true || e.target.checked === "true" ? true : false })
        };

        if (e.target.id === "sort_order") {
            const sort = e.target.value.split("_")[0] || "createdAt";
            const order = e.target.value.split("_")[1] || "desc";
            setSidebarData({ ...sidebarData, order: order, sort: sort })
        };

    };

    // console.log(sidebarData);

    const handleSearchSubmit = (e) => {
        // when the button is clicked, i want the form to submit and upload data and change url
        e.preventDefault();
        //first get information of the url
        const urlParams = new URLSearchParams()
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("type", sidebarData.type);
        urlParams.set("parking", sidebarData.parking);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("order", sidebarData.order);
        urlParams.set("furnished", sidebarData.furnished);
        urlParams.set("offer", sidebarData.offer);
        const searchQuery = urlParams.toString();
        nav(`/search?${searchQuery}`)
    };

    const onClickShowMore = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/v1/listings/get-listings?${searchQuery}`)
        const data = await response.json();
        if (data?.data.length > 0) {
            setShowMore(false)
        }
        setListings(prevListings => [...prevListings, ...data?.data]);
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form className='flex flex-col gap-8'
                    onSubmit={handleSearchSubmit}
                >
                    <div className="flex gap-3 items-center">
                        <label className='whitespace-nowrap font-semibold'>Search Term</label>
                        <input type="text" id='searchTerm'
                            placeholder='Search..'
                            className='border rounded-md outline-none px-2 py-1 text-black w-full bg-gray-300 placeholder:text-gray-800'
                            value={sidebarData.searchTerm}
                            onChange={handleSidebarDataChange}
                        />
                    </div>
                    <div className="flex gap-3 flex-wrap items-center">
                        <label className='font-semibold'>Type:</label>
                        <div className="flex gap-2">
                            <input type="checkbox" id="all" className='w-5'
                                checked={sidebarData.type === 'all'}
                                onChange={handleSidebarDataChange} />
                            <span>Rent & Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className='w-5'
                                onChange={handleSidebarDataChange}
                                checked={sidebarData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="sell" className='w-5'
                                onChange={handleSidebarDataChange}
                                checked={sidebarData.type === 'sell'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className='w-5'
                                onChange={handleSidebarDataChange}
                                checked={sidebarData.offer === true} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap items-center">
                        <label className='font-semibold'>Amenities:</label>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className='w-5'
                                onChange={handleSidebarDataChange}
                                checked={sidebarData.parking === true}
                            />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className='w-5'
                                onChange={handleSidebarDataChange}
                                checked={sidebarData.furnished === true}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className='font-semibold'>Sort</label>
                        <select id="sort_order" className='text-black border rounded-lg px-2 py-1 outline-none'
                            onChange={handleSidebarDataChange}
                            defaultValue={"createdAt_desc"}
                        >
                            <option value={"regularPrice_desc"}>Price high to low</option>
                            <option value={"regularPrice_asc"} >Price low to high</option>
                            <option value={"createdAt_desc"} >Latest</option>
                            <option value={"createdAt_asc"} >Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-800 p-3 rounded-md font-semibold hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className='text-2xl font-semibold border-b p-3 text-slate-500 mt-4 uppercase'>Results</h1>
                <div className="p-3 flex flex-wrap gap-5">
                    {!loading && listings.length === 0 && (
                        <p className='text-3xl text-purple-600 text-center font-bold'>No listing found!!</p>
                    )}
                    {loading && (
                        <div role="status" className='my-7 flex w-full justify-center'>
                            <svg aria-hidden="true" className="w-[50px] h-[50px] text-gray-200 animate-spin dark:text-gray-600 fill-orange-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                    {!loading && listings.length > 0 && listings.map((item) => (
                        <ListingItem listing={item} key={item._id} />
                    ))}
                </div>
                {showMore && (
                    <button onClick={onClickShowMore} className='px-2 py-1 bg-yellow-800 text-white ml-4 mb-5 hover:opacity-90 hover:underline'>Show More</button>
                )}
            </div>
        </div>
    )
}

export default Search