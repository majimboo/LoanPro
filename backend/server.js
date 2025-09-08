const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*", // Allow all origins for now, refine in production
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Import Sequelize models
const db = require('./models'); // This will load index.js from models directory

// Import routes
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const pawnTicketRoutes = require('./routes/pawnTickets');
const pawnedItemRoutes = require('./routes/pawnedItems');
const paymentRoutes = require('./routes/payments');
const attachmentRoutes = require('./routes/attachments');
const noteRoutes = require('./routes/notes');
const auditLogRoutes = require('./routes/auditLogs');

// Import middleware
const { auth, authorizeRole } = require('./middleware/auth');

app.use(express.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads')); // ADD THIS LINE

// Use all routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/pawn-tickets', pawnTicketRoutes);
app.use('/api/pawned-items', pawnedItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/attachments', attachmentRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/audit-logs', auditLogRoutes);

db.sequelize.sync()
  .then(async () => {
    console.log("Database synced");

    // check if admin exists first
    const admin = await db.User.findOne({ where: { username: "admin" } });

    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin", 10);

      await db.User.create({
        username: "admin",
        password: hashedPassword,
        email: "admin@x.com",
        role: "ADMIN",
      });

      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }

    // check if sample customer user exists first
    const sampleUser = await db.User.findOne({ where: { username: "sid" } });

    if (!sampleUser) {
      const hashedPassword = await bcrypt.hash("boknoy", 10);

      // Create user account first
      const newUser = await db.User.create({
        username: "sid",
        password: hashedPassword,
        email: "sid@example.com",
        role: "CUSTOMER",
      });

      // Create customer profile linked to the user
      await db.Customer.create({
        user_id: newUser.id,
        first_name: "Isidro",
        last_name: "Jaleco Jr",
        phone: "09123456789",
        address: "Sample Address, City, Province",
      });

      console.log("Sample customer created");
    } else {
      console.log("Sample customer already exists");
    }
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });


// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Example: Emit dashboard updates
    // In a real app, these would be triggered by data changes
    setInterval(() => {
        socket.emit('dashboardUpdate', { message: 'Dashboard data updated', timestamp: new Date() });
    }, 5000);
});

// Protected route example
app.get('/api/protected', auth, (req, res) => {
    res.json({ message: `Welcome ${req.user.email}, you have access to protected data!` });
});

// Admin protected route example
app.get('/api/admin', auth, authorizeRole(['ADMIN']), (req, res) => {
    res.json({ message: `Welcome Admin ${req.user.email}, you have access to admin data!` });
});

// Dashboard metrics endpoint
app.get('/api/dashboard/metrics', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        // Mock dashboard data - replace with actual queries
        const metrics = {
            totalCustomers: 150,
            activeLoans: 45,
            overdueLoans: 8,
            totalRevenue: 125000,
            recentActivity: [
                { id: 1, type: 'loan_created', description: 'New loan created for John Doe', timestamp: new Date() },
                { id: 2, type: 'payment_received', description: 'Payment received from Jane Smith', timestamp: new Date() }
            ]
        };
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
});

// Loans endpoint  
app.get('/api/loans', auth, authorizeRole(['ADMIN']), async (req, res) => {
    try {
        // Mock loan data - replace with actual queries
        const loans = [
            {
                id: 1,
                loan_number: 'LN-2024-001',
                customer: { first_name: 'John', last_name: 'Doe', phone: '09123456789' },
                loan_type: 'PAWN',
                principal_amount: 10000,
                outstanding_principal: 8500,
                maturity_date: '2024-12-31',
                status: 'ACTIVE',
                created_at: new Date()
            },
            {
                id: 2,
                loan_number: 'LN-2024-002',
                customer: { first_name: 'Jane', last_name: 'Smith', phone: '09987654321' },
                loan_type: 'TITLE',
                principal_amount: 25000,
                outstanding_principal: 22000,
                maturity_date: '2024-11-15',
                status: 'DUE_SOON',
                created_at: new Date()
            }
        ];
        res.json(loans);
    } catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({ error: 'Failed to fetch loans' });
    }
});

app.get('/', (req, res) => {
    res.send('Pawnshop Management App Backend is running!');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});