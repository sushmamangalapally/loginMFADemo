# Login MFA UI

A React app to demonstrate a multi-step authentication flow to Role-Based Dashboard

## Tech Stack

- **Framework:** React
- **Styling:** Plain CSS
- **Testing:** Cypress

## Features

- Email and Password login with OTP verification
- Admin and User Access Level 
- Dashboard with editable fields and table


## Run Locally

Clone the project

```bash
  git clone https://github.com/sushmamangalapally/loginMFADemo
```

Go to the project directory

```bash
  cd loginMFADemo
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


Visit http://localhost:5173

Sample Authentication Users You Can Use:
- Admin User Access:
    - email: 'admin@sushma.com',
    - password: 'password1!'
- Regular User 1 Access:
    - email: 'sushma@sushma.com',
    - password: 'password2!'
- Regular User 2 Access:
    - email: 'user@example.com',
    - password: 'password3!'


## Running Tests

To run tests, run the following command

```bash
  npx cypress open
```

- Select a browser: Choose Chrome if you can.
- Click on E2E testing
- Open  E2E testing
- Then, click completetest.cy,js file under Specs
- Run all specs


### Test Cases
- Verify complete path with correct OTP is working: Login -> MFA -> Home
- Verify complete path with wrong OTP is working: Login -> MFA
- Verify admin user can edit and update a table row
## Credits

[Icon: person by Dwi ridwanto from Noun Project](https://thenounproject.com/browse/icons/term/person/)