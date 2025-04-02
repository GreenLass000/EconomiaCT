import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const DeleteDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>¿Estás seguro?</DialogTitle>
    <DialogContent>
      Esta acción no se puede deshacer. Se eliminará permanentemente este registro.
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm} color="error">Eliminar</Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDialog;
