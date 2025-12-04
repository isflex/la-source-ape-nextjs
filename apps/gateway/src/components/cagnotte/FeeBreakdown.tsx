'use client';

import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Switch, type SwitchChangeEvent } from '@flex-design-system/react-ts/client-sync-styled-direct/switch';
import { AlertState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import { previewContributionFees } from '@src/lib/cagnotte-helpers';
import type { FeeConfig } from '@src/lib/cagnotte-fees';

interface FeeBreakdownProps {
  amount: number;
  coverFees: boolean;
  onCoverFeesChange: (coverFees: boolean) => void;
  feeConfig: FeeConfig;
  showToggle?: boolean; // Allow user to override and cover fees
}

export function FeeBreakdown({
  amount,
  coverFees,
  onCoverFeesChange,
  feeConfig,
  showToggle = true,
}: FeeBreakdownProps) {
  const breakdown = useMemo(() => {
    if (amount >= 1) {
      // Create effective config - if contributor opts to cover fees, override
      const effectiveConfig: FeeConfig = coverFees
        ? { ...feeConfig, payInFeePayer: 'contributor' }
        : feeConfig;

      return previewContributionFees(amount, effectiveConfig);
    }
    return null;
  }, [amount, coverFees, feeConfig]);

  if (!breakdown || amount < 1) return null;

  const totalStripeFee = parseFloat(breakdown.stripeFee.replace(/[^\d,.-]/g, '').replace(',', '.'));
  const totalPlatformFee = parseFloat(breakdown.platformFee.replace(/[^\d,.-]/g, '').replace(',', '.'));
  const hasFees = totalStripeFee > 0 || totalPlatformFee > 0;

  return (
    <div style={{ borderRadius: '0.75rem', padding: '1rem', marginTop: '1rem' }} className={classNames(flexStyles.hasBackgroundGreyLighter)}>
      <Title level={TitleLevel.LEVEL4} style={{ marginBottom: '0.75rem' }}>
        Récapitulatif
      </Title>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
        {/* Contribution amount */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text style={{ opacity: 0.7 }}>Votre contribution</Text>
          <Text><strong>{breakdown.contribution}</strong></Text>
        </div>

        {/* Show fees if contributor is covering them */}
        {coverFees && hasFees && (
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
            <Text style={{ fontSize: '0.875rem' }}>+ Frais de traitement</Text>
            <Text style={{ fontSize: '0.875rem' }}>{breakdown.stripeFee}</Text>
          </div>
        )}

        {/* Platform fee if applicable */}
        {totalPlatformFee > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
            <Text style={{ fontSize: '0.875rem' }}>+ Commission plateforme</Text>
            <Text style={{ fontSize: '0.875rem' }}>{breakdown.platformFee}</Text>
          </div>
        )}

        {/* Total charge */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <Text><strong>{coverFees ? 'Total à payer' : 'Montant débité'}</strong></Text>
          <Text className={classNames(flexStyles.hasTextPrimary)}>
            <strong>{breakdown.totalCharge}</strong>
          </Text>
        </div>

        {/* What recipient receives */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }} className={classNames(flexStyles.hasTextSuccess)}>
          <Text>→ La cagnotte reçoit</Text>
          <Text><strong>{breakdown.recipientReceives}</strong></Text>
        </div>
      </div>

      {/* Checkbox: opt-in to cover fees */}
      {showToggle && feeConfig.payInFeePayer !== 'contributor' && (
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
          <Switch
            label={
              <div>
                <Text style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Je souhaite couvrir les frais de traitement
                </Text>
                <Text style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.25rem' }}>
                  Ainsi, 100% de ma contribution ira à la cagnotte
                </Text>
              </div>
            }
            alert={AlertState.SUCCESS}
            name="coverFees"
            onChange={(e: SwitchChangeEvent) => onCoverFeesChange(e.switchState)}
            checked={coverFees}
          />
        </div>
      )}

      {/* Fee note */}
      <Text style={{ fontSize: '0.75rem', opacity: 0.6, fontStyle: 'italic', marginTop: '0.75rem' }}>
        {breakdown.feeNote}
      </Text>
    </div>
  );
}
