const bcrypt = require('bcryptjs');
const { User, validate } = require('../models/user');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        // Validate request body with Joi
        const { error } = validate(req.body);
        if (error) {
            const msg = error.details[0].message.includes('password')
                ? 'Please use a stronger password.'
                : error.details[0].message;
            return res.status(400).json({ error: msg });
        }
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Generate JWT token
        const token = newUser.generateAuthToken();

        // Send response with token and user info
        res
            .status(201)
            .header('Authorization', token)
            .json({
                message: 'Signup successful',
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email
                },
                token
            });

    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }
};

module.exports = signup;
