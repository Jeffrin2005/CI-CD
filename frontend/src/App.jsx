import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page 1: Landing / Home */}
        <Route path="/" element={<LandingPage />} />

        {/* Page 2: Login & Register */}
        <Route path="/login" element={<LoginPage />} />

        {/* Page 3: Dashboard / Menu */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
