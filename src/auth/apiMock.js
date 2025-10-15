const USERS = {
    'admin@sushma.com': {
        id: 1,
        email: 'admin@sushma.com',
        // password1!
        password: 'cGFzc3dvcmQxIQ==',
        name: 'Adam the Admin',
        role: 'admin'
    },
    'sushma@sushma.com': {
        id: 2,
        email: 'sushma@sushma.com',
        // password2!
        password: 'cGFzc3dvcmQyIQ==',
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

function getMockUsers() {
    const usersJSON = sessionStorage.getItem('mockUsers');
    // Check if any data was found
    if (usersJSON) {
        // Parse the JSON string back into a JavaScript object
        const users = JSON.parse(usersJSON);
        
        return users;
    } else {
        sessionStorage.setItem('mockUsers', JSON.stringify(USERS));
        return USERS;
    }
}

export function apiLogin(email, password) {
    
    return new Promise((resolve, reject) => {
        console.log('here');
        const users = getMockUsers();
        if (!users[email]) {
        console.log('here!')
            return reject(new Error('Incorrect username or password.'));
        }
        console.log(password)
        console.log(btoa(password))
        console.log( users[email]?.password)
        console.log(btoa(password) !== users[email]?.password)
        if (users[email] && btoa(String(password)) !== users[email]?.password) {
            reject(new Error('Incorrect username or password!'));
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