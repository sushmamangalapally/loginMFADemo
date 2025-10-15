import fetchMock from '../auth/fetchMock.js';

/* ---------------- Mock Saved Data ---------------- */
let currentOTPCode = '123456';
let pendingEmail = '';

/* ---------------- Timers ---------------- */
let codeExpiresAt = 0; // when the OTP becomes invalid
let resendAvailableAt = 0; // when user can request a new code

const CODE_VALID_FOR = 5 * 60 * 1000;   // 5 min code validity
const RESEND_TIME_TO_SEND = 30 * 1000; // 30s before "Resend" allowed

/**
 * @description Generates 6 digit number using from number string
 *
 * @returns {string} String of 6 digit number
 * @example
 * const result = generateOTPCode(); // 123456
 */
function generateOTPCode() {
    let digits = '0123456789';
    let code = '';
    const digLength = digits.length;
    for (let i = 0; i < 6; i++) {
        // eslint-disable-next-line no-unused-vars
        code += digits[Math.floor(Math.random() * digLength)];
    }
    // Returning static data for now
    return '123456';
}

/**
 * @description Retrieves time of seconds left when OTP was requested
 *
 * @returns {number} Seconds Left
 * @example
 * const result = remainingTimeLeft(); // 30
 */
export function remainingTimeLeft() {
  return Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
}

/**
 * Fetches data from a Users API endpoint. Or get from session storage
 * @returns {Promise<Object>} A Promise that resolves with the parsed JSON data from the API.
 * @throws {Error} If fails to retrieve users
 */
async function getMockUsers() {
	try {
		const usersJSON = sessionStorage.getItem('mockUsers');
		// Check if any data was found
		if (usersJSON) {
			const users = JSON.parse(usersJSON);
			return users;
		} else {
			const response = await fetchMock('/users');
			const users = await response.json();
			sessionStorage.setItem('mockUsers', JSON.stringify(users));
			return users;
		}
	} catch(error) {
    console.error('Error fetching data:', error);
    throw error;
	}
}

/**
 * Check if we can login and start timer for code expiration and when to resend OTP
 * @param {string} email - Email of the user
 * @param {string} password - Password of the user
 * @returns {Promise<Object>} A Promise that resolves with the JSON data
 * @throws {Error} If login fails
 */
export function apiLogin(email, password) {
	return new Promise((resolve, reject) => {
		const users = getMockUsers();
		if (!users[email]) {
			return reject(new Error('Incorrect username or password.'));
		}
		if (users[email] && btoa(String(password)) !== users[email]?.password) {
			reject(new Error('Incorrect username or password!'));
			return;
		}
		setTimeout(() => {
			currentOTPCode = generateOTPCode();
			pendingEmail = email;

			const now = new Date();
			codeExpiresAt = new Date(now.getTime() + (CODE_VALID_FOR))
			resendAvailableAt = new Date(now.getTime() + (RESEND_TIME_TO_SEND))

			resolve({
					mfaID: 'abcMFAID',
					method: 'email',
					email,
			})
		}, 400);
  });
}

/**
 * Verify if OTP is correct
 * @param {string} mfaID - MFA ID for authentication
 * @param {string} otpCode - OTP code
 * @returns {Promise<Object>} A Promise that resolves with success JSON data
 * @throws {Error} If OTP fails
 */
export function apiVerify(mfaID, otpCode) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const users = getMockUsers();
			if (!pendingEmail) {
				reject(new Error('No auth in process!'));
				return;
			}
			const now = Date.now();
			if (now > codeExpiresAt) {
				reject(new Error('Time is up! Code is expired. Try again!'));
				return;
			}
			if (otpCode === currentOTPCode) {
				const user = users[pendingEmail];
				pendingEmail = null;
				resolve({user, method: 'mfa'});
			} else {
				reject(new Error('Invalid OTP Code!'));
				return;
			}
		}, 400);
	});
}

/**
 * Verify if OTP is expired and user requests to send another one
 * @returns {Promise<Object>} A Promise that resolves with success JSON data
 * @throws {Error} If resend OTP fails
 */
export function apiResend() {
	return new Promise((resolve, reject) => {
			const now = Date.now();
			if (now < resendAvailableAt) {
					return reject(new Error("Please wait before resending"));
			}

			setTimeout(() => {
					currentOTPCode = generateOTPCode();
					const now = Date.now();
					codeExpiresAt = now + CODE_VALID_FOR;
					resendAvailableAt = now + RESEND_TIME_TO_SEND;

					resolve({ eventOccured: 'resent OTP'});
			}, 200);
	})
}

/**
 * Add users to "database" or mock up User data
 * @param {string} name - Name of the new user
 * @param {string} email - Email of the new user
 * @param {string} password - Password of the new user
 * @returns {Promise<Object>} A Promise that resolves with success JSON data
 * @throws {Error} If user already exists
 */
export function apiAddUser(name, email, password) {
	return new Promise((resolve, reject) => {
		const existingUsers = getMockUsers() || [];
		if (existingUsers[email]) {
			return reject(new Error("This user already exists. Try signing in."));
		}

		setTimeout(() => {
			const newUser = {
				id: existingUsers.length+1,
				email: email,
				password: btoa(password),
				name: name,
				role: 'user'
			}
			
			// Add the new user to the array
			existingUsers[email] = newUser;
			
			// Save the updated array back to sessionStorage
			sessionStorage.setItem('mockUsers', JSON.stringify(existingUsers));
			resolve({newUser});
		}, 200);
	})

}