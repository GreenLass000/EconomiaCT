import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material';

const EditRecordDialog = ({ open, data, setData, onClose, onSave }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Editar Registro</DialogTitle>
    <DialogContent>
      <TextField
        fullWidth
        label="Concepto"
        value={data?.concept || ''}
        onChange={(e) => setData({ ...data, concept: e.target.value })}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Descripción"
        value={data?.description || ''}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Cantidad"
        type="number"
        value={data?.amount || ''}
        onChange={(e) => setData({ ...data, amount: parseFloat(e.target.value) })}
        margin="normal"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onSave} variant="contained" color="primary">Guardar</Button>
    </DialogActions>
  </Dialog>
);

export default EditRecordDialog;
