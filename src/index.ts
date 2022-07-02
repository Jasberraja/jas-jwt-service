import { CryptoService } from "./crypto.service";

export default class JasJwtService {
    cryptoService = new CryptoService()
    kvJoinKey: string = "kvjsjjs" // key value join key
    opJoinKey: string = "opjkjjs" // object property join key
    paramJoinKey: string = "pkjjs" // parameter join key

    createToken(privateObj: object, secretKey: string): string {
        let resultToken = ""
        for (const [key, value] of Object.entries(privateObj)) {
            const encryptedKey = this.cryptoService.encryptUsingAES256(key)
            const encryptedValue = this.cryptoService.encryptUsingAES256(value)
            resultToken = resultToken + (resultToken ? this.opJoinKey : '') + encryptedKey + this.kvJoinKey + encryptedValue
        }
        const encryptedSecretKey = this.cryptoService.encryptUsingAES256(secretKey)
        resultToken = resultToken + this.paramJoinKey + encryptedSecretKey
        console.log(resultToken);
        return resultToken
    }

    verifyToken(input: string) {
        const resultObj: any = {}
        if (input.includes(this.paramJoinKey) && input.includes(this.opJoinKey) && input.includes(this.kvJoinKey)) {

            const splittedByParams = input.split(this.paramJoinKey)
            if (splittedByParams.length) {
                const splittedByObjectProperties = splittedByParams[0].split(this.opJoinKey)
                if (splittedByObjectProperties.length) {
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

    extractTokenFromRequest(requestObj: any) {
        const authorization = requestObj.headers.authorization || requestObj.headers.Authorization
        const splittedToken = authorization.split(' ')
        return splittedToken[1]
    }
}