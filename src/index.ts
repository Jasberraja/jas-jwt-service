import CryptoService from "./crypto.service";
import JwtExpiationService from "./jwt-expiration.service";

export default class JasJwtService {
    cryptoService = new CryptoService()
    jwtExpirationService = new JwtExpiationService()
    kvJoinKey: string = "kvjsjjs" // key value join key
    opJoinKey: string = "opjkjjs" // object property join key
    paramJoinKey: string = "pkjjs" // parameter join key

    // Function for generate Token
    createToken(privateObj: object, secretKey: string, jwtExpiration: string = ''): string {
        let resultToken = ""
        for (const [key, value] of Object.entries(privateObj)) {
            const encryptedKey = this.cryptoService.encryptUsingAES256(key)
            const encryptedValue = this.cryptoService.encryptUsingAES256(value)
            resultToken = resultToken + (resultToken ? this.opJoinKey : '') + encryptedKey + this.kvJoinKey + encryptedValue
        }
        const encryptedSecretKey = this.cryptoService.encryptUsingAES256(secretKey)
        resultToken = resultToken + this.paramJoinKey + encryptedSecretKey
        if (jwtExpiration) {
            // getting expiry time
            const expiryTime = this.jwtExpirationService.getExpiryTime(jwtExpiration)
            if (expiryTime) {
                const encryptedJwtExpiration = this.cryptoService.encryptUsingAES256(expiryTime)
                resultToken = resultToken + this.paramJoinKey + encryptedJwtExpiration
            }
        }
        return resultToken
    }

    // Function for verify token
    verifyToken(input: string) {
        let isExpired = false
        const resultObj: any = {}
        if (input.includes(this.paramJoinKey) && input.includes(this.opJoinKey) && input.includes(this.kvJoinKey)) {
            const splittedByParams = input.split(this.paramJoinKey)
            if (splittedByParams.length) {
                if (splittedByParams[2]) {
                    const decryptedExpiryTime = this.cryptoService.decryptUsingAES256(splittedByParams[2])
                    // Getting isExpired value
                    isExpired = this.jwtExpirationService.verifyExpiryTime(JSON.parse(decryptedExpiryTime))
                }
                const splittedByObjectProperties = splittedByParams[0].split(this.opJoinKey)
                // Checking isExpired
                if (!isExpired && splittedByObjectProperties.length) {
                    splittedByObjectProperties.forEach((property) => {
                        const splittedKeyValue = property.split(this.kvJoinKey)
                        const decryptedKey = this.cryptoService.decryptUsingAES256(splittedKeyValue[0])
                        const decryptedValue = this.cryptoService.decryptUsingAES256(splittedKeyValue[1])
                        resultObj[JSON.parse(decryptedKey)] = JSON.parse(decryptedValue)
                    })
                    const decryptedSecretKey = this.cryptoService.decryptUsingAES256(splittedByParams[1])
                    resultObj['secretKey'] = JSON.parse(decryptedSecretKey)
                    return resultObj
                }
                return null
            }
            return null
        }
        return null
    }

    // Function for extract token from request
    extractTokenFromRequest(requestObj: any) {
        const authorization = requestObj.headers.authorization || requestObj.headers.Authorization
        const splittedToken = authorization.split(' ')
        return splittedToken[1]
    }
}