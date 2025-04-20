//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";

// Components
import CityResults from "./pages/CityResults";
import Index from "./pages/Home";
import Microsite from "./pages/Microsite";

//------------------------------------------------------------------------------
// Routing Configuration
//------------------------------------------------------------------------------
const fetchData = async () => {
  const response = await fetch("/data.json");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

const Root = () => {
  const hotelData = useLoaderData();
  return <Outlet context={hotelData} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: fetchData,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "hotel/:city/:hotelName",
        element: <Microsite />,
      },
      {
        path: "travel/:city/:adults/:children",
        element: <CityResults />,
      },
    ],
  },
]);

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
function App() {
  return <RouterProvider router={router} />;
}

export default App;
