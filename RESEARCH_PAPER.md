# Electric Vehicle (EV) Charging Parameters Estimation on a Web Portal
## Synopsis Report

---

## TITLE PAGE

**Electric Vehicle (EV) Charging Parameters Estimation on a Web Portal**

A Synopsis Report Submitted in Partial Fulfillment of the Requirements for the Degree of Bachelor of Technology

**Submitted by:**
- Manjeet Kumar Maurya (2203450100045)
- Pal Devendra (2203450100050)
- Prashant Shukla (2203450100055)
- Poorvi Srivastava (2203450100051)

**Under the Supervision of:**
Mr. Kushagra Shukla (Assistant Professor)

---

## 1. INTRODUCTION

### 1.1 Background
The rapid growth of Electric Vehicle (EV) adoption has created a critical need for efficient charging infrastructure. With increasing concerns about climate change and environmental sustainability, EVs are becoming the preferred mode of transportation. However, one of the major challenges is the lack of accessible and reliable information about charging station locations, availability, and estimated charging times.

### 1.2 Problem Statement
- **Limited Information Access**: Users struggle to find nearby charging stations
- **Uncertain Charging Time**: Lack of accurate estimation of charging duration based on battery capacity and charger specifications
- **Poor User Experience**: No integrated platform to manage and track EV charging history
- **Inefficient Station Management**: Station owners cannot efficiently manage their facilities or track usage

### 1.3 Objectives
1. Develop a comprehensive web portal to locate EV charging stations
2. Implement accurate charging time estimation algorithms
3. Provide users with booking capabilities and charging history tracking
4. Enable station owners to upload and manage their charging infrastructure
5. Enhance user experience through intuitive UI/UX design

### 1.4 Scope
This project encompasses:
- Frontend development using React with Vite
- Backend development using Node.js and Express
- Real-time charging station location mapping
- Charging parameter estimation
- User authentication and authorization
- Booking management system
- Station management dashboard

---

## 2. LITERATURE REVIEW

### 2.1 Existing Solutions
- **PlugShare**: Community-based charging network locator
- **ChargePoint**: Enterprise charging solution with real-time availability
- **Tesla Supercharger Network**: Proprietary charging infrastructure
- **Google Maps EV Charging Integration**: Basic station location services

### 2.2 Research Gaps
- Lack of accurate local charging infrastructure data in many regions
- Limited real-time availability information
- Insufficient charging time prediction models
- Poor integration of user feedback and ratings

### 2.3 Technical Approaches in Similar Projects
- Geolocation services and mapping APIs
- Machine learning models for charging time estimation
- Cloud-based infrastructure for scalability
- Mobile and web-based applications for accessibility

---

## 3. PROPOSED SOLUTION

### 3.1 System Architecture

#### Frontend (Client-side)
- **Framework**: React with Vite
- **Key Components**:
  - Charging Station Map (Interactive mapping interface)
  - Station Filter (Search and filtering functionality)
  - Station Details (Comprehensive station information)
  - Booking System (Reservation management)
  - User Dashboard (History and profile management)
  - Authentication (Login/Register)

#### Backend (Server-side)
- **Technology**: Node.js with Express.js
- **Key Modules**:
  - Authentication Controller (User login/registration)
  - Station Controller (CRUD operations for stations)
  - Booking Controller (Reservation management)
  - Station Router (API endpoints)

#### Database
- **Technology**: MongoDB (Document-based NoSQL)
- **Collections**:
  - Users
  - Stations
  - Bookings

### 3.2 Key Features

#### 3.2.1 Charging Station Locator
- Interactive map interface showing all available charging stations
- Real-time location filtering based on user proximity
- Station availability status

#### 3.2.2 Charging Parameters Estimation
**Algorithm considers:**
- Battery capacity (kWh)
- Current battery level (%)
- Charger type and power rating (kW)
- Charging efficiency losses
- Temperature conditions (optional)

**Formula:**
```
Estimated Charging Time = (Battery Capacity × (100 - Current Level) / 100) / Charger Power
(with efficiency adjustments)
```

#### 3.2.3 Station Management
- Station owners can upload and manage station details
- Real-time occupancy tracking
- Performance analytics

#### 3.2.4 User Booking System
- Reserve charging slots in advance
- View booking history
- Cancel or modify bookings

#### 3.2.5 User Authentication
- Secure login/registration
- Role-based access (User/Station Owner/Admin)
- Password hashing and JWT tokens

---

## 4. TECHNICAL IMPLEMENTATION

### 4.1 Frontend Technologies
- **React.js**: Component-based UI development
- **Vite**: Fast build tool and development server
- **Google Maps API**: For mapping functionality
- **Axios/Fetch**: For API communication
- **React Router**: For navigation
- **Context API**: For state management

