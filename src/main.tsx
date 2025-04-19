//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

// Components
import App from "./App";
import CityResults from "./layouts/city-results";
import Microsite from "./layouts/microsite";

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------
const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="hotel/:city/:hotelName" element={<Microsite />} />
        <Route path="travel/:city/:adults/:children" element={<CityResults />} />
      </Routes>
    </BrowserRouter>
  );
}
