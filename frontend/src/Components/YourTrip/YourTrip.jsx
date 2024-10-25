import React, { useContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import MarkdownIt from "markdown-it";
import TripDetailsBox from "./TripDetailsBox";
import { AuthContext } from "../Authentication/AuthProvider";
import axios from "axios";
import { useLocation } from "react-router-dom";

// Initialize Google Generative AI API
const genAI = new GoogleGenerativeAI("AIzaSyA4yQdMZoyFNQT7QS5d0ERQNHBBEGBeVkg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const YourTrip = () => {
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  const location = useLocation();
  const requirementId = location.state;

  console.log("req", requirementId);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3500/trip-details/get`,
          {
            params: { userId },
          }
        );

        if (response.status === 200) {
          setTripDetails(response.data);
          console.log(tripDetails);
        } else {
          setError("Failed to fetch trip details.");
        }
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.data}`);
        } else if (error.request) {
          setError("No response received.");
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [userId]);

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

  function cleanHTML(htmlString) {
    // Replace block-level tags with line breaks
    const blockTags = /<\/(h1|h2|h3|h4|h5|h6|p|div|li|ul|ol)>/gi;
    htmlString = htmlString.replace(blockTags, "</$1>\n");

    // Create a temporary DOM element to hold the HTML
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlString;

    // Extract the text content from the temporary DOM element
    let cleanedText = tempElement.textContent || tempElement.innerText || "";

    // Optionally, remove any extra spaces or newlines
    cleanedText = cleanedText.replace(/\s+\n\s+/g, "\n").trim();

    return cleanedText;
  }

  // Function to generate itinerary using the AI model
  const generateItinerary = async () => {
    setLoading(true);

    // Create the prompt based on trip data
    const query = `
      "Generate a detailed trip itinerary for a group of ${
        tripData.company
      } from ${tripData.boardingPoint?.cityName} to ${
      tripData.destination?.cityName
    }.
      The trip starts on ${tripData.sinceWhen} and ends on ${
      tripData.tillWhen
    }. In this trip, ${tripData.ageConcern?.join(", ")} will also join.
      Please consider their comfort and mobility while planning.
      The trip should be planned with a ${
        tripData.budgetType
      } budget, and the preferred activities are ${tripData.preferredActivities?.join(
      ", "
    )}.
      Please provide an overview of the destination, a daily itinerary plan, including activities, places to visit, and suggestions for each day.
      End the trip with a summary of the final day. If any requirement does not match with the location, just ignore it."
      Generate a plan according to the given requirements.
    `;

    try {
      // Request itinerary generation from Google Generative AI using `generateContent`
      const result = await model.generateContent(query);
      const generatedText = result.response.text(); // Set the response text as the itinerary
      const md = new MarkdownIt();
      const renderedMarkdown = md.render(generatedText);
      setItinerary(cleanHTML(renderedMarkdown));
      // console.log(itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setItinerary("Failed to generate the itinerary. Please try again.");
    } finally {
      setLoading(false); // Stop the loading state
    }

    // try {
    //   // Define the API URL
    //   const apiUrl = `http://localhost:3500/requirements/get-requirements`;

    //   // Make the GET request, passing the userId as a query parameter
    //   const response = await axios.get(apiUrl, {
    //     params: {
    //       userId: user._id,
    //     },
    //   });

    //   // If the request is successful, log the data
    //   console.log("Fetched requirements:", response.data);
    // } catch (error) {
    //   // Handle any errors that occur during the request
    //   console.error("Error fetching requirements:", error);
    // }

    console.log("User ID:", user._id);
    console.log("Requirement ID:", requirementId);
    console.log("Details:", itinerary);

    try {
      const response = await axios.post(
        "http://localhost:3500/trip-details/details",
        {
          userId: user._id, // Send the userId and itinerary in the body
          requirementsId: requirementId,
          details: itinerary,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("Trip details successfully sent:", response.data);
      } else {
        console.error("Failed to send trip details:", response.statusText);
      }
    } catch (error) {
      console.error(
        "Error while sending trip details:",
        error.response || error
      );
    }
  };

  // try {
  //   const response = await axios.post("https://YOUR_GENERATIVE_AI_API_URL", {
  //     model: "gemini-1.5-flash",
  //     prompt: prompt,
  //     apiKey: apiKey, // You may need to pass this in headers or another way based on your API
  //   });

  //   const generatedText = response.data.text;
  //   const md = new MarkdownIt();
  //   const renderedMarkdown = md.render(generatedText);
  //   setItinerary(renderedMarkdown);
  // } catch (err) {
  //   setError("Error generating content: " + err.message);
  // } finally {
  //   setLoading(false);
  // }

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
      {loading && (
        <p className="mt-4 text-lg">
          Please wait while we generate your trip itinerary...
        </p>
      )}

      {/* Display the itinerary when ready */}
      {itinerary && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Your Trip Plan:</h2>
          <TripDetailsBox details={itinerary} />
        </div>
      )}
    </div>
  );
};

export default YourTrip;
