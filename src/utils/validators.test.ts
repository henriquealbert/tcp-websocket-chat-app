import { describe, expect, test } from 'vitest'
import { Validator } from './validators'

describe('Validator', () => {
  test('validateDataLength should return error message if data length is less than 2', () => {
    const data = ['item1']
    const result = Validator.validateDataLength(data)
    expect(result).toBe('Invalid request format\n')
  })

  test('validateDataLength should return undefined if data length is not less than 2', () => {
    const data = ['item1', 'item2']
    const result = Validator.validateDataLength(data)
    expect(result).toBeUndefined()
  })

  test('validateRequestId should return error message if requestId does not match regex', () => {
    const requestId = 'request123232'
    const result = Validator.validateRequestId(requestId)
    expect(result).toBe('Invalid request id format. It must be 7 lowercase letters a-z.\n')
  })

  test('validateRequestId should return undefined if requestId matches regex', () => {
    const requestId = 'request'
    const result = Validator.validateRequestId(requestId)
    expect(result).toBeUndefined()
  })
})
