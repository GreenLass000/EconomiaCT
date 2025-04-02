import React from 'react';
import { DialogTitle, DialogContent, Button } from '@mui/material';
import { StyledDialog, StyledDialogActions } from '../styles';
import NewPersonModal from '../../NewPerson';

const AddPersonDialog = ({ open, onClose, onSubmit, onFinish }) => (
  <StyledDialog open={open} onClose={onClose}>
    <DialogTitle>Añadir Persona</DialogTitle>
    <DialogContent>
      <NewPersonModal onSubmit={onSubmit} onFinish={onFinish} />
    </DialogContent>
    <StyledDialogActions>
      <Button onClick={onClose}>Cerrar</Button>
    </StyledDialogActions>
  </StyledDialog>
);

export default AddPersonDialog;
