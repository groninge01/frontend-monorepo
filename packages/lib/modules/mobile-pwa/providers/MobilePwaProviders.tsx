import { PropsWithChildren } from 'react'
import { ApolloGlobalDataProvider } from '../../../shared/services/api/apollo-global-data.provider'
import { ApolloClientProvider } from '../../../shared/services/api/apollo-client-provider'
import { MobileClientProviders } from './MobileClientProviders'

export async function MobilePwaProviders({ children }: PropsWithChildren) {
  return (
    <ApolloClientProvider>
      <ApolloGlobalDataProvider>
        <MobileClientProviders>{children}</MobileClientProviders>
      </ApolloGlobalDataProvider>
    </ApolloClientProvider>
  )
}
