import '../styles/Login.css';
import { useAuth } from "../auth/useAuth";
import AuthOtpCodeInput from './AuthOtpCodeInput.jsx';

export default function MFAPage() {
    const { email } = useAuth();

    return (
        <section className="login-page center-section">
            <div className="card-container">
                <div className="card">
                    <h1 className="title">Check your email</h1>
                    <h2>Please enter the six digit verification code we sent to {email}</h2>
                    <AuthOtpCodeInput
                    />
                </div>
            </div>
        </section>
    );
}