import { useState, createContext, useContext } from 'react';
import { apiLogin, apiVerify, apiResend } from "./mockApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [stage, setStage] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [mfaID, setMfaID] = useState(null);

    const startLogin = async (email) => {
        try {
            setLoading(true);
            setError(null);
            const results = await apiLogin(email);
            setMfaID(results.mfaID);
            setStage('mfa');
        } catch (err) {
            setError(err.message || 'Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    }

    const verifyOPTCode = async (optCode) => {
        if (!mfaID) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const results = await apiVerify(mfaID, optCode);
            setUser(results.user);
            setStage('home');
        } catch (err) {
            setError(err.message || 'Verification failed. Try logging in again.');
        } finally {
            setLoading(false);
        }
    }

    const resendOPTCode = async () => {
        try {
            await apiResend();
        } catch (err) {
            setError(err.message || "Please wait before resending!");
        }
    }

    const logout = () => {
        setLoading(false);
        setError(null);
        setUser(null);
        setMfaID(null);
        setStage('login');
    }

    const clearError = () => setError(null);

    const value = {
        stage,
        loading,
        error,
        mfaID,
        user,
        startLogin,
        verifyOPTCode,
        resendOPTCode,
        logout,
        clearError
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
