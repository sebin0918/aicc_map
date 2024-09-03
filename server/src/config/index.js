require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

console.log("JWT Secret: ", jwtSecret); 

module.exports = {
    jwtSecret,
};
