# Testing Pool Detail Page Features

## Dev Server Setup

1. Copy env template: `cp apps/frontend-v3/.env.template apps/frontend-v3/.env.local`
2. Start dev server: `pnpm dev:bal` from repo root (runs on `http://localhost:3000`)
3. First compilation takes ~30-60 seconds. The server runs GraphQL codegen concurrently.

### Common Setup Issues

- **corepack/pnpm issues**: If `corepack enable` fails, install pnpm directly: `npm install -g pnpm@<version from packageManager field in package.json>`
- **GraphQL types missing**: If typecheck fails with missing generated types, run:
  ```bash
  cd packages/lib
  echo 'NEXT_PUBLIC_BALANCER_API_URL=https://api-v3.balancer.fi/graphql' > .env.local
  DOTENV_CONFIG_PATH=./.env.local pnpm graphql:gen
  ```
- **Port conflict**: If another dev server is already running, kill the existing process first.

## Pool Page URL Structure

Pool detail pages follow: `/pools/[chain-slug]/[variant]/[pool-id]`

Examples:
- `/pools/ethereum/v3/0x85b2b559bc2d21104c4defdd6efca8a20343361d`
- `/pools/ethereum/v2/0x5c6ee304399dbdb9c8ef030ab642b10820db8f56`

Chain slugs: `ethereum`, `arbitrum`, `polygon`, `gnosis`, `avalanche`, `base`, `optimism`, `zkevm`, `fraxtal`, `mode`, `sonic`

Variants: `v2`, `v3`, `cow`

## Finding Test Pools via API

Use the Balancer GraphQL API to find pools with specific characteristics:

```bash
curl -s 'https://api-v3.balancer.fi/graphql' \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ poolGetPools(first: 10, where: {chainIn: [MAINNET], poolTypeIn: [WEIGHTED, STABLE], minTvl: 100000}, orderBy: totalLiquidity, orderDirection: desc) { id chain type protocolVersion dynamicData { aprItems { type apr rewardTokenSymbol } } staking { id type gauge { id status } aura { auraPoolId apr } } } }"}'
```

Key APR item types:
- `STAKING` — staking incentives (BAL emissions, external rewards)
- `SWAP_FEE_24H` — swap fee APR
- `IB_YIELD` — interest-bearing token yield

Gauge statuses: `PREFERRED` (active), `KILLED` (deprecated)

## Testing "My Liquidity" Section

The "My Liquidity" section in `PoolDetail.tsx` only renders when `userHasLiquidity || hasPoolEvents` is true. Without a connected wallet with LP positions, it won't be visible.

### Workaround for Testing Without Wallet

Temporarily modify `packages/lib/modules/pool/PoolDetail/PoolDetail.tsx` to remove the conditional:

```tsx
// Change this:
{(userHasLiquidity || hasPoolEvents) && (
  <Stack ...>
    <PoolMyLiquidity />
    ...
  </Stack>
)}

// To this (TEMP ONLY):
<Stack ...>
  <PoolMyLiquidity />
  ...
</Stack>
```

**Always revert this change after testing.**

Note: Even with this workaround, buttons like Stake/Unstake will be disabled due to no wallet connection. But you can still verify:
- Button disabled/enabled visual state
- Tooltip content on hover
- Whether popovers appear or not
- Button variant styling (e.g., `disabled` vs `secondary`)

## Key Components

- `PoolDetail.tsx` — Main pool detail page layout
- `PoolMyLiquidity.tsx` — "My liquidity" section with tabs (Total, Unstaked, Staked, Aura)
- `StakeUnstakeButton.tsx` — Stake/Unstake buttons with popover logic
- `stake.helpers.ts` — Helper functions for staking logic (canStake, hasStakingIncentives, etc.)
- `useAprTooltip.ts` — APR tooltip logic including staking incentives display

## Devin Secrets Needed

No secrets required for basic testing — the public Balancer API (`https://api-v3.balancer.fi/graphql`) is used and doesn't require authentication. The `.env.template` has all needed values.

For full end-to-end testing with wallet interactions, a test wallet private key would be needed (not currently configured).
