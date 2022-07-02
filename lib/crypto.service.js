"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
class CryptoService {
    constructor() {
        // Declare this key and iv values in declaration
        this.key = crypto_js_1.default.enc.Utf8.parse('service-jwt-jass');
        this.iv = crypto_js_1.default.enc.Utf8.parse('service-jwt-jass');
    }
    // Methods for the encrypt and decrypt Using AES
    encryptUsingAES256(rawInput) {
        var encrypted = crypto_js_1.default.AES.encrypt(crypto_js_1.default.enc.Utf8.parse(JSON.stringify(rawInput)), this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: crypto_js_1.default.mode.CBC,
            padding: crypto_js_1.default.pad.Pkcs7
        });
        return encrypted.toString();
    }
    decryptUsingAES256(encryptedString) {
        var decrypted = crypto_js_1.default.AES.decrypt(encryptedString, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: crypto_js_1.default.mode.CBC,
            padding: crypto_js_1.default.pad.Pkcs7
        });
        const decryptedData = decrypted.toString(crypto_js_1.default.enc.Utf8);
        return decryptedData;
    }
}
exports.CryptoService = CryptoService;
//# sourceMappingURL=crypto.service.js.map