import { ComingSoonScreen } from "@repo/lib/modules/mobile-pwa/screens/ComingSoonScreen";
import { ViewTransition } from "react";

export default function Page() {
  return (
    <ViewTransition
      default="none"
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
    >
      <ComingSoonScreen activeTab="pools" />
    </ViewTransition>
  );
}
