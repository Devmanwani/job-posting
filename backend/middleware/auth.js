const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findOne({ _id: decoded.id });

    if (!company) {
      throw new Error();
    }

    req.token = token;
    req.company = company;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};
