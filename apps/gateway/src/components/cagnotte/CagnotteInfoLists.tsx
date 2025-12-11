
import React from 'react';
import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
// import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
// import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
import {
  Icon,
  IconName,
  IconSize,
  IconPosition,
} from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { List, ListItem } from '@flex-design-system/react-ts/client-sync-styled-direct/list';
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

const CreerCagnotteList1 = () => {
  return (
    <>
      <Title level={TitleLevel.LEVEL7} className={flexStyles.hasTextFlexPurple}>Ce qui va se passer :</Title>
      <div style={{ marginTop: '1rem' }}>
        <Box className={classNames(flexStyles.isFlat, flexStyles.isFlatFlexPurple, flexStyles.hasTextLeft, flexStyles.hasTextFlexPurple)}>
          <List>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isAlignItemsBaseline,
                flexStyles.isJustifyContentStart,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <div className={classNames(
                  flexStyles.hasBackgroundFlexPurple, flexStyles.hasTextWhite,
                  flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter,
                  'rounded-full'
                )} style={{ height: '1.2rem', width: '1.2rem', position: 'relative', left: '6px', bottom: '1px' }}>
                <Text className={classNames(flexStyles.hasTextWeightExtrabold)}
                style={{ fontSize: '12.5px', position: 'relative', left: '-0.5px' }}>1</Text>
              </div>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Création de votre compte sur notre plateforme
              </Text>
              </div>
            </ListItem>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isAlignItemsBaseline,
                flexStyles.isJustifyContentStart,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <div className={classNames(
                  flexStyles.hasBackgroundFlexPurple, flexStyles.hasTextWhite,
                  flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter,
                  'rounded-full'
                )} style={{ height: '1.2rem', width: '1.2rem', position: 'relative', left: '6px', bottom: '1px' }}>
                <Text className={classNames(flexStyles.hasTextWeightExtrabold)}
                style={{ fontSize: '12.5px', position: 'relative', left: '0.25px' }}>2</Text>
              </div>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Redirection vers Stripe pour configurer votre compte bancaire
              </Text>
              </div>
            </ListItem>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isAlignItemsBaseline,
                flexStyles.isJustifyContentStart,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <div className={classNames(
                  flexStyles.hasBackgroundFlexPurple, flexStyles.hasTextWhite,
                  flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter,
                  'rounded-full'
                )} style={{ height: '1.2rem', width: '1.2rem', position: 'relative', left: '6px', bottom: '1px' }}>
                <Text className={classNames(flexStyles.hasTextWeightExtrabold)}
                style={{ fontSize: '12.5px', position: 'relative', left: '0.25px' }}>3</Text>
              </div>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Vérification de votre identité (rapide et sécurisée)
              </Text>
              </div>
            </ListItem>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isAlignItemsBaseline,
                flexStyles.isJustifyContentStart,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <div className={classNames(
                  flexStyles.hasBackgroundFlexPurple, flexStyles.hasTextWhite,
                  flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter,
                  'rounded-full'
                )} style={{ height: '1.2rem', width: '1.2rem', position: 'relative', left: '6px', bottom: '1px' }}>
                <Text className={classNames(flexStyles.hasTextWeightExtrabold)}
                style={{ fontSize: '12.5px', position: 'relative', left: '-0.5px' }}>4</Text>
              </div>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Retour sur notre site pour créer votre première cagnotte
              </Text>
              </div>
            </ListItem>
          </List>
        </Box>
      </div>
    </>
  );
}

const CreerCagnotteList2 = () => {
  return (
    <>
      <Title level={TitleLevel.LEVEL7} className={flexStyles.hasTextSecondary}>Cette configuration vous permettra de :</Title>
      <div style={{ marginTop: '1rem', marginBottom: '1rem'}}>
        <Box className={classNames(flexStyles.isFlat, flexStyles.isFlatSecondary, flexStyles.hasTextLeft, flexStyles.hasTextSecondary)}>
          <List>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <Icon name={IconName.UI_CHECK_CIRCLE_S} size={IconSize.SMALL} position={IconPosition.LEFT}/>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Recevoir les contributions directement sur votre compte bancaire
              </Text>
              </div>
            </ListItem>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <Icon name={IconName.UI_CHECK_CIRCLE_S} size={IconSize.SMALL} position={IconPosition.LEFT}/>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Créer et gérer des cagnottes
              </Text>
              </div>
            </ListItem>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <Icon name={IconName.UI_CHECK_CIRCLE_S} size={IconSize.SMALL} position={IconPosition.LEFT}/>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Suivre vos paiements en temps réel
              </Text>
              </div>
            </ListItem>
          </List>
        </Box>
      </div>
    </>
  );
}

const CreerCagnotteList3 = () => {
  return (
    <>
      <Title level={TitleLevel.LEVEL7} className={flexStyles.hasTextFlexGreen}>Stripe vous demandera de fournir:</Title>
      <div style={{ marginTop: '1rem', marginBottom: '1rem'}}>
        <Box className={classNames(flexStyles.isFlat, flexStyles.isFlatFlexGreen, flexStyles.hasTextLeft, flexStyles.hasTextFlexGreen)}>
          <List>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <Icon name={IconName.UI_CHECK_CIRCLE_S} size={IconSize.SMALL} position={IconPosition.LEFT}/>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Informations bancaires (IBAN)
              </Text>
              </div>
            </ListItem>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <Icon name={IconName.UI_CHECK_CIRCLE_S} size={IconSize.SMALL} position={IconPosition.LEFT}/>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Pièce d&apos;identité
              </Text>
              </div>
            </ListItem>
            <ListItem>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
                flexStyles.isFullwidth,
              )} style={{
                gridTemplateColumns: '40px 1fr',
              }}>
              <Icon name={IconName.UI_CHECK_CIRCLE_S} size={IconSize.SMALL} position={IconPosition.LEFT}/>
              <Text className={classNames(flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium)}
                style={{ marginTop: '0.25rem' }}>
                Informations personnelles
              </Text>
              </div>
            </ListItem>
          </List>
        </Box>
      </div>
    </>
  );
}

export { CreerCagnotteList1, CreerCagnotteList2, CreerCagnotteList3 }
