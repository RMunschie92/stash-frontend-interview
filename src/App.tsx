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
        path: "travel/:city",
        element: <CityResults />,
      },
    ],
  },
]);

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
function App() {
  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-[1000px] mx-auto px-4 py-4 sm:py-6">
          <a href="/" className="block w-fit">
            <h1 className="text-2xl font-bold text-orange-600 ">
              Independent Hotel Booking
            </h1>
          </a>
        </div>
      </header>
      <main className="font-mulish text-gray-700 p-4 pt-6 lg:max-w-[1000px] mx-auto">
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;
