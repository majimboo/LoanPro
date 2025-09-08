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
        // Get actual counts from database
        const [
            totalCustomersCount,
            activeLoansCount,
            overdueLoansCount,
            monthlyPayments
        ] = await Promise.all([
            db.Customer.count(),
            db.Loan.count({ where: { status: 'ACTIVE' } }),
            db.Loan.count({ where: { status: 'OVERDUE' } }),
            db.Payment.sum('amount_paid', {
                where: {
                    payment_date: {
                        [db.Sequelize.Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            })
        ]);

        // Calculate total active loan amounts
        const activeLoans = await db.Loan.findAll({ 
            where: { status: 'ACTIVE' },
            attributes: ['principal_amount']
        });
        
        const overdueLoans = await db.Loan.findAll({ 
            where: { status: 'OVERDUE' },
            attributes: ['outstanding_principal']
        });

        const activeTotalAmount = activeLoans.reduce((sum, loan) => 
            sum + parseFloat(loan.principal_amount || 0), 0);
        
        const overdueTotalAmount = overdueLoans.reduce((sum, loan) => 
            sum + parseFloat(loan.outstanding_principal || 0), 0);

        // Count new customers this month
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const newCustomersThisMonth = await db.Customer.count({
            where: {
                created_at: { [db.Sequelize.Op.gte]: startOfMonth }
            }
        });

        const metrics = {
            activeLoans: { 
                count: activeLoansCount, 
                totalAmount: activeTotalAmount,
                trend: 12 // Mock trend for now
            },
            overdueLoans: { 
                count: overdueLoansCount, 
                totalAmount: overdueTotalAmount 
            },
            totalCustomers: { 
                count: totalCustomersCount,
                newThisMonth: newCustomersThisMonth
            },
            monthlyRevenue: { 
                amount: parseFloat(monthlyPayments || 0)
            }
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
        const { limit = 10, sort = 'created_at:desc', filter } = req.query;
        
        let whereClause = {};
        let order = [['created_at', 'DESC']];
        
        // Handle sorting
        if (sort) {
            const [field, direction] = sort.split(':');
            order = [[field, direction.toUpperCase()]];
        }
        
        // Handle filters
        if (filter === 'due-soon') {
            // Get loans due within the next 7 days
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
            
            whereClause = {
                status: 'ACTIVE',
                maturity_date: {
                    [db.Sequelize.Op.between]: [new Date(), sevenDaysFromNow]
                }
            };
        }
        
        const loans = await db.Loan.findAll({
            where: whereClause,
            include: [{
                model: db.Customer,
                as: 'customer',
                attributes: ['first_name', 'last_name', 'phone']
            }],
            order: order,
            limit: parseInt(limit),
            attributes: [
                'id', 'loan_number', 'principal_amount', 'outstanding_principal',
                'maturity_date', 'status', 'created_at', 'interest_rate'
            ]
        });

        // Transform data to match frontend expectations
        const transformedLoans = loans.map(loan => ({
            id: loan.id,
            loan_number: loan.loan_number,
            customer: loan.customer ? {
                first_name: loan.customer.first_name,
                last_name: loan.customer.last_name,
                phone: loan.customer.phone
            } : null,
            loan_type: loan.loan_type,
            principal_amount: loan.principal_amount,
            outstanding_principal: loan.outstanding_principal,
            maturity_date: loan.maturity_date,
            status: loan.status,
            interest_rate: loan.interest_rate,
            created_at: loan.created_at
        }));

        res.json(transformedLoans);
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