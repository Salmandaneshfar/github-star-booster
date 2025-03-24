# GitHub Star Booster

A web application designed to help increase stars for your GitHub repositories.

## Features

- GitHub OAuth authentication
- Repository dashboard with star statistics
- Tools to boost repository visibility
- Star exchange network
- Analytics on star growth

## Installation

1. Clone the repository:
```
git clone https://github.com/Salmandaneshfar/github-star-booster.git
cd github-star-booster
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/github-star-booster
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
SESSION_SECRET=your_session_secret
```

4. Start the application:
```
npm run dev
```

## Technologies Used

- Node.js
- Express
- MongoDB
- EJS Templates
- GitHub OAuth
- Passport.js

## License

ISC 