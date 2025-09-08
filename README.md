# LoanPro - Modern Loan Management System

A comprehensive, user-friendly loan management system designed for pawn shops, lending businesses, and financial institutions. Built with Vue.js and Node.js, featuring a mobile-first responsive design.

## 🌟 Features

### 💰 Flexible Loan Types
- **Pawn Loans** - Traditional pawn shop loans with physical items as collateral
- **Title Loans** - Vehicle or property title-backed loans  
- **Check Rediscount** - Post-dated check-backed lending
- **Secured Loans** - General collateral-backed lending
- **Unsecured Loans** - No collateral required (higher risk)

### 📱 Modern UI/UX
- **Mobile-First Design** - Optimized for smartphones and tablets
- **Responsive Layout** - Works perfectly on all screen sizes
- **Intuitive Navigation** - Easy-to-use interface for non-technical users
- **Real-time Updates** - Live loan status and payment tracking
- **Dark/Light Mode** - User preference themes

### 👥 Customer Management
- Complete customer profiles with photo uploads
- Document management and attachment system
- Customer loan history and payment tracking
- Built-in communication tools

### 🔒 Security & Compliance
- Role-based access control (Admin/Staff/Customer)
- Secure authentication with JWT tokens
- Audit logging for all transactions
- GDPR-compliant data handling

