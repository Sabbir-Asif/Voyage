import { nav } from "framer-motion/client";
import { useState } from "react";
import { BiCurrentLocation, BiSearch } from "react-icons/bi"

const Inputs = ({setQuery, setUnits}) => {
    const [city, setCity] = useState('');

    const handleSearchClick = () => {
        if(city !== "") setQuery({q: city})
    }

    const handleLocationClick = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const {latitude, longitude} = position.coords;
                setQuery({lat: latitude, lon: longitude})
            })
        }
    }
  return (
    <div className=" font-manrope flex flex-row justify-center my-6">
        <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
            <input 
            type="text"
            value={city}
            onChange={e => setCity(e.currentTarget.value)}
            placeholder="search by city"
            className="input input-info text-gray-500 border-blue-secondary focus:border-blue-secondary focus:outline-blue-secondary text-xl font-light p-2 w-full capitalize focus:outline placeholder:lowercase max-w-md" />
            <BiSearch size={25}
            className="cursor-pointer text-blue-primary transition ease-out hover:scale-125"
            onClick={handleSearchClick} />
            <BiCurrentLocation size={25}
            className="cursor-pointer transition ease-out hover:scale-125 text-blue-primary"
            onClick={handleLocationClick} />
        </div>
        
    </div>
  )
}

export default Inputs