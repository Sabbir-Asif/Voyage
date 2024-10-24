import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI API
const genAI = new GoogleGenerativeAI("AIzaSyA4yQdMZoyFNQT7QS5d0ERQNHBBEGBeVkg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const YourTrip = () => {
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);

  // Example trip data (you can replace this with dynamic data from your application)
  const tripData = {
    ageConcern: ["Baby", "Old"],
    boardingPoint: {
      cityName: "DHA",
      latitude: 32.5077,
      longitude: 74.5249,
    },
    budgetType: "Luxury",
    company: "friends",
    destination: {
      cityName: "Rajshahi",
      latitude: 24.3667,
      longitude: 88.6,
    },
    preferredActivities: ["Beach", "Museum"],
    sinceWhen: "2024-10-17",
    tillWhen: "2024-10-11",
  };

  // Function to generate itinerary using the AI model
  const generateItinerary = async () => {
    setLoading(true);

    // Create the prompt based on trip data
    const query = `
      Generate a detailed trip itinerary for a group of ${tripData.company} from ${tripData.boardingPoint.cityName} to ${tripData.destination.cityName}.
      The trip starts on ${tripData.sinceWhen} and ends on ${tripData.tillWhen}.
      This trip is for people with the following age concerns: ${tripData.ageConcern.join(", ")}.
      The trip should be planned with a ${tripData.budgetType} budget, and the preferred activities are ${tripData.preferredActivities.join(", ")}.
      Please provide an overview of the destination, a daily itinerary plan, including activities, places to visit, and suggestions for each day. End the trip with a summary of the final day.
    `;

    try {
      // Request itinerary generation from Google Generative AI using `generateContent`
      const result = await model.generateContent(query);
      setItinerary(result.response.text());  // Set the response text as the itinerary
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setItinerary("Failed to generate the itinerary. Please try again.");
    } finally {
      setLoading(false);  // Stop the loading state
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 rounded-md shadow-lg bg-white">
      <h1 className="text-2xl font-semibold mb-4">Your Trip Itinerary</h1>

      {/* Generate itinerary button */}
      <button
        onClick={generateItinerary}
        className="btn bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Itinerary"}
      </button>

      {/* Show loading message */}
      {loading && <p className="mt-4 text-lg">Please wait while we generate your trip itinerary...</p>}

      {/* Display the itinerary when ready */}
      {itinerary && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Your Trip Plan:</h2>
          <p className="text-lg whitespace-pre-wrap">{itinerary}</p>
        </div>
      )}
    </div>
  );
};

export default YourTrip;
