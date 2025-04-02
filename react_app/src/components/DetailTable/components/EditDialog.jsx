import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const EditDialog = ({ open, onClose, onSave, record, onChange }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Editar Registro</DialogTitle>
    <DialogContent>
      <TextField
        label="Concepto"
        name="concept"
        value={record?.concept || ''}
        onChange={onChange}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Descripción"
        name="description"
        value={record?.description || ''}
        onChange={onChange}
        fullWidth
        margin="dense"
      />
      <TextField
        label="Cantidad"
        name="amount"
        type="number"
        value={record?.amount || ''}
        onChange={onChange}
        fullWidth
        margin="dense"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onSave} color="primary">Guardar</Button>
    </DialogActions>
  </Dialog>
);

export default EditDialog;
