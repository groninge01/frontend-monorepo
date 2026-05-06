'use client'

import { FormEvent, useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { parseWatchAccountInput } from '../watchlist/address-input'
import { useWatchlist } from '../watchlist/useWatchlist'

export function AddressEntry() {
  const { addAccount } = useWatchlist()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | undefined>()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = parseWatchAccountInput(input)

    if (result.type === 'invalid') {
      setError(
        result.reason === 'empty' ? 'Enter an address or ENS name.' : 'Invalid address or ENS name.'
      )
      return
    }

    if (result.type === 'ens') {
      setError('ENS resolution is not wired yet. Paste a 0x address for now.')
      return
    }

    addAccount({ address: result.address })
    setInput('')
    setError(undefined)
  }

  async function pasteFromClipboard() {
    const clipboardText = await navigator.clipboard?.readText()
    if (clipboardText) setInput(clipboardText)
  }

  return (
    <Card className="space-y-3 p-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-white">Watch an address</h2>
        <p className="text-sm text-slate-400">Enter an address or ENS name to load a dashboard.</p>
      </div>
      <form className="space-y-3" onSubmit={submit}>
        <Input
          autoCapitalize="none"
          autoComplete="off"
          onChange={event => setInput(event.target.value)}
          placeholder="0x... or name.eth"
          spellCheck={false}
          value={input}
        />
        {error ? <p className="text-sm text-red-200">{error}</p> : null}
        <div className="grid grid-cols-2 gap-2">
          <Button type="submit" variant="primary">
            Continue
          </Button>
          <Button onClick={pasteFromClipboard} type="button" variant="secondary">
            Paste
          </Button>
        </div>
      </form>
    </Card>
  )
}
