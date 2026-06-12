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

export interface FeedbackModalProps {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  title = 'Information',
  message,
  onClose,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount guard for the portal target
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const portalTarget = document.querySelector('#root-portal');
  if (!portalTarget) return null;

  const panelClass = classNames(
    flexStyles.isGridDisplayGrid,
    flexStyles.isGridGap4,
    flexStyles.isGridCols1,
    flexStyles.isFullwidth,
  );

  return createPortal(
    <div onClick={(e) => e.stopPropagation()}>
      <Modal active={open} onClose={onClose}>
        <br />
        <div className={panelClass}>
          <Title level={TitleLevel.LEVEL3}>{title}</Title>
          <Text>{message}</Text>
          <div style={{ marginTop: '1rem' }}>
            <Button
              id='cagnotte-feedback-modal-close-btn'
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.SECONDARY}
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </div>,
    portalTarget,
  );
};

export default FeedbackModal;
