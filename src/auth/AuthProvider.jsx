/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from 'react';
import { apiLogin, apiVerify, apiResend, remainingTimeLeft, apiAddUser } from "./apiMock";
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
	/* ---------------- Context state ---------------- */
	const [stage, setStage] = useState('login');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [user, setUser] = useState(null);
	const [mfaID, setMfaID] = useState(null);
	const [timeoutLeft, setTimeoutLeft] = useState(0);

	/* ---------------- Side Effects ---------------- */
	useEffect(() => {
		const stored = localStorage.getItem('authUser');
		if (stored) {
			setUser(JSON.parse(stored));
			setStage('home');
		}
	}, []);

	useEffect(() => {
		const timeoutId = setInterval(() => {
			if (stage !== 'mfa') {
				return;
			}

			const time = remainingTimeLeft();
			setTimeoutLeft(time);
		}, 1000);
		return () => clearInterval(timeoutId);
	}, [stage]);

	/* ---------------- Events and Handlers ---------------- */
	const startLogin = async (email, password) => {
		try {
			setLoading(true);
			setError(null);
			setEmail(email);
			setPassword(password);
			const results = await apiLogin(email, password);
			setMfaID(results.mfaID);
			setStage('mfa');
		} catch (err) {
			console.error('startLogin error', err);
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
			localStorage.setItem('authUser', JSON.stringify(results.user));
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
		localStorage.removeItem("authUser");
		setStage('login');
	}

	const backToLogin = () => {
		setLoading(false);
		setError(null);
		setUser(null);
		setMfaID(null);
		setTimeoutLeft(0);
		setStage('login');
	}

	const clearError = () => setError(null);

	const createLogin = async (name, email, password) => {
		try {
			setLoading(true);
			setError(null);
			await apiAddUser(name, email, password);
			await startLogin(email, password);
		} catch (err) {
			console.error('createLogin error', err);
			setError(err.message || 'Signup failed. Try again.');
		} finally {
			setLoading(false);
		}
	}

	const contextValue = {
		stage, loading, error, email, mfaID, user, timeoutLeft,
		startLogin, verifyOTPCode, resendOTPCode, logout, backToLogin, clearError, createLogin,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	);
}
