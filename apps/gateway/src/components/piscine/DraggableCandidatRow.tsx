'use client';

import React from 'react';
import classNames from 'classnames';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
// import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Icon, IconName, IconSize } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';

interface DraggableCandidatRowProps {
  id: string;
  isCreatorMode: boolean;
  children: React.ReactNode;
}

export default function DraggableCandidatRow({
  id,
  isCreatorMode,
  children
}: DraggableCandidatRowProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    disabled: !isCreatorMode, // Only creator can drag
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isCreatorMode ? 'grab' : 'default',
    transition: 'opacity 0.2s ease',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    marginBottom: '1rem',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classNames(
        flexStyles.isFlexDirectionRow,
        flexStyles.isAlignItemsCenter,
      )}
    >
      {/* Drag handle - Only visible to creator */}
      {isCreatorMode && (
        <div
          {...listeners}
          {...attributes}
          style={{
            padding: '0.5rem',
            cursor: 'grab',
            touchAction: 'none', // Prevents scrolling while dragging on mobile
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '2rem',
            minHeight: '2rem',
            borderRadius: '4px',
            backgroundColor: isDragging ? '#f0f9ff' : 'transparent',
            border: isDragging ? '1px solid #0ea5e9' : '1px solid transparent',
            transition: 'all 0.2s ease',
            position: 'absolute',
            right: '2rem',
          }}
          onMouseDown={(e) => {
            // Add visual feedback
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Maintenir appuyé pour déplacer"
        >
          <Icon
            name={IconName.UI_MENU}
            size={IconSize.MEDIUM}
            style={{ color: isDragging ? '#0ea5e9' : '#666' }}
          />
        </div>
      )}

      {/* Candidat content */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}
