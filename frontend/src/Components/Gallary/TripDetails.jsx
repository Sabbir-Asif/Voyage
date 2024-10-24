import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Authentication/AuthProvider";
import axios from "axios";

const TripDetails = () => {
    const { tripId } = useParams();
    const { user } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image to upload.");
            return;
        }

        setLoading(true);

        const uploadImage = new FormData();
        uploadImage.append("image", image);
        uploadImage.append("userId", user._id);
        uploadImage.append("tripId", tripId);
        uploadImage.append("description", `User ${user._id} uploaded image to trip ${tripId}`);
        uploadImage.append("album", tripId);

        try {
            const response = await axios.post("http://localhost:3030/upload", uploadImage, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadMessage("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploadMessage("Error uploading image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-6 p-4 border border-gray-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload Images to Your Trip Gallery</h2>

            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Select an image to upload:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
            </div>

            <button
                onClick={handleUpload}
                className="btn bg-blue-600 text-white px-4 py-2 rounded-lg"
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload Image"}
            </button>
            {loading && (
                <div className="flex justify-center mt-4">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {uploadMessage && <p className="mt-4 text-lg text-green-600">{uploadMessage}</p>}
        </div>
    );
};

export default TripDetails;
