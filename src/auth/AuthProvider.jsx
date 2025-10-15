/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
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
		const timeoutId = setInterval(() => {
			// const tick = () => setTimeout(remainingTimeLeft());
			// tick();
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

	const backtoLogin = () => {
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
		backtoLogin,
		clearError,
		createLogin
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}
