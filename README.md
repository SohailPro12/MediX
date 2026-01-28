# MediX - Medical Management Platform

A comprehensive medical management application that connects patients, doctors, and administrators in a seamless healthcare ecosystem.

## 📋 About

MediX is a full-stack mobile and web application designed to streamline healthcare operations. The platform enables efficient management of medical appointments, patient records, prescriptions, and administrative tasks.

## ✨ Features

### 👨‍⚕️ For Doctors
- **Appointment Management**: Confirm and manage patient appointments
- **Patient Records**: Access comprehensive medical histories
- **Prescriptions**: Create and manage digital prescriptions with PDF generation
- **Calendar Management**: Configure availability and working hours
- **Real-time Notifications**: Receive instant updates on new appointments

### 👤 For Patients
- **Doctor Search**: Find doctors by specialty and location
- **Appointment Booking**: Schedule appointments with preferred doctors
- **Medical Records**: Access personal medical history and documents
- **Prescription Access**: View and download prescriptions
- **Appointment Management**: Reschedule or cancel appointments
- **Notifications**: Stay updated on appointment confirmations

### 🔐 For Administrators
- **User Management**: Manage doctors, patients, and staff accounts
- **Statistics Dashboard**: Monitor platform usage and analytics
- **Problem Resolution**: Handle user-reported issues
- **System Monitoring**: Track platform performance and metrics

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo** - Cross-platform mobile development
- **React Navigation** - Navigation management
- **Axios** - HTTP client
- **i18next** - Internationalization
- **React Native Paper** - UI components
- **Expo Notifications** - Push notifications

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email notifications
- **Helmet** & **CORS** - Security middleware

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Expo CLI (for mobile development)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend/src` directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `config.js` file in the `frontend` directory:
```javascript
export const API_URL = 'http://localhost:3000'; // Update with your backend URL
```

4. Start the Expo development server:
```bash
npm start
```

5. Run on your preferred platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web
- Or scan the QR code with the Expo Go app

## 📱 Usage

### Initial Setup
1. Run the backend server
2. Run the frontend application
3. Register as a new user or login with existing credentials
4. Select your role (Patient, Doctor, or Admin)

### User Roles
- **Admin**: Full access to all features and system management
- **Doctor**: Access to appointments, patient records, and prescriptions
- **Patient**: Book appointments, view medical records, and manage prescriptions

## 📁 Project Structure

```
MediX/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express app setup
│   └── package.json
│
├── frontend/
│   ├── components/         # Reusable components
│   ├── screens/            # Screen components
│   │   ├── Doctor_Interface/
│   │   ├── Patient_Interface/
│   │   └── LoginFront/
│   ├── navigation/         # Navigation configuration
│   ├── locales/            # Translation files
│   ├── assets/             # Images and static files
│   └── package.json
│
└── sequence_diagrams.md    # System architecture diagrams
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet.js for HTTP headers security
- CORS configuration
- Role-based access control
- Input validation and sanitization

## 🌐 API Documentation

The backend provides RESTful APIs for:
- Authentication (`/api/auth`)
- User management (`/api/users`)
- Appointments (`/api/appointments`)
- Prescriptions (`/api/prescriptions`)
- Medical records (`/api/records`)
- Notifications (`/api/notifications`)

For detailed API documentation, refer to the sequence diagrams in `sequence_diagrams.md`

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **SohailPro12** - *Initial work*

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape MediX
- Built with modern healthcare standards in mind
- Inspired by the need for accessible healthcare technology
