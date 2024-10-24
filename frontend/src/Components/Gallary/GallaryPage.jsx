import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Authentication/AuthProvider";

const GallaryPage = () => {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      fetch(`http://localhost:3500/trip-details/search?userId=${user._id}`)
        .then(res => res.json())
        .then(data => setTrips(data))
        .catch(error => {
          console.log('Error fetching trips data', error);
        });
    }
  }, [user]);

  console.log(trips);

  return (
    <div className="max-w-5xl font-poppins mx-auto mt-6">
      <h2 className="text-gray-600">
        <span className="text-xl font-semibold">Explore the Moments:</span>
      </h2>
      <div className="mt-4">
        {trips.length > 0? (
          trips.map((trip) => (
            <div key={trip._id} className="my-4">
              <h3 className="text-lg font-semibold">{trip.destination}</h3>
              <p>{trip.description}</p>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {trip.gallery && trip.gallery.map((image, index) => (
                  <img key={index} src={image} alt={`Trip image ${index + 1}`} className="w-full h-auto rounded-md" />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No trips available to display</p>
        )}
      </div>
    </div>
  );
};

export default GallaryPage;
