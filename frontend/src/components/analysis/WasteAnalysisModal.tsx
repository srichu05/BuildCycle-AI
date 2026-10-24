import React from 'react';
import { Modal } from '../ui/Modal';
import { WasteAnalysisWorkspace } from './WasteAnalysisWorkspace';

interface WasteAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WasteAnalysisModal: React.FC<WasteAnalysisModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="BuildCycle AI — Visual Waste Analysis"
      subtitle="Interactive Computer Vision Workspace"
      maxWidth="6xl"
    >
      <div className="-m-6">
        <WasteAnalysisWorkspace id="modal-workspace" />
      </div>
    </Modal>
  );
};