### 4.2 Backend Technologies
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM (Object Data Modeling)
- **JWT (JSON Web Tokens)**: Authentication
- **bcryptjs**: Password hashing

### 4.3 Project Structure

```
client/
├── src/
│   ├── Component/       (Layout components)
│   ├── ComponentCore/   (Core business components)
│   ├── Pages/          (Page components)
│   ├── Context/        (State management)
│   └── MINIAPI/        (API integration)
│
server/
├── controller/         (Business logic)
├── Model/             (Database schemas)
├── Router/            (API routes)
├── middleware/        (Authentication, validation)
└── index.js           (Server entry point)
```

---

## 5. CHARGING TIME ESTIMATION ALGORITHM

### 5.1 Calculation Method

**Input Parameters:**
- `batteryCapacity` (kWh): Total battery capacity
- `currentLevel` (%): Current battery percentage
- `chargerPower` (kW): Charger output power

**Formula:**
```
Time = (Capacity × (100 - currentLevel) / 100) / Charger Power (hours)
```

### 5.2 Example Calculation
- Battery: 60 kWh
- Current Level: 20%
- Charger: 7 kW
- Remaining: 60 × (100-20)/100 = 48 kWh
- **Time: 48 / 7 = ~6.86 hours**

### 5.3 Advanced Considerations
- **Temperature correction**: Cold weather reduces efficiency
- **Charger degradation**: Account for efficiency losses
- **Battery health**: Age affects charging speed
- **Simultaneous charging**: Multiple vehicles sharing capacity

---

## 6. DATABASE DESIGN

### 6.1 User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user/stationOwner/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### 6.2 Station Schema
```javascript
{
  _id: ObjectId,
  name: String,
  location: { latitude, longitude },
  address: String,
  chargers: [{
    type: String,
    power: Number (kW),
    quantity: Number,
    available: Number
  }],
  owner: ObjectId (ref: User),
  rating: Number,
  reviews: [String],
  operatingHours: { open, close },
  createdAt: Date,
  updatedAt: Date
}
```

### 6.3 Booking Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  station: ObjectId (ref: Station),
  bookingDate: Date,
  startTime: Time,
  estimatedDuration: Number (hours),
  status: String (pending/completed/cancelled),
  batteryLevel: Number (%),
  chargerType: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 7. API ENDPOINTS

### 7.1 Authentication APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### 7.2 Station APIs
- `GET /api/stations` - Get all stations
- `GET /api/stations/:id` - Get station details
- `POST /api/stations` - Create new station (owner)
- `PUT /api/stations/:id` - Update station (owner)
- `DELETE /api/stations/:id` - Delete station (owner)

