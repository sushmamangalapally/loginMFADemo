import { useState } from 'react';
import '../styles/Login.css';
import { useAuth } from "../auth/useAuth";

export default function LoginPage() {
    const { startLogin, loading, error, clearError } = useAuth();

    const [errorEmail, setErrorEmail] = useState(null);
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        clearError();
        setErrorEmail('');
        const newEmail = e.target.value;
        setEmail(newEmail);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (newEmail === '') {
            setErrorEmail('Email cannot be empty.');
        } else if (!emailRegex.test(newEmail)) { // Simple regex for email format
            setErrorEmail('Please enter a valid email address.');
        } else {
            setErrorEmail('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error) {
            return;
        }
        clearError();
        startLogin(email)
        // Proceed with form submission logic, e.g., call an API
        console.log('Form submitted with email:', email);
    }

    return (
        <section className="login-page center-section">
            <div className="card-container">
                <div className="card">
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
                                required />
                            {errorEmail && <p className="error-text">{errorEmail}</p>}
                        </div>
                        <button
                        type="submit"
                        disabled={errorEmail || error || loading}
                        className="primary login-button">Next</button>
                        {error && <p className="error-text">{error}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
}