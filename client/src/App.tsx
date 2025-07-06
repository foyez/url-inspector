import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import "./App.css";
import URLDetails from "./pages/URLDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/details/:id" element={<URLDetails />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
