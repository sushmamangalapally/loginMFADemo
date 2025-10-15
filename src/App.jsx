import { AuthProvider } from "./auth/AuthProvider.jsx";
import { useAuth } from "./auth/useAuth.js";
import './App.css'
import LoginPage from "./components/LoginPage";
import MFAPage from "./components/MFAPage";
import HomePage from "./components/HomePage";

function App() {
  const { stage } = useAuth();

  return (
    <div className="container">
      {stage === 'login' && <LoginPage/>}
      {stage === 'mfa' && <MFAPage/>}
      {stage === 'home' && <HomePage/>}
    </div>
  )
}

export default App;
