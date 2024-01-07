const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid Email'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

router.post('/', validateSignup, async (req, res, next) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

        let existingUser = await User.findOne({
          where: {
            email
          }
        })

          if (existingUser) {
            return res.status(500).json({
              "message": "User already exists",
              "errors": {
                "email": "User with that email already exists"
              }
            })
          }

        existingUser = await User.findOne({
          where: {
            username
          }
        })

          if (existingUser) {
            res.statusCode = 500
            return res.json({
              "message": "User already exists",
              "errors": {
                "email": "User with that username already exists"
              }
            })
          }

      const user = await User.create({ email, username, hashedPassword, firstName, lastName });
  
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );
  

module.exports = router;