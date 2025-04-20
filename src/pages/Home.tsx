//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import { useOutletContext } from "react-router-dom";

// Components
import Search from "../components/Search";

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
const Index = () => {
  return (
    <main>
      <Search />
      <h1>Hotels page</h1>
    </main>
  );
};

export default Index;
