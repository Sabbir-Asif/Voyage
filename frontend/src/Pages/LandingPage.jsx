import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbars/Navbar";

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
};

export default LandingPage;