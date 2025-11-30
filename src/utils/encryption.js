// src/utils/encryption.js
import CryptoJS from 'crypto-js';

// This function encrypts data into a string
export const encryptData = (data, secretKey) => {
    try {
        // Convert object to string if necessary
        const stringData = JSON.stringify(data);
        return CryptoJS.AES.encrypt(stringData, secretKey).toString();
    } catch (error) {
        console.error("Encryption Failed:", error);
        return null;
    }
};

// This function decrypts the string back into data
export const decryptData = (ciphertext, secretKey) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedString);
    } catch (error) {
        // This usually happens if the key is wrong
        console.error("Decryption Failed (Wrong Key?):", error);
        return null;
    }
};