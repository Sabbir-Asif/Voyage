import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Vlog = () => {
  const [vlogData, setVlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVlog = async () => {
      try {
        const response = await axios.get('http://localhost:5001/generateVlog');
        setVlogData(response.data);
      } catch (err) {
        setError('Failed to fetch vlog data');
      } finally {
        setLoading(false);
      }
    };

    fetchVlog();
  }, []);

  if (loading) return <p className="text-center text-xl mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 text-xl mt-10">{error}</p>;

  return (
    <div className="flex flex-col items-center py-10 px-4 lg:px-20">
      <h1 className="text-4xl font-bold text-gray-700 mb-8">Travel Vlogs</h1>

      {/* Vlog Descriptions */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-orange-600 mb-4">Vlog Descriptions</h2>
        <div
          className="text-gray-700 space-y-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: vlogData.vlog.replace(/\n/g, '<br>') }}
        />
      </div>

      {/* Image Gallery */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {vlogData.imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`Vlog Image ${index + 1}`} className="w-full h-48 object-cover rounded-lg shadow-md" />
        ))}
      </div>

      {/* Video Section */}
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-orange-600 mb-6">Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vlogData.videos.map((video, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
                <p className="text-gray-600 mt-2">{video.description}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-orange-500 font-bold hover:underline"
                >
                  Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vlog;
