import { CryptoService } from "./crypto.service";
export default class JasJwtService {
    cryptoService: CryptoService;
    kvJoinKey: string;
    opJoinKey: string;
    paramJoinKey: string;
    createToken(privateObj: object, secretKey: string): string;
    verifyToken(input: string): any;
    extractTokenFromRequest(requestObj: any): any;
}
//# sourceMappingURL=index.d.ts.map