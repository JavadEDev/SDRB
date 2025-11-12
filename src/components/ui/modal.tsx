"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full mx-4",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!closeOnOverlayClick && !newOpen) {
      // Only allow closing via close button or programmatically
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(sizeClasses[size], className)}
        onInteractOutside={(e) => {
          if (!closeOnOverlayClick) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnOverlayClick) {
            e.preventDefault();
          }
        }}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription className="mt-2">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {children && <div className="py-4">{children}</div>}

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

// Convenience component for confirmation modals
export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: "primary" | "danger";
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "primary",
  loading = false,
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error("Confirm action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading || loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={handleConfirm}
            disabled={isLoading || loading}
          >
            {isLoading || loading ? "Loading..." : confirmText}
          </Button>
        </>
      }
    />
  );
}

// Form modal component for common form patterns
export interface FormModalProps extends Omit<ModalProps, "footer"> {
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  submitVariant?: "primary" | "danger";
  showCancel?: boolean;
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitText = "Save",
  cancelText = "Cancel",
  loading = false,
  submitVariant = "primary",
  showCancel = true,
  size = "md",
  ...props
}: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(e);
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size={size}
      footer={
        <>
          {showCancel && (
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || loading}
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="submit"
            form="modal-form"
            variant={submitVariant === "danger" ? "danger" : "primary"}
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <>
                <span className="mr-2">Loading...</span>
              </>
            ) : (
              submitText
            )}
          </Button>
        </>
      }
      {...props}
    >
      <form id="modal-form" onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
}
