import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import SignUp from "../Pages/Authentication/SignUp";
import SignIn from "../Pages/Authentication/SignIn";

const router = createBrowserRouter([
    {
        path: 'sign-up',
        element: <h2>signin</h2>
    },
    {
        path: 'sign-in',
        element: <h2>signin</h2>
    },
    {
      path: "/",
      element: <LandingPage />,
    },
  ]);

export default router;
