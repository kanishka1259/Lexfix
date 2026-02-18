const crypto = require("crypto");

exports.encryptData = (text) => {
    const cipher = crypto.createCipher("aes-256-cbc", "secretKey");
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

exports.featureFlags = {
    phasedRollout: true,
    newAccessibilityTheme: false
};
