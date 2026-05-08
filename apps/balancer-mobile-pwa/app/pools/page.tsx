import { ComingSoonScreen } from '@repo/lib/modules/mobile-pwa/screens/ComingSoonScreen'
import { MobileHomePreview } from '@repo/lib/modules/mobile-pwa/screens/MobileHome'

export default function Page() {
  return (
    <ComingSoonScreen
      activeTab="pools"
      previousHref="/"
      previousPreview={<MobileHomePreview />}
    />
  )
}
