import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";
import SignIn from "../Pages/Signin";
import SignUp from "../Pages/SignUp";
import Home from "../Components/Home/Home";
import PlanATrip from "../Components/TripPlan/PlanATrip";
import YourTrip from "../Components/YourTrip/YourTrip";

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
    {
        path: "/home",
        element: <Home />,
        children: [
            {
                path: 'plan-trip',
                element: <PlanATrip />
            },
            {
                path: 'your-trip',
                element: <YourTrip />
            }
        ]
    }
  ]);

export default router;
