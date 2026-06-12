'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';

import { default as flexStyles } from '@flex-design-system/framework';
import { Modal } from '@flex-design-system/react-ts/client-sync-styled-direct/modal';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';

import { formatCurrency } from '@src/lib/cagnotte-helpers';

export interface PayoutErrorInfo {
  message: string;
  code?: string;          // currently only "FUNDS_PENDING" surfaced
  daysRemaining?: number; // present iff code === "FUNDS_PENDING"
}

export interface RequestPayoutModalProps {
  open: boolean;
  amount: number;
  cagnotteTitle: string;
  onClose: () => void;
  // Resolve with `null`/`undefined` on success → modal closes.
  // Resolve with a string or PayoutErrorInfo → modal switches to the error step and displays
  // the message (string is treated as `{ message }`).
  // Reject (throw) → caught here, treated like a returned string error.
  onConfirm: () => Promise<string | PayoutErrorInfo | null | void>;
}

const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  open,
  amount,
  cagnotteTitle,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<'info' | 'confirm' | 'success' | 'error'>('info');
  const [submitting, setSubmitting] = useState(false);
  const [errorInfo, setErrorInfo] = useState<PayoutErrorInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount guard for the portal target
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset step + submitting + errorInfo whenever the modal re-opens
    setStep('info');
    setSubmitting(false);
    setErrorInfo(null);
  }, [open]);

  if (!mounted) return null;
  const portalTarget = document.querySelector('#root-portal');
  if (!portalTarget) return null;

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const result = await onConfirm();
      if (result == null) {
        setStep('success');
        return;
      }
      const info: PayoutErrorInfo =
        typeof result === 'string' ? { message: result } : result;
      setErrorInfo(info);
      setStep('error');
    } catch (err) {
      setErrorInfo({ message: err instanceof Error ? err.message : 'Erreur inconnue' });
      setStep('error');
    } finally {
      setSubmitting(false);
    }
  };

  const panelClass = classNames(
    flexStyles.isGridDisplayGrid,
    flexStyles.isGridGap4,
    flexStyles.isGridCols1,
    flexStyles.isFullwidth,
  );

  const buttonRowClass = classNames(
    flexStyles.isGridDisplayGrid,
    flexStyles.isGridGap4,
    flexStyles.isGridCols1,
    flexStyles.isGridCols2Tablet,
    flexStyles.isFullwidth,
  );

  return createPortal(
    <div onClick={(e) => e.stopPropagation()}>
      <Modal active={open} onClose={handleClose}>
        <br />
        {step === 'info' && (
          <div className={panelClass}>
            <Title level={TitleLevel.LEVEL3}>Demander le paiement</Title>
            <Text>
              Stripe libère les fonds après une période de sécurité (généralement 7 jours
              après chaque contribution). Selon la date des contributions, il se peut que vous
              devez attendre quelques jours avant que le transfert peut être effectué.
            </Text>
            <div className={buttonRowClass} style={{ marginTop: '1rem' }}>
              <Button
                id='cagnotte-request-payout-info-close-btn'
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.SECONDARY}
                onClick={handleClose}
              >
                Fermer
              </Button>
              <Button
                id='cagnotte-request-payout-info-continue-btn'
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.PRIMARY}
                onClick={() => setStep('confirm')}
              >
                Continuer
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className={panelClass}>
            <Title level={TitleLevel.LEVEL3}>Confirmer la demande</Title>
            <Text>
              Montant à recevoir : <strong>{formatCurrency(amount)}</strong> pour &laquo;{' '}
              {cagnotteTitle} &raquo;.
            </Text>
            <Text>Souhaitez-vous confirmer la demande de paiement ?</Text>
            <div className={buttonRowClass} style={{ marginTop: '1rem' }}>
              <Button
                id='cagnotte-request-payout-confirm-close-btn'
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.SECONDARY}
                onClick={handleClose}
                disabled={submitting}
              >
                Fermer
              </Button>
              <Button
                id='cagnotte-request-payout-confirm-submit-btn'
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.SUCCESS}
                onClick={handleConfirm}
                disabled={submitting}
              >
                {submitting ? 'Envoi…' : 'Confirmer la demande'}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className={panelClass}>
            <Title level={TitleLevel.LEVEL3}>Demande envoyée</Title>
            <Text>
              Demande de paiement de <strong>{formatCurrency(amount)}</strong> pour &laquo;{' '}
              {cagnotteTitle} &raquo; envoyée avec succès.
            </Text>
            <Text>Le paiement sera confirmé sous quelques jours.</Text>
            <div style={{ marginTop: '1rem' }}>
              <Button
                id='cagnotte-request-payout-success-close-btn'
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.SECONDARY}
                onClick={onClose}
              >
                Fermer
              </Button>
            </div>
          </div>
        )}

        {step === 'error' && errorInfo && (
          <div className={panelClass}>
            <Title level={TitleLevel.LEVEL3}>
              {errorInfo.code === 'FUNDS_PENDING' && errorInfo.daysRemaining != null
                ? errorInfo.daysRemaining === 1
                  ? 'Veuillez réessayer dans 1 jour'
                  : `Veuillez réessayer dans ${errorInfo.daysRemaining} jours`
                : 'Impossible de traiter la demande'}
            </Title>
            <Text>{errorInfo.message}</Text>
            <div style={{ marginTop: '1rem' }}>
              <Button
                id='cagnotte-request-payout-error-close-btn'
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.SECONDARY}
                onClick={handleClose}
              >
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>,
    portalTarget,
  );
};

export default RequestPayoutModal;
