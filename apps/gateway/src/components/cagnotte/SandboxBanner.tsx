"use client";

import {
  InfoBlock,
  InfoBlockHeader,
  InfoBlockStatus,
} from "@flex-design-system/react-ts/client-sync-styled-direct/info-block";
import { IconName } from "@flex-design-system/react-ts/client-sync-styled-direct/icon";
import {
  Title,
  TitleLevel,
} from "@flex-design-system/react-ts/client-sync-styled-direct/title";

import { useSandboxMode } from "./SandboxModeContext";

/**
 * Persistent warning shown on cagnotte pages when the active Stripe secret key
 * is a test key (see `isStripeTestMode` in `@src/lib/secrets`). Signals that
 * payments are running against the Stripe sandbox, not live.
 *
 * Reads the server-computed flag from `SandboxModeContext` and renders nothing
 * outside sandbox, so it is safe to drop in anywhere (e.g. below `AuthBanner`).
 */
export default function SandboxBanner() {
  if (!useSandboxMode()) return null;

  return (
    <div style={{ fontSize: "x-small" }}>
      <InfoBlock>
        <InfoBlockHeader
          status={InfoBlockStatus.WARNING}
          customIcon={IconName.UI_INFO_CIRCLE}
        >
          <Title level={TitleLevel.LEVEL4}>
            Environnement de test (sandbox)
          </Title>
        </InfoBlockHeader>
      </InfoBlock>
    </div>
  );
}
