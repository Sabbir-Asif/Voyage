import React, { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const PlanATrip = () => {
  const [step, setStep] = useState(0);
  const [boardingPoint, setBoardingPoint] = useState(null);
  const [destination, setDestination] = useState(null);
  const [company, setCompany] = useState('');
  const [ageConcern, setAgeConcern] = useState([]);
  const [sinceWhen, setSinceWhen] = useState('');
  const [tillWhen, setTillWhen] = useState('');
  const [budgetType, setBudgetType] = useState('');
  const [preferredActivities, setPreferredActivities] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);

  const motivationalMessages = [
    "Let's start your journey by setting your boarding location!",
    "Where are you planning to go?",
    "Are you going solo or with company?",
    "Any special age group concerns? Select all that apply.",
    "When are you planning to start your trip?",
    "When will your trip end?",
    "Choose your budget range to help us plan better!",
    "What kind of activities do you enjoy on weekends? Select multiple if you like!",
  ];

  const options = [
    { label: 'Solo', value: 'solo' },
    { label: 'Couple', value: 'couple' },
    { label: 'Friends', value: 'friends' },
    { label: 'Family', value: 'family' },
  ];

  const ageConcernsOptions = ['Baby', 'Child', 'Old', 'Pets'];
  const budgetOptions = ['Budget', 'Mid-range', 'Luxury'];
  const activityOptions = ['Hiking', 'Beach', 'Museum', 'Shopping', 'Dining'];

  const fetchCityData = async (query) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=6a4330ecce54d6aa71d8aad4bd4ddca6`);
      const cityData = {
        cityName: response.data.name,
        latitude: response.data.coord.lat,
        longitude: response.data.coord.lon,
      };
      setCitySuggestions([cityData]);
    } catch (error) {
      console.error('Error fetching city data:', error);
      setCitySuggestions([]);
    }
  };

  const handleCitySelect = (cityData, setter) => {
    setter(cityData);
    setCitySuggestions([]);
  };

  const handleNext = () => {
    if (step < motivationalMessages.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAgeConcernChange = (value) => {
    setAgeConcern((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleActivityChange = (value) => {
    setPreferredActivities((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const submitForm = () => {
    const requirements = {
      boardingPoint,
      destination,
      company,
      ageConcern,
      sinceWhen,
      tillWhen,
      budgetType,
      preferredActivities,
    };

    console.log(requirements);
    alert('Requirements submitted successfully!');
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 font-poppins text-gray-600 space-y-4">
      <div className="p-8 rounded-lg space-y-4">
        <h2 className="text-3xl text-center font-semibold mb-4 max-w-xl">
          {motivationalMessages[step]}
        </h2>

        {step === 0 && (
          <div>
            <input
              type="text"
              placeholder="Enter Boarding Location"
              onChange={(e) => fetchCityData(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            {citySuggestions.length > 0 && (
              <ul className="list-none w-full bg-white border rounded-lg shadow-md p-2">
                {citySuggestions.map((city, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleCitySelect(city, setBoardingPoint)}
                  >
                    {city.cityName} (Lat: {city.latitude}, Lon: {city.longitude})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <input
              type="text"
              placeholder="Enter Destination"
              onChange={(e) => fetchCityData(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            {citySuggestions.length > 0 && (
              <ul className="list-none w-full bg-white border rounded-lg shadow-md p-2">
                {citySuggestions.map((city, index) => (
                  <li
                    key={index}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                    onClick={() => handleCitySelect(city, setDestination)}
                  >
                    {city.cityName} (Lat: {city.latitude}, Lon: {city.longitude})
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <select
              onChange={(e) => setCompany(e.target.value)}
              className="select select-bordered w-full mb-4"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div>
            {ageConcernsOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  onChange={() => handleAgeConcernChange(option)}
                  checked={ageConcern.includes(option)}
                  className="checkbox"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {step === 4 && (
          <div>
            <input
              type="date"
              onChange={(e) => setSinceWhen(format(new Date(e.target.value), 'yyyy-MM-dd'))}
              className="input input-bordered w-full mb-4"
            />
          </div>
        )}

        {step === 5 && (
          <div>
            <input
              type="date"
              onChange={(e) => setTillWhen(format(new Date(e.target.value), 'yyyy-MM-dd'))}
              className="input input-bordered w-full mb-4"
            />
          </div>
        )}

        {step === 6 && (
          <div>
            {budgetOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  name="budget"
                  value={option}
                  onChange={(e) => setBudgetType(e.target.value)}
                  className="radio"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {step === 7 && (
          <div>
            {activityOptions.map((option) => (
              <label key={option} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  onChange={() => handleActivityChange(option)}
                  checked={preferredActivities.includes(option)}
                  className="checkbox"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-4">
          {step > 0 && (
            <button className="underline" onClick={handleBack}>
              Back
            </button>
          )}
          {step < motivationalMessages.length - 1 ? (
            <button className="btn btn-primary bg-gray-700 rounded-full text-white hover:bg-gray-500 border-none" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="btn bg-gradient-to-r from-orange-primary to-orange-secondary text-white" onClick={submitForm}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanATrip;