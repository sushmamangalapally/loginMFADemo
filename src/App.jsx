import { AuthProvider, useAuth } from "./auth/AuthContext";
// import LoginPage from "./components/LoginPage";
// import MFAPage from "./components/MFAPage";
// import HomePage from "./pages/HomePage";


import './App.css'

function App() {
  const { stage } = useAuth();

  return (
    <>
      <AuthProvider>
        <p>{stage}</p>
        {/* {stage === 'login' && <LoginPage/>}
        {stage === 'mfa' && <MFAPage/>}
        {stage === 'home' && <Homepage/>} */}
      </AuthProvider>
    </>
  )
}

export default App
