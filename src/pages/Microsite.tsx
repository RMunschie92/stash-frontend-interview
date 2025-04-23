//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Components
import Search from "../components/Search/Search";

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
const MicrositeLayout = () => {
  return (
    <div>
      <main className="flex-grow">
        <Search />
        <h1>Microsite</h1>
      </main>
    </div>
  );
};

export default MicrositeLayout;
