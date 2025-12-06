'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import classNames from 'classnames';
import {
  Table,
  TableHead,
  TableBody,
  TableTr,
  TableTh,
  TableTd
} from '@flex-design-system/react-ts/client-sync-styled-direct/table';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Sticker } from '@flex-design-system/react-ts/client-sync-styled-direct/sticker';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import { default as flexStyles } from '@flex-design-system/framework';
import {
  getContributorDisplayName,
  getContributionDisplayAmount,
  getPaymentStatusLabel,
  type JackpotContributionData
} from '@src/lib/cagnotte-helpers';

const client = generateClient<Schema>();

interface JackpotContributionTableProps {
  jackpotFormId: string;
  isCreatorMode: boolean;
}

export default function JackpotContributionTable({
  jackpotFormId,
  isCreatorMode
}: JackpotContributionTableProps) {
  const [contributions, setContributions] = useState<JackpotContributionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContributions = () => {
      const { unsubscribe } = client.models.JackpotContribution.observeQuery({
        filter: { jackpotFormId: { eq: jackpotFormId } }
      }).subscribe({
        next: ({ items }) => {
          // Sort by payment date (newest first), then by created date
          const sorted = (items || []).sort((a, b) => {
            const dateA = a.paidAt || a.createdAt || '';
            const dateB = b.paidAt || b.createdAt || '';
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });
          setContributions(sorted as JackpotContributionData[]);
          setLoading(false);
        },
        error: (error) => {
          console.error('Error loading contributions:', error);
          setLoading(false);
        }
      });

      return unsubscribe;
    };

    loadContributions();
  }, [jackpotFormId]);

  if (loading) {
    return <Text>Chargement des contributions...</Text>;
  }

  if (contributions.length === 0) {
    return (
      <Text style={{ fontStyle: 'italic', opacity: 0.7 }}>
        Aucune contribution pour le moment. Soyez le premier à contribuer !
      </Text>
    );
  }

  // Filter to show only successful contributions to public
  const displayContributions = isCreatorMode
    ? contributions
    : contributions.filter(c => c.paymentStatus === 'SUCCEEDED');

  const getPaymentStatusVariant = (status: Schema['EPaymentStatus']['type']): VariantState => {
    switch (status) {
      case 'SUCCEEDED':
        return VariantState.SUCCESS;
      case 'PENDING':
        return VariantState.WARNING;
      case 'FAILED':
      case 'CANCELED':
      case 'REFUNDED':
        return VariantState.DANGER;
      default:
        return VariantState.SECONDARY;
    }
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table className={classNames(flexStyles.isFullwidth)}>
        <TableHead>
          <TableTr>
            <TableTh className={flexStyles.isHiddenMobile}>
              <div style={{ padding: '0 0.5rem' }}>Contributeur</div>
            </TableTh>
            <TableTh className={flexStyles.isHiddenMobile}>
              <div style={{ padding: '0 0.5rem' }}>Montant</div>
            </TableTh>
            <TableTh className={flexStyles.isHiddenMobile}>
              <div style={{ padding: '0 0.5rem' }}>Message</div>
            </TableTh>
            <TableTh className={flexStyles.isHiddenMobile}>
              <div style={{ padding: '0 0.5rem' }}>Date</div>
            </TableTh>
            {isCreatorMode && (
              <>
                <TableTh className={flexStyles.isHiddenMobile}>
                  <div style={{ padding: '0 0.5rem' }}>Email</div>
                </TableTh>
                <TableTh className={flexStyles.isHiddenMobile}>
                  <div style={{ padding: '0 0.5rem' }}>Statut</div>
                </TableTh>
              </>
            )}
          </TableTr>
        </TableHead>
        <TableBody>
          {displayContributions.map((contribution) => (
            <TableTr
              key={contribution.id}
              className={classNames(
                flexStyles.isFlexMobile,
                flexStyles.isFlexDirectionColumn,
                flexStyles.isFullwidthMobile,
                flexStyles.isTableRowTablet,
                flexStyles.isColumnSpanAllTablet
              )}
            >
              {/* Contributor Name */}
              <TableTd className={classNames(
                flexStyles.isFlexMobile,
                flexStyles.isAlignItemsCenter,
                flexStyles.isJustifyContentSpaceBetween,
                flexStyles.isDataCellResponsiveHelper,
              )}>
                <div className={classNames(
                  flexStyles.isHiddenTablet,
                  flexStyles.isFullwidth,
                )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Contributeur</div>
                <div style={{ padding: '0 0.5rem' }}>
                  {getContributorDisplayName(contribution)}
                </div>
              </TableTd>

              {/* Amount */}
              <TableTd className={classNames(
                flexStyles.isFlexMobile,
                flexStyles.isAlignItemsCenter,
                flexStyles.isJustifyContentSpaceBetween,
                flexStyles.isDataCellResponsiveHelper,
              )}>
                <div className={classNames(
                  flexStyles.isHiddenTablet,
                  flexStyles.isFullwidth,
                )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Montant</div>
                <div style={{ padding: '0 0.5rem' }}>
                  <strong>{getContributionDisplayAmount(contribution)}</strong>
                </div>
              </TableTd>

              {/* Message */}
              <TableTd className={classNames(
                flexStyles.isFlexMobile,
                flexStyles.isAlignItemsCenter,
                flexStyles.isJustifyContentSpaceBetween,
                flexStyles.isDataCellResponsiveHelper,
              )}>
                <div className={classNames(
                  flexStyles.isHiddenTablet,
                  flexStyles.isFullwidth,
                )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Message</div>
                <div style={{ padding: '0 0.5rem', fontStyle: contribution.contributorMessage ? 'normal' : 'italic', opacity: contribution.contributorMessage ? 1 : 0.7 }}>
                  {contribution.contributorMessage || 'Aucun message'}
                </div>
              </TableTd>

              {/* Date */}
              <TableTd className={classNames(
                flexStyles.isFlexMobile,
                flexStyles.isAlignItemsCenter,
                flexStyles.isJustifyContentSpaceBetween,
                flexStyles.isDataCellResponsiveHelper,
              )}>
                <div className={classNames(
                  flexStyles.isHiddenTablet,
                  flexStyles.isFullwidth,
                )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Date</div>
                <div style={{ padding: '0 0.5rem', fontSize: '0.875rem' }}>
                  {formatDate(contribution.paidAt || contribution.createdAt)}
                </div>
              </TableTd>

              {/* Creator-only columns */}
              {isCreatorMode && (
                <>
                  {/* Email */}
                  <TableTd className={classNames(
                    flexStyles.isFlexMobile,
                    flexStyles.isAlignItemsCenter,
                    flexStyles.isJustifyContentSpaceBetween,
                    flexStyles.isDataCellResponsiveHelper,
                  )}>
                    <div className={classNames(
                      flexStyles.isHiddenTablet,
                      flexStyles.isFullwidth,
                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Email</div>
                    <div style={{ padding: '0 0.5rem', fontSize: '0.875rem' }}>
                      {contribution.contributorEmail}
                    </div>
                  </TableTd>

                  {/* Status */}
                  <TableTd className={classNames(
                    flexStyles.isFlexMobile,
                    flexStyles.isAlignItemsCenter,
                    flexStyles.isJustifyContentSpaceBetween,
                    flexStyles.isDataCellResponsiveHelper,
                  )}>
                    <div className={classNames(
                      flexStyles.isHiddenTablet,
                      flexStyles.isFullwidth,
                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Statut</div>
                    <div style={{ padding: '0 0.5rem' }}>
                      <Sticker variant={getPaymentStatusVariant(contribution.paymentStatus)}>
                        {getPaymentStatusLabel(contribution.paymentStatus)}
                      </Sticker>
                    </div>
                  </TableTd>
                </>
              )}
            </TableTr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
