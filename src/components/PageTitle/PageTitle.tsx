//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//------------------------------------------------------------------------------
// Types & Interfaces
//------------------------------------------------------------------------------
type PageTitleProps = {
  title: string;
};

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
const PageTitle = ({ title }: PageTitleProps) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [title, location]);

  return null;
};

export default PageTitle;
