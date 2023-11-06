const CryptoJS = require('crypto-js');

const id = 'user_id';
const pw = 'user_password';
const secretKey = '0123456789abcdef0123456789abcdef'; // key

const encryptedId = CryptoJS.AES.encrypt(id, secretKey).toString();
const encryptedPw = CryptoJS.AES.encrypt(pw, secretKey).toString();

// send encrypt id&pw to the server
const url = `/login?encId=${encryptedId}&encPw=${encryptedPw}`;
fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
});