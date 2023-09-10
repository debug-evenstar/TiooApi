const crypto = require("crypto");


class HashUtils {

    static encrypt = (plainText) => {
        try {
            // jwtString
            const iv = crypto.randomBytes(16);
            const key = crypto.createHash('sha256').update("secret123456").digest('base64').substr(0, 32);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encrypted = cipher.update(plainText);
            encrypted = Buffer.concat([encrypted, cipher.final()])
            return iv.toString('hex') + ':' + encrypted.toString('hex');
        } catch (error) {
            console.log(error);
        }
    }

    static decrypt = (encryptedText) => {
        try {
            const textParts = encryptedText.split(':');
            const iv = Buffer.from(textParts.shift(), 'hex');
            const encryptedData = Buffer.from(textParts.join(':'), 'hex');
            const key = crypto.createHash('sha256').update("secret123456").digest('base64').substr(0, 32);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

            const decrypted = decipher.update(encryptedData);
            const decryptedText = Buffer.concat([decrypted, decipher.final()]);
            return decryptedText.toString();
        } catch (error) {
            console.log(error)
        }
    }


    static generateRandomPassword(length) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]};:,<.>/?';
        let password = '';

        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        return password;
    }

    static encryptUser = (userdata, key) => {
        return jwt.sign({ userdata }, key, { expiresIn: "90d" });
    }

    static generateKeys(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz!#$&123456789@=';
        let randomString = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }

        return randomString;
    }

    static generateKeyPair() {
        return crypto.generateKeyPairSync('rsa', {
            modulusLength: 512, // Adjust the key length as needed
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
    }




}


module.exports = HashUtils;
