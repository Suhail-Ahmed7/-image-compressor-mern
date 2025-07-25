const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const login = async (req, res) => {
    try {
        // Validate input
        const { error } = validateLogin(req.body);
        if (error) {
            const messages = error.details.map(err => err.message);
            return res.status(400).json({ errors: messages });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Compare hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = user.generateAuthToken();

        // Respond with token and user details
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
};

// Joi validation
function validateLogin(data) {
    const schema = Joi.object({
        email: Joi.string().required().email().messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address'
        }),
        password: Joi.string().required().messages({
            'string.empty': 'Password is required'
        })
    });

    return schema.validate(data, { abortEarly: false });
}

module.exports = login;
