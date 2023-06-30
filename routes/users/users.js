var express = require('express');
var router = express.Router();
var usersController = require('./controller/usersController');
var { verifyToken } = require('../../middleware/authorization');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login-test', function(req, res) {
  console.log(req.body);
  res.send({
    email: req.body.email
  });
});

router.post('/login', usersController.login);

// Add a route for user registration
router.post('/register', usersController.register);

// Add a route for getting the About Us page
router.get('/about-us', function(req, res) {
  // Define the About Us page content
  const aboutUsData = {
    welcomeMessage: "Welcome to our platform!",
    description: "We are dedicated to providing a reliable and user-friendly solution for our users. Our mission is to simplify [platform's purpose] and make it accessible to everyone.",
    mission: "At [platform name], we believe in [core belief or value]. We strive to [unique selling point 1] and [unique selling point 2].",
    team: [
      { name: "John Doe", role: "Founder & CEO" },
      { name: "Jane Smith", role: "Head of Operations" }
    ],
    privacyMessage: "We value your trust and are dedicated to ensuring the security and privacy of your information. Feel free to explore our platform and experience the benefits of [platform name]."
  };

  // Return the About Us page content as JSON
  res.json(aboutUsData);
});

// Add a route for the User Dashboard page
router.get('/dashboard', verifyToken, function(req, res) {
  // Return the User Dashboard page content
  res.send('User Dashboard');
});

// Route for token auth
router.post('/authtoken', verifyToken, usersController.authtoken);

// Route for deleting the user
router.post('/delete-user', verifyToken, usersController.deleteUser);

// Add routes for other pages
router.get('/search', function(req, res) {
  // Return the Search page content
  res.send('Search');
});

router.get('/reviews', function(req, res) {
  // Return the Reviews page content
  res.send('Reviews');
});

router.get('/contact-us', function(req, res) {
  // Define the Contact Us page content
  const contactUsData = {
    heading: "Contact Us",
    email: "contact@example.com",
    phone: "123-456-7890"
    // Add any additional fields as needed
  };

  // Return the Contact Us page content as JSON
  res.json(contactUsData);
});

router.get('/blog', function(req, res) {
  // Return the Blog page content
  res.send('Blog');
});

router.get('/landlord-landlord/:Id/*', function(req, res) {
  // Return the Landlord Listings page content
  res.send(`Landlord Listings ${req.params.Id}`);
});

// Create an Express app and mount the router
var app = express();
app.use('/users', router);

// Start the server
app.listen(4000, function() {
  console.log('Server is running on port 4000');
});

module.exports = router;



/*Backend Routes:

Users listing: http://localhost:4000/users
Testing login: http://localhost:4000/users/login-test
User login (POST request): http://localhost:4000/users/login
User registration (POST request): http://localhost:4000/users/register
About Us page: http://localhost:4000/users/about-us
User Dashboard page (Requires token verification): http://localhost:4000/users/dashboard
Token authentication (POST request): http://localhost:4000/users/authtoken
Delete user (POST request): http://localhost:4000/users/delete-user
Search page: http://localhost:4000/users/search
Reviews page: http://localhost:4000/users/reviews
Contact Us page: http://localhost:4000/users/contact-us
Blog page: http://localhost:4000/users/blog
Landlord Listings page: http://localhost:4000/landlord-landlord/:Id/ (Replace :Id with the actual ID)
Frontend Routes:

Home page: http://localhost:4000/users
Login page: http://localhost:4000/users/login
Registration page: http://localhost:4000/users/register
About Us page: http://localhost:4000/users/about-us
Search page: http://localhost:4000/users/search
Reviews page: http://localhost:4000/users/reviews
Contact Us page: http://localhost:4000/users/contact-us
Blog page: http://localhost:4000/users/blog
Landlord Listings page for a specific landlord: http://localhost:4000/landlord-landlordId/ (Replace landlordId with the actual ID)*/