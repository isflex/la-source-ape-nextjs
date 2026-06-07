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

export interface RequestPayoutModalProps {
  open: boolean;
  amount: number;
  cagnotteTitle: string;
  onClose: () => void;
  // Resolve with `null`/`undefined` on success → modal closes.
  // Resolve with a string → modal switches to the error step and displays the string.
  // Reject (throw) → caught here, treated like a returned string error.
  onConfirm: () => Promise<string | null | void>;
}

const RequestPayoutModal: React.FC<RequestPayoutModalProps> = ({
  open,
  amount,
  cagnotteTitle,
  onClose,
  onConfirm,
}) => {
  const [step, setStep] = useState<'info' | 'confirm' | 'error'>('info');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount guard for the portal target
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset step + submitting + errorMessage whenever the modal re-opens
    setStep('info');
    setSubmitting(false);
    setErrorMessage(null);
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
        onClose();
        return;
      }
      setErrorMessage(result);
      setStep('error');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Erreur inconnue');
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
              deviez attendre quelques jours avant que le paiement soit effectué.
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

        {step === 'error' && (
          <div className={panelClass}>
            <Title level={TitleLevel.LEVEL3}>Impossible de traiter la demande</Title>
            <Text>{errorMessage}</Text>
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
