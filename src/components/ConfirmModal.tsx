'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Setuju',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  isDestructive = true,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="ds-modal-overlay" onClick={onCancel}>
      <div className="ds-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ds-modal-header">
          <div className={`ds-modal-icon ${isDestructive ? 'ds-modal-icon-danger' : 'ds-modal-icon-success'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="ds-modal-title">{title}</h3>
        </div>
        
        <p className="ds-modal-desc">{description}</p>
        
        <div className="ds-modal-actions">
          <button onClick={onCancel} className="ds-modal-btn-cancel">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`ds-modal-btn-confirm ${isDestructive ? 'ds-modal-btn-danger' : 'ds-modal-btn-success'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
