const jwt = require('jsonwebtoken');

const adminAuth = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(" ")[1];

        console.log("Token received:", token);

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
        }

        // Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the email matches the admin credentials
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Forbidden: Not Authorized" });
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = adminAuth;
