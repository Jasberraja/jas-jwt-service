"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_service_1 = require("./crypto.service");
class JasJwtService {
    constructor() {
        this.cryptoService = new crypto_service_1.CryptoService();
        this.kvJoinKey = "kvjsjjs"; // key value join key
        this.opJoinKey = "opjkjjs"; // object property join key
        this.paramJoinKey = "pkjjs"; // parameter join key
    }
    createToken(privateObj, secretKey) {
        let resultToken = "";
        for (const [key, value] of Object.entries(privateObj)) {
            const encryptedKey = this.cryptoService.encryptUsingAES256(key);
            const encryptedValue = this.cryptoService.encryptUsingAES256(value);
            resultToken = resultToken + (resultToken ? this.opJoinKey : '') + encryptedKey + this.kvJoinKey + encryptedValue;
        }
        const encryptedSecretKey = this.cryptoService.encryptUsingAES256(secretKey);
        resultToken = resultToken + this.paramJoinKey + encryptedSecretKey;
        console.log(resultToken);
        return resultToken;
    }
    verifyToken(input) {
        const resultObj = {};
        if (input.includes(this.paramJoinKey) && input.includes(this.opJoinKey) && input.includes(this.kvJoinKey)) {
            const splittedByParams = input.split(this.paramJoinKey);
            if (splittedByParams.length) {
                const splittedByObjectProperties = splittedByParams[0].split(this.opJoinKey);
                if (splittedByObjectProperties.length) {
                    splittedByObjectProperties.forEach((property) => {
                        const splittedKeyValue = property.split(this.kvJoinKey);
                        const decryptedKey = this.cryptoService.decryptUsingAES256(splittedKeyValue[0]);
                        const decryptedValue = this.cryptoService.decryptUsingAES256(splittedKeyValue[1]);
                        resultObj[JSON.parse(decryptedKey)] = JSON.parse(decryptedValue);
                    });
                    const decryptedSecretKey = this.cryptoService.decryptUsingAES256(splittedByParams[1]);
                    resultObj['secretKey'] = JSON.parse(decryptedSecretKey);
                    return resultObj;
                }
                return null;
            }
            return null;
        }
        return null;
    }
    extractTokenFromRequest(requestObj) {
        const authorization = requestObj.headers.authorization || requestObj.headers.Authorization;
        const splittedToken = authorization.split(' ');
        return splittedToken[1];
    }
}
exports.default = JasJwtService;
//# sourceMappingURL=index.js.map