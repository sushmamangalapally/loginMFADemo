import { useState } from 'react';
import '../styles/Login.css';
import { useAuth } from "../auth/useAuth";
import SignUpPage from './SignUpPage';

export default function LoginPage() {
  /* ---------------- Context state ---------------- */
  const { startLogin, loading, error, clearError } = useAuth();

	/* ---------------- UI state ---------------- */
	const [errorEmail, setErrorEmail] = useState(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
  
	/* ---------------- Form Validation ---------------- */
	const toggleSignUp = () => {
		setIsSignUp(!isSignUp);
		clearError();
	}

	const handleEmailChange = (e) => {
		clearError();
		setErrorEmail('');
		const newEmail = e.target.value;
		setEmail(newEmail);
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (newEmail === '') {
			setErrorEmail('Email cannot be empty.');
		} else if (!emailRegex.test(newEmail)) { // Simple regex for email format
			setErrorEmail('Please enter a valid email address.');
		} else {
			setErrorEmail('');
		}
	};

	const handlePasswordChange = (e) => {
		clearError();
		setPassword(e.target.value);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		if (error) {
				return;
		}
		clearError();
		startLogin(email, password);
	}

	return (
		<section className="login-page center-section">
			<div className="card-container">
				<div className="card">
					{isSignUp ? (
						<>
							<p className="sign-up back-login"><span onClick={toggleSignUp}>Back to login page</span></p>
							<SignUpPage/>
						</>
					) : (
						<>
							<h1 className="title">Log In</h1>
							<form className="login-form" onSubmit={handleSubmit}>
								<div className="input-group">
									<label htmlFor="email">Email Address</label>
									<input
										type="email"
										id="email"
										name="email"
										placeholder="yourdomain@company.com"
										onChange={handleEmailChange}
										required
										aria-required="true"
										aria-describedby="emailHelp"
									/>
									{errorEmail && <p id="emailHelp" className="error-text">{errorEmail}</p>}
								</div>
								<div className="input-group">
									<label htmlFor="password">Password</label>
									<input
										type="password"
										id="password"
										name="password"
										onChange={handlePasswordChange}
										required
										aria-required="true"
									/>
								</div>
								<button
									type="submit"
									disabled={errorEmail || error || loading}
									className="primary login-button">Next</button>
								{error && <p className="error-text">{error}</p>}
							</form>
							<p className="sign-up">Don't have account yet? <span onClick={toggleSignUp}>Sign up</span></p>
						</>
						)}
				</div>
			</div>
		</section>
	);
}