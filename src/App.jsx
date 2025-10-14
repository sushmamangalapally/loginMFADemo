import { AuthProvider } from "./auth/AuthProvider.jsx";
import { useAuth } from "./auth/useAuth.js";
import './App.css'
import LoginPage from "./components/LoginPage";
import MFAPage from "./components/MFAPage";
import HomePage from "./components/HomePage";
import ErrorPage from "./components/ErrorPage";




function App() {
  const { stage, user, logout } = useAuth();

  // if (stage === 'login') {
  //   return <LoginPage/>
  // }

  // if (stage === 'mfa') {
  //   return <MFAPage/>
  // }

  if (!user && stage === 'error') {
    return <ErrorPage/>
  }

  return (
    <div className="container">
        {stage === 'login' && <LoginPage/>}
        {stage === 'mfa' && <MFAPage/>}
        {stage === 'home' && <HomePage/>}
        {/* <button onClick={logout}>Logout</button> */}
    </div>
  )
}

export default App
