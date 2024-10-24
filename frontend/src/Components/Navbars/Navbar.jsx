import { NavLink, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
import { PiGraphBold } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";
import { useContext } from "react";
import { userSignOut } from "../../firebase/GoogleAuth";
import { RiAdminLine } from "react-icons/ri";
import { AuthContext } from "../../contexts/AuthProvider";

const NavBar = () => {
    const { userInfo, setUserInfo } = useContext(AuthContext) || {};
    const navigate = useNavigate();

    const handleLogOut = () => {
        userSignOut();
        setUserInfo(null);
        console.log("User after logout: ", userInfo);
        navigate("/sign-in");
    };

    return (
        <div className="navbar bg-base-100 px-10">
            <div className="flex-1">
                <NavLink to="/" className="btn btn-ghost text-2xl font-bold">Voyage</NavLink>
            </div>
            <div className="flex-none">
                {/* If user is logged in, show profile, otherwise show Sign In */}
                {userInfo ? (
                    <>
                        {/* User Profile Dropdown */}
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="User Avatar"
                                        src={userInfo?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-between">
                                        Profile
                                    </a>
                                </li>
                                <li>
                                    <a>Settings</a>
                                </li>
                                <li>
                                    <button onClick={handleLogOut}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Sign In Button */}
                        <NavLink to="/sign-in" className="btn btn-primary">
                            Sign In
                        </NavLink>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavBar;
