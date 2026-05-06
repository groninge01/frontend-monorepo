import { PropsWithChildren } from 'react'
import { ApolloClientProvider } from '../../../shared/services/api/apollo-client-provider'
import { MobileClientProviders } from './MobileClientProviders'

export function MobilePwaProviders({ children }: PropsWithChildren) {
  return (
    <ApolloClientProvider>
      <MobileClientProviders>{children}</MobileClientProviders>
    </ApolloClientProvider>
  )
}
