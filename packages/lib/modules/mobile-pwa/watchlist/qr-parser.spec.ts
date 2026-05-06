import { describe, expect, test } from 'vitest'
import { parseQrAddressPayload } from './qr-parser'

const validAddress = '0xba100000625a3754423978a60c9317c58a424e3d'
const checksummedAddress = '0xba100000625a3754423978a60c9317c58a424e3D'

describe('parseQrAddressPayload', () => {
  test('parses a plain address payload', () => {
    expect(parseQrAddressPayload(validAddress)).toEqual({
      type: 'address',
      address: checksummedAddress,
    })
  })

  test('parses an ethereum address URI', () => {
    expect(parseQrAddressPayload(`ethereum:${validAddress}`)).toEqual({
      type: 'address',
      address: checksummedAddress,
    })
  })

  test('parses an ethereum address URI with a chain id', () => {
    expect(parseQrAddressPayload(`ethereum:${validAddress}@1`)).toEqual({
      type: 'address',
      address: checksummedAddress,
    })
  })

  test('parses ethereum pay URI addresses', () => {
    expect(parseQrAddressPayload(`ethereum:pay-${validAddress}`)).toEqual({
      type: 'address',
      address: checksummedAddress,
    })
  })

  test('parses ENS text payloads', () => {
    expect(parseQrAddressPayload('vitalik.eth')).toEqual({
      type: 'ens',
      name: 'vitalik.eth',
    })
  })

  test('rejects unsupported payloads', () => {
    expect(parseQrAddressPayload('https://example.com')).toEqual({
      type: 'invalid',
      reason: 'invalid-format',
    })
  })
})
