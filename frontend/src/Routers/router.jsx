import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import SignUp from "../Pages/Authentication/SignUp";
import SignIn from "../Pages/Authentication/SignIn";

const router = createBrowserRouter([
    {
        path: 'sign-up',
        element: <SignUp />
    },
    {
        path: 'sign-in',
        element: <SignIn />
    },
    {
      path: "/",
      element: <LandingPage />,
    },
  ]);

export default router;