### 7.3 Booking APIs
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:userId` - Get user bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

---

## 8. USER INTERFACE FEATURES

### 8.1 Home Page
- Hero section highlighting the platform
- Feature highlights
- Testimonials from users
- Call-to-action buttons

### 8.2 Map Page
- Interactive Google Map with all stations
- Filter by charger type, power, availability
- Click on stations for quick details
- Distance calculation from current location

### 8.3 Station Details Page
- Complete station information
- Available chargers and their specifications
- Reviews and ratings
- Booking interface
- Charging time calculator

### 8.4 Booking Page
- Select charging parameters
- Automatic time estimation
- Confirm and receive booking confirmation
- Option to add to calendar

### 8.5 Dashboard
- User profile management
- Booking history
- Saved stations
- Account settings

### 8.6 Station Management
- Add/edit/delete stations
- View bookings for your station
- Usage analytics
- Revenue reports (if applicable)

---

## 9. SECURITY FEATURES

### 9.1 Authentication & Authorization
- JWT-based token authentication
- Role-based access control (RBAC)
- Secure password hashing with bcrypt

### 9.2 Data Protection
- HTTPS for all communications
- SQL/NoSQL injection prevention
- XSS (Cross-Site Scripting) protection
- CSRF (Cross-Site Request Forgery) tokens

### 9.3 Privacy
- User data encryption
- GDPR compliance considerations
- Secure session management
- Rate limiting on API endpoints

---

## 10. SYSTEM WORKFLOW

### 10.1 User Journey
1. User registers/logs in
2. Views map with nearby charging stations
3. Filters stations by charger type/power
4. Clicks on a station for details
5. Enters vehicle battery capacity and current level
6. System estimates charging time
7. User books the station
8. Receives confirmation and booking details
9. Can track booking in dashboard
10. Views charging history

### 10.2 Station Owner Journey
1. Owner registers as station owner
2. Uploads station details and charger information
3. System displays station on map
4. Owner can view bookings
5. Monitor station usage analytics
6. Update station information as needed

---

## 11. ADVANTAGES OF THE PROPOSED SYSTEM

1. **User-Friendly Interface**: Intuitive design for easy navigation
2. **Accurate Estimation**: Real-time charging time prediction
3. **Accessibility**: Web-based, accessible from any device
4. **Real-Time Data**: Live station availability and status
5. **Booking Management**: Simplified reservation system
6. **History Tracking**: Users can track their charging history
7. **Scalability**: Cloud-ready architecture for future growth
8. **Community Feedback**: User reviews and ratings
9. **Cost-Effective**: Reduces time and fuel spent searching for chargers
10. **Environmental Impact**: Encourages EV adoption through better infrastructure information

---

## 12. CHALLENGES AND SOLUTIONS

| Challenge | Solution |
|-----------|----------|
| Real-time data accuracy | Integration with station APIs and IoT sensors |
| User adoption | Gamification and rewards program |
| Payment processing | Integration with secure payment gateways |
| Scalability | Microservices architecture and database optimization |
| Data privacy | Encryption and compliance with regulations |
| Mobile responsiveness | Progressive Web App (PWA) development |

---

## 13. FUTURE ENHANCEMENTS

1. **Mobile App**: Native iOS and Android applications
2. **AI-Based Recommendations**: ML algorithms to recommend optimal charging stations
3. **Predictive Pricing**: Dynamic pricing based on demand
4. **Integration with Smart Grids**: Real-time grid management
5. **EV Charging Router**: Suggest optimal route to nearest available station
6. **Social Features**: Connect EV owners, share experiences
7. **Energy Analytics**: Environmental impact tracking
8. **Integration with Vehicle OBD**: Automatic battery data fetching
9. **Payment Integration**: In-app payment processing
10. **Multi-language Support**: Support for multiple languages

---

## 14. IMPLEMENTATION TIMELINE

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1: Planning & Design | Week 1-2 | Requirements gathering, system design, database schema |
| Phase 2: Frontend Development | Week 3-6 | UI components, pages, API integration |
| Phase 3: Backend Development | Week 3-6 | Controllers, models, APIs, authentication |
| Phase 4: Integration & Testing | Week 7-8 | End-to-end testing, bug fixing, optimization |
| Phase 5: Deployment & Documentation | Week 9 | Deployment, user documentation, final review |

---

## 15. TESTING STRATEGY

### 15.1 Unit Testing
- Test individual components and functions
- Use Jest for JavaScript testing

### 15.2 Integration Testing
- Test API endpoints
- Test database interactions
- Use Postman for API testing

### 15.3 System Testing
- End-to-end workflow testing
- Load testing for scalability
- Security testing for vulnerabilities

### 15.4 User Acceptance Testing
- Test with real users
- Gather feedback for improvements

---

## 16. DEPLOYMENT & MAINTENANCE

### 16.1 Deployment Strategy
- **Frontend**: Deploy on Vercel or Netlify
- **Backend**: Deploy on Heroku or AWS
- **Database**: MongoDB Atlas (Cloud)

### 16.2 Maintenance Plan
- Regular security updates
- Performance monitoring
- Bug fixes and patches
- Feature updates based on user feedback

---

## 17. CONCLUSION

The Electric Vehicle Charging Parameters Estimation Web Portal addresses a critical gap in the EV charging infrastructure ecosystem. By providing accurate charging time estimation, real-time station location, and seamless booking capabilities, this platform enhances the user experience and promotes EV adoption.

The integration of modern web technologies, efficient algorithms, and user-centric design ensures scalability, reliability, and accessibility. The system is designed to be:
- **Efficient**: Reduces search time for charging stations
- **Reliable**: Accurate time estimation based on parameters
- **User-Friendly**: Intuitive interface for all users
- **Scalable**: Can handle growth in users and stations

Future enhancements and continuous improvements will make this platform a comprehensive solution for the EV charging ecosystem.

---

## 18. REFERENCES

1. International Energy Agency (IEA) - Global EV Outlook 2024
2. EPA - Electric Vehicle Charging Standards
3. SAE Standards - J1772 Charging Connector Specifications
4. IEEE Standards on EV Charging Infrastructure
5. Google Maps API Documentation
6. MongoDB Official Documentation
7. React.js Official Documentation
8. Node.js Best Practices
9. OWASP Security Standards
10. Cloud Computing Best Practices

---

## APPENDIX

### A. Technology Stack Summary
- **Frontend**: React, Vite, Axios, Google Maps API
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Deployment**: Cloud services (AWS/Heroku)

### B. Installation Instructions
[Add your setup and installation guides here]

### C. API Documentation
[Add detailed API documentation here]

### D. Database Queries
[Add important database queries and indexes]

---

**Document Version**: 1.0  
**Last Updated**: January 16, 2026  
**Status**: Initial Draft
