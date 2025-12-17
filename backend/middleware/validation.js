// Input validation middleware

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    // Remove potential XSS characters
    return str.trim().replace(/[<>]/g, '');
};

// Validation middleware for registration
const validateRegistration = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    } else if (!validateEmail(email)) {
        errors.push('Invalid email format');
    }

    if (!password) {
        errors.push('Password is required');
    } else if (!validatePassword(password)) {
        errors.push('Password must be at least 6 characters long');
    }

    if (!firstName || firstName.trim().length === 0) {
        errors.push('First name is required');
    }

    if (!lastName || lastName.trim().length === 0) {
        errors.push('Last name is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false, 
            msg: errors.join(', '),
            errors 
        });
    }

    // Sanitize inputs
    req.body.email = sanitizeString(email.toLowerCase());
    req.body.firstName = sanitizeString(firstName);
    req.body.lastName = sanitizeString(lastName);
    if (req.body.class) {
        req.body.class = sanitizeString(req.body.class);
    }

    next();
};

// Validation middleware for login
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) {
        errors.push('Email is required');
    } else if (!validateEmail(email)) {
        errors.push('Invalid email format');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false, 
            msg: errors.join(', '),
            errors 
        });
    }

    // Sanitize email
    req.body.email = sanitizeString(email.toLowerCase());

    next();
};

// General sanitization middleware for text inputs
const sanitizeInputs = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeString(req.body[key]);
            }
        });
    }
    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    sanitizeInputs,
    sanitizeString
};

