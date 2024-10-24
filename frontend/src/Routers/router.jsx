import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../Pages/LandingPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
  ]);

  export default router;