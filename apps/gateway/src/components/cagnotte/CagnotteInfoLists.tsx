
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

const ListNumber = ({number, bgColorClass}: {number: number, bgColorClass: string}) => {
  return (
    <div className={classNames(
      bgColorClass,
      flexStyles.hasTextWhite,
      flexStyles.isFlex, flexStyles.isAlignItemsCenter, flexStyles.isJustifyContentCenter,
      'rounded-full'
    )} style={{ height: '1.2rem', width: '1.2rem', position: 'relative', left: '6px', bottom: '1px', margin: '0.25em 0' }}>
      <Text className={classNames(flexStyles.hasTextWeightExtrabold)}
      style={{ fontSize: '12.5px', position: 'relative', left: '-0.5px' }}>{number}</Text>
    </div>
  )
}


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
              <ListNumber number={1} bgColorClass={classNames(flexStyles.hasBackgroundFlexPurple)} />
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
              <ListNumber number={2} bgColorClass={classNames(flexStyles.hasBackgroundFlexPurple)} />
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
              <ListNumber number={3} bgColorClass={classNames(flexStyles.hasBackgroundFlexPurple)} />
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
                Informations personnelles
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
          </List>
        </Box>
      </div>
    </>
  );
}

// Helper to determine step completion status based on currentlyDue requirements
type StepStatus = {
  personalInfoComplete: boolean;
  bankingInfoComplete: boolean;
  identityComplete: boolean;
};

function getStepStatus(
  currentlyDue: (string | null)[] | null | undefined,
  eventuallyDue: (string | null)[] | null | undefined,
  detailsSubmitted: boolean = false
): StepStatus {
  const currentRequirements = currentlyDue?.filter((req): req is string => req !== null) || [];
  const eventualRequirements = eventuallyDue?.filter((req): req is string => req !== null) || [];

  // If no requirements in either array
  if (currentRequirements.length === 0 && eventualRequirements.length === 0) {
    return {
      personalInfoComplete: true,
      bankingInfoComplete: true,
      identityComplete: detailsSubmitted,
    };
  }

  // Personal info complete: individual.email is NOT in currentlyDue
  // (email is removed once user enters Stripe onboarding and provides it)
  const hasEmailRequirement = currentRequirements.some(req => req.includes('individual.email'));

  // Banking complete: external_account is NOT in currentlyDue
  const hasBankingRequirement = currentRequirements.some(req => req.includes('external_account'));

  // Identity: check both arrays, and require detailsSubmitted
  const identityPatterns = ['verification.document', 'verification.additional_document'];
  const hasIdentityRequirements =
    currentRequirements.some(req => identityPatterns.some(pattern => req.includes(pattern))) ||
    eventualRequirements.some(req => identityPatterns.some(pattern => req.includes(pattern)));

  return {
    personalInfoComplete: !hasEmailRequirement,
    bankingInfoComplete: !hasBankingRequirement,
    identityComplete: !hasIdentityRequirements && detailsSubmitted,
  };
}

// Reusable step item component
const StepItem = ({
  stepNumber,
  isComplete,
  label,
  bgColorClass
}: {
  stepNumber: number;
  isComplete: boolean;
  label: string;
  bgColorClass: string;
}) => (
  <>
    {isComplete ? (
      <ListItem>
        <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
          flexStyles.isFullwidth,
        )} style={{
          gridTemplateColumns: '40px 1fr',
        }}>
          <Icon name={IconName.UI_CHECK_CIRCLE_S} size={IconSize.SMALL} position={IconPosition.LEFT}/>
          <Text className={classNames(
            flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium,
            isComplete && flexStyles.hasTextSuccess
          )} style={{ marginTop: '0.25rem' }}>
            {label}
          </Text>
        </div>
      </ListItem>
    ) : (
      <ListItem>
        <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
          flexStyles.isAlignItemsBaseline,
          flexStyles.isJustifyContentStart,
          flexStyles.isFullwidth,
        )} style={{
          gridTemplateColumns: '40px 1fr',
        }}>
          <ListNumber number={stepNumber} bgColorClass={bgColorClass} />
          <Text className={classNames(
            flexStyles.isInline, flexStyles.hasTextLeft, flexStyles.hasTextWeightMedium,
            isComplete && flexStyles.hasTextSuccess
          )} style={{ marginTop: '0.25rem' }}>
            {label}
          </Text>
        </div>
      </ListItem>
    )}
  </>
);

interface CreerCagnotteListStepsProps {
  currentlyDue?: (string | null)[] | null;
  eventuallyDue?: (string | null)[] | null;
  hasStartedOnboarding?: boolean;
  detailsSubmitted?: boolean;
  title?: string;
}

const CreerCagnotteListSteps = ({ currentlyDue, eventuallyDue, hasStartedOnboarding = false, detailsSubmitted = false, title }: CreerCagnotteListStepsProps) => {
  // If onboarding hasn't started yet, show all steps as pending
  // Otherwise, check both currentlyDue AND eventuallyDue to determine completion
  const stepStatus = hasStartedOnboarding
    ? getStepStatus(currentlyDue, eventuallyDue, detailsSubmitted)
    : { personalInfoComplete: false, bankingInfoComplete: false, identityComplete: false };

  // Determine the title based on completion status (3 states)
  const allComplete = hasStartedOnboarding && stepStatus.personalInfoComplete && stepStatus.bankingInfoComplete && stepStatus.identityComplete;
  const someComplete = hasStartedOnboarding && (stepStatus.personalInfoComplete || stepStatus.bankingInfoComplete);

  let displayTitle = title;
  if (!displayTitle) {
    if (allComplete) {
      displayTitle = 'Configuration terminée :';
    } else if (someComplete) {
      // Onboarding started and some steps done, but not all
      displayTitle = 'Stripe nécessite des informations supplémentaires :';
    } else {
      // Not started or no steps completed yet
      displayTitle = 'Stripe vous demandera de fournir :';
    }
  }

  return (
    <>
      <Title level={TitleLevel.LEVEL7} className={flexStyles.hasTextFlexGreen}>{displayTitle}</Title>
      <div style={{ marginTop: '1rem', marginBottom: '1rem'}}>
        <Box className={classNames(flexStyles.isFlat, flexStyles.isFlatFlexGreen, flexStyles.hasTextLeft, flexStyles.hasTextFlexGreen)}>
          <List>
            <StepItem
              stepNumber={1}
              isComplete={stepStatus.personalInfoComplete || stepStatus.bankingInfoComplete}
              label="Informations personnelles"
              bgColorClass={classNames(flexStyles.hasBackgroundFlexGreen)}
            />
            <StepItem
              stepNumber={2}
              isComplete={stepStatus.bankingInfoComplete}
              label="Informations bancaires (IBAN)"
              bgColorClass={classNames(flexStyles.hasBackgroundFlexGreen)}
            />
            <StepItem
              stepNumber={3}
              isComplete={stepStatus.identityComplete}
              label="Pièce d'identité"
              bgColorClass={classNames(flexStyles.hasBackgroundFlexGreen)}
            />
          </List>
        </Box>
      </div>
    </>
  );
};

export { CreerCagnotteList1, CreerCagnotteList2, CreerCagnotteList3, CreerCagnotteListSteps }
