import React from 'react';
import { DialogTitle, DialogContent, Button } from '@mui/material';
import { StyledDialog, StyledDialogActions } from '../styles';
import GenerateReportModal from '../../GenerateReportModal';

const GenerateReportDialog = ({ open, onClose }) => (
  <StyledDialog open={open} onClose={onClose}>
    <DialogTitle>Generar Reporte</DialogTitle>
    <DialogContent>
      <GenerateReportModal />
    </DialogContent>
    <StyledDialogActions>
      <Button onClick={onClose}>Cerrar</Button>
    </StyledDialogActions>
  </StyledDialog>
);

export default GenerateReportDialog;
