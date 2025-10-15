import { useState } from 'react';
import '../styles/Login.css';
import { useAuth } from "../auth/useAuth";

export default function SignUpPage() {
  /* ---------------- Context state ---------------- */
  const { createLogin, loading, error, clearError } = useAuth();

	/* ---------------- UI state ---------------- */
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const [nameError, setNameError] = useState('');

	/* ---------------- Form Validation ---------------- */
	const handleNameChange = (e) => {
		clearError();
		setName(e.target.value);
	};

	const handleEmailChange = (e) => {
		clearError();
		setEmail(e.target.value);
		validateEmail();
	};

	const handlePasswordChange = (e) => {
		clearError();
		setPassword(e.target.value);
	}

	const handleConfirmPasswordChange = (e) => {
		clearError();
		setConfirmPassword(e.target.value);
	}

	const validateEmail = () => {
		// Regex for email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email === '') {
				setEmailError('Email cannot be empty.');
		} else if (!emailRegex.test(email)) {
				setEmailError('Please enter a valid email address.');
		} else {
				setEmailError('');
		}
	}

	const validatePassword = () => {
		if (password.length < 6) {
			setPasswordError('Password must be at least 6 characters long.');
		} else {
			setPasswordError('');
		}
	}

	const validateConfirmPassword = () => {
		validatePassword();
		if (password !== confirmPassword) {
			setConfirmPasswordError('Passwords do not match.');
		} else {
			setConfirmPasswordError('');
		}
	}

	const validateName = () => {
		if (name.trim() === '') {
			setNameError('Name cannot be empty.');
		} else {
			setNameError('');
		}
	}

  const buttonDisabled = password !== confirmPassword || password === '' || password.length < 6 || emailError.length > 0 || name === '';

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (error) {
			return;
		}
		clearError();
		try {
			await createLogin(name, email, password);

		} catch (err) {
			console.error('Error during sign up:', err);
		}
	}

	return (
		<>
			<h1 className="title">Sign Up</h1>
			<form className="login-form signin-form" onSubmit={handleSubmit}>
				<div className="input-group">
					<label htmlFor="name">Name</label>
					<input
						type="text"
						id="name"
						name="name"
						value={name}
						onBlur={validateName} 
						placeholder="Your name"
						onChange={handleNameChange}
						required
						aria-required="true"
						aria-describedby="nameHelp"
					/>
					{nameError && <p id="nameHelp" className="error-text">{nameError}</p>}
				</div>
				<div className="input-group">
					<label htmlFor="email">Email Address</label>
					<input
							type="email"
							id="email"
							name="email"
							value={email}
							onBlur={validateEmail} 
							placeholder="yourdomain@company.com"
							onChange={handleEmailChange}
							required
							aria-required="true"
							aria-describedby="emailHelp"
						/>
						{emailError && <p id="emailHelp" className="error-text">{emailError}</p>}
				</div>
				<div className="input-group">
					<label htmlFor="password">Password</label>
					<input
							type="password"
							id="password"
							name="password"
							value={password}
							onBlur={validatePassword} 
							onChange={handlePasswordChange}
							required
							aria-required="true"
							aria-describedby="pwHelp"
						/>
						{passwordError && <p id="pwHelp" className="error-text">{passwordError}</p>}
				</div>
					<div className="input-group">
						<label htmlFor="password">Confirm Password</label>
						<input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								onBlur={validateConfirmPassword} 
								onChange={handleConfirmPasswordChange}
								required
								aria-required="true"
								aria-describedby="cpwHelp"
						/>
							{confirmPasswordError && <p id="cpwHelp" className="error-text">{confirmPasswordError}</p>}
					</div>
					<button
						disabled={buttonDisabled|| error || loading}
						type="submit"
						className="primary login-button">Sign up</button>
					{error && <p className="error-text">{error}</p>}
			</form>
		</>
	);
}