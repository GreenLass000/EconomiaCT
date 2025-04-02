import React from 'react';
import { DialogTitle, DialogContent, Button } from '@mui/material';
import { StyledDialog, StyledDialogActions } from '../styles';
import NewIncomeSpentModal from '../../NewIncomeSpent';

const NewIncomeSpentDialog = ({ open, onClose, onSubmit, onFinish }) => (
  <StyledDialog open={open} onClose={onClose}>
    <DialogTitle>Nuevo Ingreso/Gasto</DialogTitle>
    <DialogContent>
      <NewIncomeSpentModal onSubmit={onSubmit} onFinish={onFinish} />
    </DialogContent>
    <StyledDialogActions>
      <Button onClick={onClose}>Cerrar</Button>
    </StyledDialogActions>
  </StyledDialog>
);

export default NewIncomeSpentDialog;
