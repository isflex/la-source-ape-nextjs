"use client";

import React from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { PageAppProps } from "@root/types/additional";

import classNames from "classnames";
// import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
// import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import {
  InfoBlock,
  InfoBlockAction,
  // InfoBlockContent,
  // InfoBlockHeader,
  // InfoBlockStatus
} from "@flex-design-system/react-ts/client-sync-styled-direct/info-block";
import { default as flexStyles } from "@flex-design-system/framework";

const Home: NextPage<PageAppProps> = () => {
  return (
    <InfoBlock>
      {/*
      <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
        <Title level={TitleLevel.LEVEL3}>{`Contenu de la page à venir`}</Title>
      </InfoBlockHeader>
      <InfoBlockContent>
        <Title level={TitleLevel.LEVEL4}>{`... avec l'aide des élèves de la source en forme d'atelier pratique`}<br/>🤞</Title>
      </InfoBlockContent>
      */}
      <InfoBlockAction>
        <div
          className={classNames(
            flexStyles.isFullwidth,
            flexStyles.isFlex,
            flexStyles.isAlignItemsCenter,
            flexStyles.isJustifyContentSpaceEvenly,
          )}
          style={{ minWidth: "420px" }}
        >
          <Link
            href="/qui-sommes-nous"
            target="_blank"
            className={flexStyles.link}
          >
            Qui somme nous ?
          </Link>
          <Link href="/helloasso" target="_blank" className={flexStyles.link}>
            {/*
              {`${process.env.NEXT_PUBLIC_PARENT_ASSOCIATION} sur helloasso`}
            */}
            L&apos;APE sur helloasso
          </Link>
        </div>
      </InfoBlockAction>
    </InfoBlock>
  );
};

export default Home;
