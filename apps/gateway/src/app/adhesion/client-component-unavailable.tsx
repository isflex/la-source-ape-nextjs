"use client";

import React from "react";
import { Box } from "@flex-design-system/react-ts/client-sync-styled-direct/box";
import { Section } from "@flex-design-system/react-ts/client-sync-styled-direct/section";
import {
  Title,
  TitleLevel,
} from "@flex-design-system/react-ts/client-sync-styled-direct/title";
import {
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
} from "@flex-design-system/react-ts/client-sync-styled-direct/info-block";
import { IconName } from "@flex-design-system/react-ts/client-sync-styled-direct/icon";
import { View } from "@flex-design-system/react-ts/client-sync-styled-direct/view";
import { default as stylesPage } from "@src/styles/scss/pages/adhesion.module.scss";

export default function AdhesionUnavailable() {
  return (
    <View>
      <div style={{ maxWidth: "920px", margin: "2rem auto" }}>
        <InfoBlock>
          <InfoBlockHeader
            status={InfoBlockStatus.INFO}
            customIcon={IconName.SHOOTING_STAR}
          >
            <Title level={TitleLevel.LEVEL2}>Adhésion APE La Source</Title>
          </InfoBlockHeader>
        </InfoBlock>
        <Box className={stylesPage.boxedCustomColor}>
          <Section>
            <InfoBlock>
              <InfoBlockHeader
                status={InfoBlockStatus.INFO}
                customIcon={IconName.UI_INFO_CIRCLE}
              >
                <Title level={TitleLevel.LEVEL4}>Bientôt disponible</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Title level={TitleLevel.LEVEL5}>
                  L&apos;adhésion en ligne sera prochainement disponible sur ce
                  site. Merci de votre patience.
                </Title>
              </InfoBlockContent>
            </InfoBlock>
          </Section>
        </Box>
      </div>
    </View>
  );
}
