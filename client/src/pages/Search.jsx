import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

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


    useEffect(() => {
        const urlInfo = new URLSearchParams(window.location.search)
        const searchTermFromUrl = urlInfo.get("searchTerm")
        const typeFromUrl = urlInfo.get("type")
        const parkingFromUrl = urlInfo.get("parking")
        const furnishedFromUrl = urlInfo.get("furnished")
        const sortFromUrl = urlInfo.get("sort")
        const offerFromUrl = urlInfo.get("offer")
        const orderFromUrl = urlInfo.get('order');
        

        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || sortFromUrl || offerFromUrl) {
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
            setListings(data?.data)
            setLoading(false)
        }

        fetchListings();


    }, [window.location.search])

    console.log(listings);


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
            <div className="">
                <h1 className='text-2xl font-semibold border-b p-3 text-slate-500 mt-4 uppercase'>Results</h1>
            </div>
        </div>
    )
}

export default Search