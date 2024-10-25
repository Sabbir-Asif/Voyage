import { useContext, useEffect } from "react";
import { AuthContext } from "../Authentication/AuthProvider";
import axios from "axios";

const BlogsPage = () => {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data using user._id
                const response = await axios.get(`http://localhost:3500/trip-details/search?userId=${user._id}`);
                
                // Log the data
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (user && user._id) {
            fetchData();
        }
    }, [user]);

    return (
        <div>
            <h2>Blogs Page</h2>
        </div>
    );
};

export default BlogsPage;
