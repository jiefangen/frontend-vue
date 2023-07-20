import CryptoJS from 'crypto-js'

const aesKey = 'd09c3b976a8a757264a191fcbe5d556fce84c3367e9fb81d53a649f5da420fa5'

export function encryptAES(rawtext) {
  return CryptoJS.AES.encrypt(rawtext, aesKey).toString()
}

export function decryptAES(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, aesKey)
  return bytes.toString(CryptoJS.enc.Utf8)
}
