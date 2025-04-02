import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{content}</DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm} color="error">Confirmar</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
