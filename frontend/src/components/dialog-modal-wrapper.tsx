import React, { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";

interface DialogModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  dialogHeaderContent: ReactNode;
  children: ReactNode;
}

const DialogModalWrapper: React.FC<DialogModalWrapperProps> = ({
  isOpen,
  onClose,
  dialogHeaderContent,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-gray-900 text-white border border-gray-500">
        <DialogHeader>{dialogHeaderContent}</DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogModalWrapper;
