import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableBody, TableCell, TableHead, TableRow, Button, Grid, IconButton
} from '@mui/material';
import { Edit, Delete, PersonRemoveAlt1 } from '@mui/icons-material';

const PersonDetailDialog = ({
  open, row, detailData, formatAmount,
  onClose, onEditPerson, onDisablePerson, onDeleteRecord, onEditRecord
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item style={{ maxWidth: '60%', wordBreak: 'break-word' }}>
          Detalles de {row?.name && row.name.length > 30
            ? (<>{row.name.split(',')[0]},<br />{row.name.split(',')[1]}</>)
            : row?.name}
        </Grid>
        <Grid item style={{ gap: '1rem', display: 'flex' }}>
          <Button variant="contained" color="primary" onClick={onEditPerson}>
            <b>Editar persona</b>
          </Button>
          <Button variant="contained" color="error" onClick={onDisablePerson}>
            <b>Dar de baja</b>&nbsp;&nbsp;<PersonRemoveAlt1 />
          </Button>
        </Grid>
      </Grid>
    </DialogTitle>
    <DialogContent>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Fecha</b></TableCell>
            <TableCell><b>Concepto</b></TableCell>
            <TableCell><b>Descripción</b></TableCell>
            <TableCell align="right"><b>Cantidad</b></TableCell>
            <TableCell align="center"><b>Acciones</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={3}><b>Saldo:</b></TableCell>
            <TableCell align="right" style={{ color: row?.balance >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
              {formatAmount(row?.balance)}
            </TableCell>
            <TableCell />
          </TableRow>
          {detailData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">No hay datos en la tabla</TableCell>
            </TableRow>
          ) : (
            detailData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{new Date(item.date).toLocaleDateString('es-ES')}</TableCell>
                <TableCell>{item.concept}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right" style={{ color: item.amount >= 0 ? 'green' : 'red' }}>
                  {formatAmount(item.amount)}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => onEditRecord(item)}><Edit /></IconButton>
                  <IconButton onClick={() => onDeleteRecord(item.id)} color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cerrar</Button>
    </DialogActions>
  </Dialog>
);

export default PersonDetailDialog;
