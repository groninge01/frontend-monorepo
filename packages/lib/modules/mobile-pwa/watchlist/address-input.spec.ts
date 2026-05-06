import { describe, expect, test } from 'vitest'
import { parseWatchAccountInput } from './address-input'

const validAddress = '0xba100000625a3754423978a60c9317c58a424e3d'

describe('parseWatchAccountInput', () => {
  test('parses a valid address as a checksummed address result', () => {
    expect(parseWatchAccountInput(validAddress)).toEqual({
      type: 'address',
      address: '0xba100000625a3754423978a60c9317c58a424e3D',
    })
  })

  test('parses ENS names as ENS input', () => {
    expect(parseWatchAccountInput('  vitalik.eth  ')).toEqual({
      type: 'ens',
      name: 'vitalik.eth',
    })
  })

  test('rejects empty input', () => {
    expect(parseWatchAccountInput('')).toEqual({
      type: 'invalid',
      reason: 'empty',
    })
  })

  test('rejects malformed input', () => {
    expect(parseWatchAccountInput('not an address')).toEqual({
      type: 'invalid',
      reason: 'invalid-format',
    })
  })
})
