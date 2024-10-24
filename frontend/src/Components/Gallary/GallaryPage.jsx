import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Authentication/AuthProvider";

const GallaryPage = () => {
    const { user } = useContext(AuthContext);
    const [trips, setTrips] = useState([]);
    const { _id } = user;

    useEffect(() => {
        fetch(`http://localhost:3500/trip-details/search?userId=${_id}`)
        .then(res => res.json())
        .then(data => setTrips(data))
        .catch(error => {
            console.log('Error fetching trips data', error);
        })
    },[])
    return (
        <div className="max-w-5xl font-poppins mx-auto mt-6">
            <h2 className="text-gray-600">
                <span className="text-xl font-semibold">Explore the Moments:</span>
            </h2>
        </div>
    );
};

export default GallaryPage;