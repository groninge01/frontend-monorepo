import { parseWatchAccountInput } from './address-input'
import { WatchAccountInputResult } from './watchlist.types'

const ethereumAddressPayloadPattern =
  /^ethereum:(?:pay-)?(?<address>0x[a-fA-F0-9]{40})(?:@\d+)?(?:[/?#].*)?$/

export function parseQrAddressPayload(payload: string): WatchAccountInputResult {
  const trimmedPayload = payload.trim()
  const ethereumAddress = trimmedPayload.match(ethereumAddressPayloadPattern)?.groups?.address

  return parseWatchAccountInput(ethereumAddress || trimmedPayload)
}