### 📊 Analytics & Reports
- Real-time dashboard with key metrics
- Financial performance reports
- Overdue loan tracking and alerts
- Payment history and projections
- Export capabilities (PDF, Excel)

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- MySQL 8.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pawn_app
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Backend - create .env file
   cp .env.example .env
   
   # Edit .env with your database credentials
   DB_NAME=loan_management
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_HOST=localhost
   JWT_SECRET=your-secret-key
   ```

4. **Set up the database**
   ```bash
   cd backend
   
   # Run migrations
   npx sequelize-cli db:migrate
   
   # Seed initial data (optional)
   npx sequelize-cli db:seed:all
   ```

5. **Start the application**
   ```bash
   # Start backend server
   cd backend
   npm run start:dev
   
   # Start frontend development server
   cd ../frontend
   npm run serve
   ```

6. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

## 📚 User Guide

### Getting Started

#### For Administrators

1. **First Login**
   - Use default admin credentials or create your account
   - Complete your profile setup
   - Configure business settings

2. **Add Your First Customer**
   - Navigate to Customers → Add Customer
   - Fill in customer information
   - Upload ID documents and photos
   - Save customer profile

3. **Create Your First Loan**
   - Navigate to Loans → New Loan
   - Select customer from dropdown
   - Choose loan type (Pawn, Title, etc.)
   - Set loan amount and interest rate
   - Add collateral details
   - Review and create loan

4. **Managing Payments**
   - Track due dates on the dashboard
   - Process payments from loan details page
   - Handle extensions and modifications
   - Generate receipts and statements

### Loan Types Explained

#### 🏺 Pawn Loans
- **Use Case**: Traditional pawn shop operations
- **Collateral**: Physical items (jewelry, electronics, appliances)
- **Typical Terms**: 1-3 months, 3-5% monthly interest
- **Process**: Customer brings item → Appraisal → Loan issued → Item stored

#### 🚗 Title Loans  
- **Use Case**: Vehicle or property-backed loans
- **Collateral**: Vehicle registration, property titles
- **Typical Terms**: 3-12 months, 2-4% monthly interest
- **Process**: Title verification → Loan approval → Title held as security

#### 💳 Check Rediscount
- **Use Case**: Post-dated check financing
- **Collateral**: Customer's post-dated checks
- **Typical Terms**: 30-90 days, 3-6% monthly interest
- **Process**: Check verification → Loan issued → Check deposited on due date

#### 🔒 Secured Loans
- **Use Case**: General collateral-backed lending
- **Collateral**: Any valuable asset
- **Typical Terms**: Variable based on collateral
- **Process**: Asset appraisal → Risk assessment → Loan approval

#### 📋 Unsecured Loans
- **Use Case**: Trust-based lending to known customers
- **Collateral**: None required
- **Typical Terms**: 1-6 months, 5-8% monthly interest
- **Process**: Credit assessment → Customer history review → Approval

### Dashboard Overview

The dashboard provides at-a-glance information about your business:

- **Active Loans**: Current loans being serviced
- **Due Soon**: Loans approaching maturity (within 7 days)
- **Overdue**: Loans past their due date
- **Monthly Revenue**: Current month's interest and fee income
- **Recent Activity**: Latest loans and payments
- **Quick Actions**: Shortcuts to common tasks

### Mobile Usage

The app is optimized for mobile devices:

- **Bottom Navigation**: Easy thumb access to main sections
- **Swipe Gestures**: Navigate between loan cards
- **Touch-Friendly**: Large buttons and touch targets
- **Offline Capability**: View cached data without internet
- **Camera Integration**: Photo capture for documents

## 🛠️ Technical Architecture

### Frontend (Vue.js)
- **Framework**: Vue 3 with Composition API
- **Styling**: Bulma CSS framework with custom components
- **State Management**: Vuex for global state
- **Routing**: Vue Router with authentication guards
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite for fast development

### Backend (Node.js)
- **Framework**: Express.js with middleware
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT with bcrypt hashing
- **File Upload**: Multer for document handling
- **API Design**: RESTful with consistent error handling
- **Real-time**: Socket.IO for live updates

### Database Schema
```
Users (authentication)
├── Customers (client information)
│   ├── Loans (loan records)
│   │   ├── Collaterals (security items)
│   │   ├── Payments (transaction history)
│   │   └── Notes (loan annotations)
│   └── Attachments (documents/photos)
└── AuditLogs (system activity)
```

## 🔧 API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout

### Loan Management Endpoints
- `GET /loans` - List all loans with filtering
- `POST /loans` - Create new loan
- `GET /loans/:id` - Get loan details
- `PUT /loans/:id` - Update loan
- `DELETE /loans/:id` - Delete loan

### Customer Management Endpoints
- `GET /customers` - List customers
- `POST /customers` - Create customer
- `GET /customers/:id` - Get customer details
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Payment Processing Endpoints
- `GET /payments` - List payments
- `POST /payments` - Record payment
- `GET /payments/:id` - Get payment details
- `PUT /payments/:id` - Update payment

## 🔒 Security Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- Session management and timeout
- Password encryption with bcrypt
- Account lockout after failed attempts

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- File upload security
- CORS configuration

### Audit & Compliance
- Complete audit trail logging
- GDPR compliance features
- Data retention policies
- Secure file storage
- Regular security updates

## 📱 Mobile Features

### Progressive Web App (PWA)
- **Offline Capability**: Work without internet connection
- **App-like Experience**: Full-screen mobile app feel
- **Push Notifications**: Payment reminders and alerts
- **Home Screen Install**: Add to phone home screen
- **Background Sync**: Sync data when connection returns

### Mobile-Optimized Features
- **Camera Integration**: Photo capture for documents
- **Barcode Scanning**: Quick item identification
- **GPS Integration**: Location-based features
- **Touch Gestures**: Swipe navigation
- **Responsive Design**: Adapts to all screen sizes

## 🎨 Customization

### Theming
- Custom color schemes
- Logo and branding options
- Font customization
- Layout preferences
- White-label options

### Business Rules
- Configurable interest rates
- Custom loan terms
- Grace period settings
- Late fee calculations
- Business hours configuration

## 📊 Reports & Analytics

### Built-in Reports
- **Financial Performance**: Revenue, profit, loss reports
- **Loan Portfolio**: Active loans, risk analysis
- **Customer Analytics**: Customer behavior, retention
- **Operational Reports**: Staff performance, efficiency
- **Regulatory Reports**: Compliance and audit reports

### Export Options
- PDF reports with custom branding
- Excel spreadsheets for analysis
- CSV data for integration
- API endpoints for third-party tools
- Automated email reports

## 🔄 Data Migration

### Importing Existing Data
- Customer database import
- Loan history migration
- Payment record transfer
- Document file migration
- Settings and preferences

### Backup & Restore
- Automated daily backups
- One-click restore functionality
- Cloud backup integration
- Data export for migrations
- Disaster recovery procedures

## 🚀 Deployment Options

### Cloud Hosting
- **AWS**: EC2, RDS, S3 integration
- **Google Cloud**: App Engine, Cloud SQL
- **Azure**: App Service, SQL Database
- **DigitalOcean**: Droplets, Managed Databases
- **Heroku**: Easy one-click deployment

### Self-Hosted
- Docker containers for easy deployment
- Docker Compose for development
- Kubernetes for scalability
- Traditional server setup
- Local network installation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- ESLint configuration for consistent code style
- Prettier for automatic formatting
- Vue.js style guide compliance
- Comprehensive test coverage
- Documentation for new features

## 📞 Support

### Getting Help
- 📖 **Documentation**: Comprehensive guides and API docs
- 💬 **Community Forum**: Ask questions and share solutions
- 🐛 **Bug Reports**: GitHub issues for bug tracking
- 💡 **Feature Requests**: Suggest new features
- 📧 **Email Support**: Direct support for critical issues

### Professional Services
- Custom development and integration
- Training and onboarding
- Ongoing maintenance and support
- Data migration assistance
- Performance optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bulma CSS framework for beautiful responsive design
- Vue.js community for excellent documentation
- Node.js ecosystem for robust backend tools
- All contributors who help improve this project

---

## 🔮 Roadmap

### Version 2.0 (Upcoming)
- [ ] Multi-language support (Filipino, English, Spanish)
- [ ] Advanced analytics and AI insights
- [ ] Mobile app (iOS/Android native)
- [ ] Blockchain integration for security
- [ ] Advanced payment processing (credit cards, digital wallets)

### Version 2.1 (Future)
- [ ] Multi-branch support for growing businesses
- [ ] Advanced reporting with data visualization
- [ ] Integration with accounting software
- [ ] Automated marketing tools
- [ ] Advanced risk assessment algorithms

---

*Built with ❤️ for the lending and pawn shop community*