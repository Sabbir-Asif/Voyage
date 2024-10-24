import React from "react";

const TripDetailsBox = ({ details }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg border border-gray-300 p-4 text-justify">
        {details}
      </div>
    </div>
  );
};

export default TripDetailsBox;
