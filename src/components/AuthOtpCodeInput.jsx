import { useState } from 'react';
import InputDigit from './InputDigit';
import { useAuth } from "../auth/useAuth";
import '../styles/Auth.css';

export default function AuthOtpCodeInput() {
  /* ---------------- Context state ---------------- */
	const { verifyOTPCode, timeoutLeft, loading, error, clearError, resendOTPCode, } = useAuth();

	/* ---------------- UI state ---------------- */
	const INPUT_LENGTH = 6;
	const [code, setCode] = useState(new Array(INPUT_LENGTH).fill(''));
	const [focusedIndex, setFocusedIndex] = useState(0);

	/* ---------------- Events and Handlers ---------------- */
	function onFocus(index) {
			setFocusedIndex(index);
	}

	const handleChange = (e, index) => {
		const value = e.target.value;
		if (/[^0-9]/.test(value)) {
				return;
		}
		const newCode = [...code];
		newCode[index] = value;
		setCode(newCode);
		if (value && index < INPUT_LENGTH - 1) {
				onFocus(index + 1);
		}

		if (newCode.every(num => num !== '')) {
				verifyOTPCode(newCode.join(''));
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			const newCode = [...code];
			newCode[index - 1] = '';
			setCode(newCode);
			setFocusedIndex(index - 1);
		} else if (e.key === 'ArrowLeft' && index > 0) {
			setFocusedIndex(index - 1);
		} else if (e.key === 'ArrowRight' && index < length - 1) {
			setFocusedIndex(index + 1);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (code.every(num => num !== '')) {
			verifyOTPCode(code.join(''));
		}
	}

	const onReset = () => {
		setCode(new Array(6).fill(''));
		setFocusedIndex(0);
		clearError();
	}

	return (
		<div className="otp-input-container">
			<form onSubmit={handleSubmit}>
				{code.map((num, index) => (
					<InputDigit
						key={index}
						value={num}
						onFocus={() => onFocus(index)}
						isFocused={focusedIndex === index}
						onChange={(e) => handleChange(e, index)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						disabled={loading}
					/>
				))}
					
				<button
					type="submit"
					disabled={code.length < 6 || loading}
					className="primary verify-button">
						{!loading ? 'Verify' : 'Loading'}
				</button>
					
				<button
					onClick={onReset}
					disabled={code.length === 0 || loading}
					className="primary light verify-button">
						Reset
				</button>
			</form>

			{error && <p className="error-text">{error}</p>}

			<div className="resend-section">
				<p className="timer-text">Remaining time: {timeoutLeft}s</p>
				<p
					className="resend-text"
					disabled={timeoutLeft > 0}>Didn’t get the code? <span
					onClick={resendOTPCode}>Resend</span></p>
			</div>
		</div>
	);
}