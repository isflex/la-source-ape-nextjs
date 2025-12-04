'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticator } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Input, type InputChangeEvent } from '@flex-design-system/react-ts/client-sync-styled-direct/input';
import { Textarea, type TextareaChangeEvent } from '@flex-design-system/react-ts/client-sync-styled-direct/textarea';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Switch, type SwitchChangeEvent } from '@flex-design-system/react-ts/client-sync-styled-direct/switch';
import { AlertState, VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import {
  ContributionSchema,
  MIN_CONTRIBUTION_AMOUNT,
  MAX_CONTRIBUTION_AMOUNT,
  formatCurrency
} from '@src/lib/cagnotte-helpers';
import { FeeBreakdown } from './FeeBreakdown';
import type { FeeConfig } from '@src/lib/cagnotte-fees';

interface StripeCheckoutButtonProps {
  jackpotFormId: string;
  jackpotTitle: string;
  teacherName: string;
  feeConfig: FeeConfig; // Fee configuration from jackpot
  sepaAllowed?: boolean; // Whether SEPA payments are allowed
  onError: (message: string) => void;
}

export default function StripeCheckoutButton({
  jackpotFormId,
  teacherName,
  feeConfig,
  onError
}: StripeCheckoutButtonProps) {
  const router = useRouter();
  const { user } = useAuthenticator();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [contributorName, setContributorName] = useState('');
  const [contributorEmail, setContributorEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [contributorMessage, setContributorMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAmount, setShowAmount] = useState(true);
  const [coverFees, setCoverFees] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paymentMethodType, setPaymentMethodType] = useState<'CARD' | 'SEPA'>('CARD');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod (coerce will handle string-to-number conversion)
    const validation = ContributionSchema.safeParse({
      contributorName,
      contributorEmail,
      amount, // Pass string directly, Zod will coerce to number
      contributorMessage,
      isAnonymous,
      showAmount
    });

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      // Call API route to create Stripe Checkout Session
      const response = await fetch('/api/cagnotte/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jackpotFormId,
          contributorName,
          contributorEmail,
          amount: parseFloat(amount),
          contributorMessage: contributorMessage || undefined,
          isAnonymous,
          showAmount,
          owner: user?.userId || null,
          coverFees,
          paymentMethodType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      onError(error instanceof Error ? error.message : 'Erreur lors de la création de la session de paiement');
      setLoading(false);
    }
  };

  // Require authentication
  if (!user) {
    return (
      <InfoBlock>
        <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
          <Title level={TitleLevel.LEVEL3}>Connexion requise</Title>
        </InfoBlockHeader>
        <InfoBlockContent>
          <Text style={{ marginBottom: '1rem' }}>
            Vous devez être connecté pour contribuer à cette cagnotte.
          </Text>
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.PRIMARY}
            onClick={() => {
              const returnUrl = encodeURIComponent(window.location.pathname);
              router.push(`/auth/?mode=user&returnUrl=${returnUrl}`);
            }}
          >
            Se connecter
          </Button>
        </InfoBlockContent>
      </InfoBlock>
    );
  }

  if (!showForm) {
    return (
      <Button
        markup={ButtonMarkup.BUTTON}
        variant={VariantState.PRIMARY}
        onClick={() => setShowForm(true)}
        className={classNames(flexStyles.isLarge)}
      >
        💰 Contribuer à cette cagnotte
      </Button>
    );
  }

  return (
    <Box>
      <Title level={TitleLevel.LEVEL3}>Contribuer à la cagnotte</Title>
      <Text style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        Remplissez le formulaire ci-dessous pour contribuer à la cagnotte pour {teacherName}.
      </Text>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <Text><strong>Votre email *</strong></Text>
            <Input
              type="email"
              value={contributorEmail}
              onChange={(e: InputChangeEvent) => setContributorEmail(e.inputValue)}
              placeholder="Ex: marie.martin@example.com"
              className={classNames(flexStyles.isFullwidth, errors.contributorEmail && flexStyles.isDanger)}
              disabled={loading}
            />
            <Text style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Pour recevoir la confirmation de paiement
            </Text>
            {errors.contributorEmail && (
              <Text className={flexStyles.hasTextDanger}>{errors.contributorEmail}</Text>
            )}
          </label>
        </div>

        <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
          flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
          flexStyles.isGridItemsStart,
          flexStyles.isFullheight,
          flexStyles.isFullwidth,
        )}>
          {/* Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label>
              <Text><strong>Votre nom *</strong></Text>
              <Input
                type="text"
                value={contributorName}
                onChange={(e: InputChangeEvent) => setContributorName(e.inputValue)}
                placeholder="Ex: Marie Martin"
                className={classNames(flexStyles.isFullwidth, errors.contributorName && flexStyles.isDanger)}
                disabled={loading}
              />
              {errors.contributorName && (
                <Text className={flexStyles.hasTextDanger}>{errors.contributorName}</Text>
              )}
            </label>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: '1rem' }}>
            <label>
              <Text><strong>Montant (€) *</strong></Text>
              <Input
                type="number"
                min={MIN_CONTRIBUTION_AMOUNT}
                max={MAX_CONTRIBUTION_AMOUNT}
                step={5}
                value={amount}
                onChange={(e: InputChangeEvent) => setAmount(e.inputValue)}
                placeholder={`Entre ${MIN_CONTRIBUTION_AMOUNT}€ et ${MAX_CONTRIBUTION_AMOUNT}€`}
                className={classNames(flexStyles.isFullwidth, errors.amount && flexStyles.isDanger)}
                disabled={loading}
              />
              <Text style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                Minimum: {formatCurrency(MIN_CONTRIBUTION_AMOUNT)} - Maximum: {formatCurrency(MAX_CONTRIBUTION_AMOUNT)}
              </Text>
              {errors.amount && (
                <Text className={flexStyles.hasTextDanger}>{errors.amount}</Text>
              )}
            </label>
          </div>
        </div>

        {/* Fee Breakdown - Show preview when amount is entered */}
        {amount && parseFloat(amount) >= 1 && (
          <FeeBreakdown
            amount={parseFloat(amount)}
            coverFees={coverFees}
            onCoverFeesChange={setCoverFees}
            feeConfig={feeConfig}
            showToggle={true}
          />
        )}

        {/* Message */}
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <Text><strong>Message (optionnel)</strong></Text>
            <Textarea
              defaultValue={contributorMessage}
              onChange={(e: TextareaChangeEvent) => setContributorMessage(e.textareaValue)}
              placeholder="Un petit mot pour accompagner votre contribution..."
              className={classNames(flexStyles.isFullwidth)}
              disabled={loading}
            />
          </label>
        </div>

        {/* Privacy Options */}
        <div style={{ marginBottom: '1.5rem' }}>
          <InfoBlock>
            <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE}>
              <Title level={TitleLevel.LEVEL4}>Options de confidentialité</Title>
            </InfoBlockHeader>
            <InfoBlockContent>
              <Switch
                label={
                  <Text> Contribution anonyme (votre nom ne sera pas affiché publiquement)</Text>
                }
                alert={AlertState.SUCCESS}
                name='switch'
                onChange={(e: SwitchChangeEvent) => setIsAnonymous(e.switchState)}
                checked={isAnonymous}
                readonly={loading}
              />
              <Switch
                label={
                  <Text> Masquer le montant de ma contribution</Text>
                }
                alert={AlertState.SUCCESS}
                name='switch'
                onChange={(e: SwitchChangeEvent) => setShowAmount(!e.switchState)}
                checked={!showAmount}
                readonly={loading}
              />
            </InfoBlockContent>
          </InfoBlock>
        </div>

        {/* Form Errors Section */}
        {Object.keys(errors).length > 0 && (
          <div>
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>{`Erreur(s) dans le formulaire !!`}</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Title level={TitleLevel.LEVEL5}>
                  Merci de corriger les erreurs ci-dessus pour pouvoir soumettre votre contribution
                </Title>
              </InfoBlockContent>
            </InfoBlock>
          </div>
        )}

        {/* Buttons */}
        <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
          flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
          flexStyles.isFullwidth,
        )}>
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.PRIMARY}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Redirection vers Stripe...' : '→ Continuer vers le paiement'}
          </Button>

          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.SECONDARY}
            type="submit"
            onClick={() => setShowForm(false)}
            disabled={loading}
          >
            Annuler
          </Button>
        </div>
      </form>
    </Box>
  );
}
