export class Validator {
  static validateDataLength(data: string[]) {
    if (data.length < 2) {
      return 'Invalid request format\n'
    }
  }

  static validateRequestId(requestId: string) {
    const requestIdIsValid = /^[a-z]{7}$/.test(requestId)
    if (!requestIdIsValid) {
      return 'Invalid request id format. It must be 7 lowercase letters a-z.\n'
    }
  }
}
