const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const Landlord = require('../model/Landlord');

// Register a new user
exports.registerUser = async function (req, res) {
  try {
    // Extract user data from the request body
    const { email, password, firstname, lastname } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await User.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
    });

    res.json({ user, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering the user.' });
  }
};

// User login
exports.login = async function (req, res) {
  try {
    // Extract login credentials from the request body
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1d' });

    res.json({ user, token, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'An error occurred while logging in.' });
  }
};

// Fetch all landlords
exports.fetchLandlords = async function (req, res) {
  try {
    // Fetch all landlords from the database
    const landlords = await Landlord.find();

    res.json(landlords);
  } catch (error) {
    console.error('Error fetching landlords:', error);
    res.status(500).json({ error: 'An error occurred while fetching landlords.' });
  }
};


// const login = (req, res) => {
//     return {
//         email: req.body.email
//     }
// }
//
// module.exports = {
//     login
// }