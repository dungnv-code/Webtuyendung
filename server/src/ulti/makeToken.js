const crypto = require("crypto");

function makeNumberToken(length = 10) {
    const digits = '0123456789';
    const bytes = crypto.randomBytes(length);
    let token = '';

    for (let i = 0; i < length; i++) {
        token += digits[bytes[i] % 10];
    }

    return token;
}

module.exports = makeNumberToken;