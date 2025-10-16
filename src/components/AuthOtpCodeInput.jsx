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
			setFocusedIndex(0);
		}
	};

	const handleKeyDown = (e, index) => {
		const keyPressed = e.key;

		if (keyPressed === 'Backspace') {
			const next = [...code];

			if (next[index]) {
				next[index] = '';
				setCode(next);
				setFocusedIndex(index);
			} else if (index > 0) {
				next[index - 1] = '';
				setCode(next);
				setFocusedIndex(index - 1);
			}
		}

		if (keyPressed === 'ArrowLeft') {
			if (index > 0){
				setFocusedIndex(index - 1);
			}
		}

		if (keyPressed === 'ArrowRight') {
			if (index < INPUT_LENGTH - 1){
				setFocusedIndex(index + 1);
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (code.every(num => num !== '')) {
			verifyOTPCode(code.join(''));
		}
	}

	const onReset = () => {
		setCode(new Array(INPUT_LENGTH).fill(''));
		setFocusedIndex(0);
		clearError();
	}

	const handlePaste = async (event) => {
    event.preventDefault();

		// Text from copied data
    const text = event.clipboardData.getData('text/plain');
		if (/[^0-9]/.test(text) || text.length !== INPUT_LENGTH) {
			return;
		}

		const newCode = text.split('');
		setCode(newCode);
		if (newCode.every(num => num !== '')) {
			verifyOTPCode(newCode.join(''));
		}
  };

	return (
		<div className="otp-input-container">
			<form onSubmit={handleSubmit}>
				{code.map((num, index) => (
					<InputDigit
						key={index}
						index={index}
						value={num}
						onPaste={handlePaste}
						onFocus={() => onFocus(index)}
						isFocused={focusedIndex === index}
						onChange={(e) => handleChange(e, index)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						disabled={loading}
					/>
				))}
					
				<button
					type="submit"
					disabled={code.length < INPUT_LENGTH || loading}
					className="primary verify-button">
						{!loading ? 'Verify' : 'Loading'}
				</button>
					
				<button
					type="button"
					onClick={onReset}
					disabled={code.length === 0 || loading}
					className="primary light verify-button">
						Reset
				</button>
			</form>

			{error && <p className="error-text" role="alert">{error}</p>}

			<div className="resend-section">
				<p className="timer-text">Remaining time: {timeoutLeft}s</p>
				<p
					className="resend-text">Didn’t get the code? </p>
				<button
					type="button"
					onClick={resendOTPCode}
					disabled={timeoutLeft > 0 || loading}
					className="resend-button">
						Resend Code
				</button>
			</div>
		</div>
	);
}