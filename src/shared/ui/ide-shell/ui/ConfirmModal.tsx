import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ConfirmModalProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onConfirm, onCancel]);

  return (
    <div className="ide-modal-overlay" onClick={onCancel}>
      <div className="ide-modal" onClick={(e) => e.stopPropagation()}>
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="ide-modal-actions">
          <button className="ide-modal-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="ide-modal-btn danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* Promise-based hook for imperative confirmation */
type ConfirmState = {
  title: string;
  message: string;
  resolve: (value: boolean) => void;
} | null;

export const useConfirm = (): {
  confirm: (title: string, message: string) => Promise<boolean>;
  modal: ReactNode;
} => {
  const [state, setState] = useState<ConfirmState>(null);
  const resolveRef = useRef<((v: boolean) => void) | null>(null);

  const confirm = useCallback(
    (title: string, message: string): Promise<boolean> => {
      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
        setState({ title, message, resolve });
      });
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    setState(null);
  }, []);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
    setState(null);
  }, []);

  const modal = state ? (
    <ConfirmModal
      title={state.title}
      message={state.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, modal };
};
