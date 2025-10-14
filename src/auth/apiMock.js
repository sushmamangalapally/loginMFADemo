const USERS = {
    'admin@sushma.com': {
        id: 1,
        email: 'admin@sushma.com',
        name: 'Adam the Admin',
        role: 'admin'
    },
    'sushma@sushma.com': {
        id: 2,
        email: 'sushma@sushma.com',
        name: 'Sushma the User',
        role: 'user'
    }
};

// MOCK STATE:
let currentOTPCode = '123456';
let pendingEmail = '';

// TIMERS:
let codeExpiresAt = 0; // when the OTP becomes invalid
let resendAvailableAt = 0; // when user can request a new code

const CODE_VALID_FOR = 5 * 60 * 1000;   // 5 min code validity
const RESEND_TIME_TO_SEND = 30 * 1000; // 30s before "Resend" allowed


function generateOTPCode() {
    let digits = '0123456789';
    let code = '';
    const digLength = digits.length;
    for (let i = 0; i < 6; i++) {
        // eslint-disable-next-line no-unused-vars
        code += digits[Math.floor(Math.random() * digLength)];
    }
    return '123456';
}

export function remainingTimeLeft() {
    console.log(resendAvailableAt)
    console.log( Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000)))
  return Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
}

export function apiLogin(email) {
    
    return new Promise((resolve, reject) => {
        if (!USERS[email]) {
            reject(new Error('No users exist!'));
            return;
        }
        setTimeout(() => {
            currentOTPCode = generateOTPCode();
            pendingEmail = email;

            const now = new Date();
            codeExpiresAt = new Date(now.getTime() + (CODE_VALID_FOR))
            // now + CODE_VALID_FOR;
            resendAvailableAt = new Date(now.getTime() + (RESEND_TIME_TO_SEND))
            // now + RESEND_TIME_TO_SEND;
            console.log(codeExpiresAt)
            console.log(resendAvailableAt)

            resolve({
                mfaID: 'abcMFAID',
                method: 'email',
                email,
            })
        }, 400);
    })
}

export function apiVerify(mfaID, otpCode) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
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
                const user = USERS[pendingEmail];
                pendingEmail = null;
                resolve({user, method: 'mfa'});
            } else {
                reject(new Error('Invalid OTP Code!'));
                return;
            }
        }, 400);
    })
}



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

