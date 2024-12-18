const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { specs, swaggerUi } = require('./config/swagger');
const cors = require('cors');
const authenticate = require('./middleware/authenticate');
const authorize = require('./middleware/authorize');
const authRoutes = require('./routes/auth');
const appointmentsRoutes = require('./routes/appointments');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const clinicRoutes = require('./routes/clinics');
const paymentRoutes = require('./routes/payments');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);

// wagger UI /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware authenticate
app.use(authenticate);

// Route test Middleware authorize
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/clinics', clinicRoutes);


app.use('/test1', authorize(['Patients']), (req, res) => res.json({ message: 'Test 1 for Patients', req: req.user }));
app.use('/test2', authorize(['Doctors']), (req, res) => res.json({ message: 'Test 2 for Doctors', req: req.user }));
app.use('/admin', authorize(['admin']), (req, res) => res.json({ message: 'Admin API' }));
app.get('/profile', (req, res) => {
    res.json({ username: req.user.username, role: req.user.role });
});

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
