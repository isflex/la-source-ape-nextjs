import Link from 'next/link';

import classNames from 'classnames';
// import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
// import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
// import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
// import { Section } from '@flex-design-system/react-ts/client-sync-styled-direct/section';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
// import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
// import {
//   InfoBlock,
//   InfoBlockContent,
//   InfoBlockHeader,
//   InfoBlockStatus
// } from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
// import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
// import { Sticker } from '@flex-design-system/react-ts/client-sync-styled-direct/sticker';
import { default as flexStyles } from '@flex-design-system/framework';
import React from 'react';

interface CagnotteModalProps {
  toggleModal: () => void
}

const CagnotteModal: React.FC<CagnotteModalProps> = ({ toggleModal }) => {
  return (
    <div className={classNames(
        flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
        flexStyles.isGridCols1,
        flexStyles.isAlignItemsCenter,
        flexStyles.isJustifyContentSpaceBetween,
        flexStyles.isFullwidth,
      )}>

      <Title level={TitleLevel.LEVEL2} className={classNames(
          flexStyles.isMarginless,
        )}>
        🎁 Cagnotte
      </Title>
      <Text>
        Collectez facilement des contributions pour offrir un cadeau collectif
        à l&apos;enseignant(e) de votre enfant, un projet de classe...
      </Text>

      <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
          flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
          flexStyles.isAlignItemsStretch,
          flexStyles.isJustifyContentSpaceBetween,
          flexStyles.isFullwidth,
        )}>
        <Link
          href="/cagnotte/creer"
          className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-colors border-2 border-transparent hover:border-indigo-200"
        >
          <div className={classNames(
              flexStyles.isGridDisplayGrid,
              flexStyles.isGridCols1,
              flexStyles.isAlignItemsCenter,
              flexStyles.isJustifyContentCenter,
              flexStyles.isFullheight,
            )}>
            <Title level={TitleLevel.LEVEL3} className={classNames(flexStyles.isMarginless)}>
              👩‍🏫
            </Title>
            <Title level={TitleLevel.LEVEL4}>
              Je suis délégué(e) de classe
            </Title>
            <Text>
              Créez une cagnotte et partagez le lien avec les parents.
            </Text>
          </div>
        </Link>

        <div
          onClick={() => toggleModal()}
          className="p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl hover:from-pink-100 hover:to-orange-100 transition-colors border-2 border-transparent hover:border-pink-200"
        >
          <div className={classNames(
              flexStyles.isGridDisplayGrid,
              flexStyles.isGridCols1,
              flexStyles.isAlignItemsCenter,
              flexStyles.isJustifyContentCenter,
              flexStyles.isFullheight,
            )}>
            <Title level={TitleLevel.LEVEL3} className={classNames(flexStyles.isMarginless)}>
              👨‍👩‍👧
            </Title>
            <Title level={TitleLevel.LEVEL4}>
              Je suis parent
            </Title>
            <Text>
              Participez à une cagnotte existante avec une contribution.
            </Text>
          </div>
        </div>
      </div>

      <div className={classNames(
        flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
        flexStyles.isGridCols1,
        flexStyles.isAlignItemsCenter,
        flexStyles.isJustifyContentSpaceBetween,
        flexStyles.isFullwidth,
      )} style={{ marginTop: '1rem' }}>
        <Title level={TitleLevel.LEVEL3} className={classNames(flexStyles.isMarginless, flexStyles.hasTextLeft)}>Comment ça marche ?</Title>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>
              Le délégué crée un compte et configure son IBAN via Stripe
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>
              Il crée une cagnotte et partage le lien avec les parents
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>
              Les parents contribuent par carte bancaire
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              4
            </span>
            <span>
              Le délégué clôture la cagnotte et reçoit les fonds sur son compte
            </span>
          </li>
        </ol>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>Paiements sécurisés par Stripe • L'APE couvre les charges • 0% de frais pour les donateurs</p>
      </div>
    </div>
  );
}

export default CagnotteModal
