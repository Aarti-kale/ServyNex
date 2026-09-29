# ServyNex

ServyNex is a full-stack home service marketplace that connects customers with service professionals. The platform provides service discovery, booking, professional management, payments, dashboards, authentication, and AI-powered assistance.

## Features

* Customer registration and authentication
* Service browsing and discovery
* Service booking and management
* Professional registration and management
* Professional verification workflow
* Customer and professional dashboards
* Payment integration
* Booking and service management
* AI-powered chatbot for service discovery and assistance
* RESTful API architecture
* Responsive user interface
* Secure authentication and authorization

## Tech Stack

### Frontend

* React.js
* JavaScript
* Bootstrap
* Axios

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB

### Tools

* Git
* GitHub
* npm

## Project Structure

```text
ServyNex/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd ServyNex
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

Open another terminal:

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in both the `frontend` and `backend` directories and add the required environment variables.

Do not commit `.env` files or any private API keys, database credentials, passwords, or secrets to GitHub.

## Running the Application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The application will then be available through the local development URL provided by the frontend development server.

## API

The backend provides REST APIs for:

* Authentication
* Users
* Services
* Bookings
* Professionals
* Payments
* Verification
* Content management
* Other platform functionality

## Development

This project is organized as a separate frontend and backend application to maintain a clean and scalable full-stack architecture.

## License

This project is for educational and development purposes.
