const { check } = require('express-validator');

exports.validateSignUpCredentials = [
  check('firstName')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('name can not be empty!')
    .bail()
    .isLength({min: 2})
    .withMessage('Minimum 2 characters required!')
    .bail(),
  check('lastName')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('name can not be empty!')
    .bail()
    .isLength({min: 2})
    .withMessage('Minimum 2 characters required!')
    .bail(),
  check('username')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Username can not be empty!')
    .bail()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!')
    .bail(),
  check('password')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Password cannot be empty!')
    .bail()
    .isLength({min: 3})
    .withMessage('Minimum 3 characters required!')
    .bail(),
];

exports.validateLoginCredentials = [
  check('username')
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage('User name can not be empty!')
  .bail()
  .isLength({min: 3})
  .withMessage('Minimum 3 characters required!')
  .bail(),
check('password')
  .trim()
  .escape()
  .not()
  .isEmpty()
  .withMessage('Password cannot be empty!')
  .bail()
  .isLength({min: 3})
  .withMessage('Minimum 3 characters required!')
  .bail(),
]