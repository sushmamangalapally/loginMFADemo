import '../styles/Login.css';
import { useAuth } from "../auth/useAuth";
import AuthOtpCodeInput from './AuthOtpCodeInput.jsx';

export default function MFAPage() {
	const { email } = useAuth();

	const emailHidden = email ? email.replace(/(.{2})(.*)(?=@)/,
		(match, p1, p2) => p1 + '*'.repeat(p2.length)) : '';

	return (
		<section className="login-page center-section">
			<div className="card-container">
				<div className="card">
					<h1 className="title">Check your email</h1>
					<h2>Please enter the six digit verification code we sent to {emailHidden}</h2>
					<AuthOtpCodeInput/>
				</div>
			</div>
		</section>
	);
}