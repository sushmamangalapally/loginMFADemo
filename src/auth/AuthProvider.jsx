/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { apiLogin, apiVerify, apiResend, remainingTimeLeft } from "./apiMock";
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
    const [stage, setStage] = useState('login');
    const [email, setEmail] = useState('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [mfaID, setMfaID] = useState(null);
    const [timeoutLeft, setTimeoutLeft] = useState(0);

    useEffect(() => {
        const timeoutId = setInterval(() => {
            // const tick = () => setTimeout(remainingTimeLeft());
            // tick();
            if (stage !== 'mfa') {
                return;
            }

            const time = remainingTimeLeft();
            console.log(time)
            setTimeoutLeft(time);
        }, 1000);
        return () => clearInterval(timeoutId);
    }, [stage]);

    const startLogin = async (email) => {
        try {
            setLoading(true);
            setError(null);
            setEmail(email);
            const results = await apiLogin(email);
            setMfaID(results.mfaID);
            setStage('mfa');
        } catch (err) {
            setError(err.message || 'Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    }

    const verifyOTPCode = async (otpCode) => {
        if (!mfaID) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const results = await apiVerify(mfaID, otpCode);
            setUser(results.user);
            setStage('home');
        } catch (err) {
            setError(err.message || 'Verification failed. Try logging in again.');
        } finally {
            setLoading(false);
        }
    }

    const resendOTPCode = async () => {
        try {
            setError(null);
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
        setTimeoutLeft(0);
        setStage('login');
    }

    const clearError = () => setError(null);

    const value = {
        stage,
        loading,
        error,
        email,
        mfaID,
        user,
        timeoutLeft,
        setTimeoutLeft,
        startLogin,
        verifyOTPCode,
        resendOTPCode,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
// export const useAuth = () => useContext(AuthContext);
