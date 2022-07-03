import CryptoJS from 'crypto-js';

export default class CryptoService {
  // Declare this key and iv values in declaration
  private key = CryptoJS.enc.Utf8.parse('service-jwt-jass');
  private iv = CryptoJS.enc.Utf8.parse('service-jwt-jass');

  // Methods for the encrypt and decrypt Using AES
  encryptUsingAES256(rawInput: any) {
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(rawInput)), this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decryptUsingAES256(encryptedString: string) {
    var decrypted = CryptoJS.AES.decrypt(encryptedString, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  }
}