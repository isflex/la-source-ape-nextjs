'use client';

import React from 'react';
// import classNames from 'classnames';
import { useDroppable } from '@dnd-kit/core';
// import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';

interface DroppableDateSlotProps {
  id: string;
  selectedDate: string;
  isCreatorMode: boolean;
  children: React.ReactNode;
}

export default function DroppableDateSlot({
  id,
  // selectedDate,
  isCreatorMode,
  children
}: DroppableDateSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    disabled: !isCreatorMode, // Only creator can drop
  });

  // Format date for display
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString + 'T00:00:00.000Z');
  //   return date.toLocaleDateString('fr-FR', {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };

  // const formatShortDate = (dateString: string) => {
  //   const date = new Date(dateString + 'T00:00:00.000Z');
  //   return date.toLocaleDateString('fr-FR', {
  //     weekday: 'short',
  //     day: 'numeric',
  //     month: 'short'
  //   });
  // };

  return (
    <div
      ref={setNodeRef}
      style={{
        border: isOver ? '2px dashed #0ea5e9' : '1px solid #e0e0e0',
        backgroundColor: isOver ? '#f0f9ff' : 'white',
        borderRadius: '8px',
        padding: '1rem',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      {/* Date header */}
      <div>

        {/*
        <Title level={TitleLevel.LEVEL3}>
          <span className={flexStyles.isHiddenMobile}>{formatDate(selectedDate)}</span>
          <span className={flexStyles.isHiddenTablet}>{formatShortDate(selectedDate)}</span>
        </Title>
        */}

        {isOver && (
          <Text
            style={{
              color: '#0ea5e9',
              fontSize: '0.875rem',
              marginTop: '0.5rem',
              fontWeight: 500
            }}
          >
            Déposer ici pour déplacer le participant
          </Text>
        )}
      </div>

      {/* Candidats */}
      {children}
    </div>
  );
}
