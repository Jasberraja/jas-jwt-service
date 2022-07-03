import CryptoService from "./crypto.service";

export default class JwtExpiationService {
    cryptoService = new CryptoService()

    getExpiryTime(val: string): Date | null { // val - 2d | 3h | 30m
        if (val) {
            const op = val.charAt(val.length - 1); //  getting last letter - d | h | m
            const due = parseInt(val.slice(0, -1)); // getting due numbers

            const currentdate = new Date();
            let expiryDate: any = new Date(currentdate)

            switch (op) {
                case 'd':
                    expiryDate.setDate(currentdate.getDate() + due);
                    break;
                case 'h':
                    expiryDate.setHours(currentdate.getHours() + due);
                    break;
                case 'm':
                    expiryDate.setMinutes(currentdate.getMinutes() + due);
                    break;
                default:
                    expiryDate = null
                    break;
            }
            return expiryDate
        }
        return null
    }

    verifyExpiryTime(dateValue: Date): boolean {
        let isExpired: boolean = false
        const currentdate = new Date();
        const expiryDate = new Date(dateValue);
        if (expiryDate) {
            isExpired = !(currentdate < expiryDate)
        }
        return isExpired
    }
}