import "bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './css/style.css';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NoPage from "./pages/NoPage";
import SignUpPage from "./pages/SignUpPage";
import UserSettings from "./pages/UserSettingsPage";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/user-settings" element={<UserSettings />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
