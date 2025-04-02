import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const TableBodyContent = ({ data, onEdit, onDelete }) => {
  const formatAmount = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
  const totalAmount = data.reduce((total, row) => total + row.amount, 0);

  return (
    <>
      <TableRow>
        <TableCell colSpan={3} align="left" style={{ fontWeight: 'bold' }}>
          Saldo:
        </TableCell>
        <TableCell align="right" style={{ fontWeight: 'bold', color: totalAmount >= 0 ? 'green' : 'red' }}>
          {formatAmount(totalAmount)}
        </TableCell>
        <TableCell />
      </TableRow>
      {data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5} align="center">
            No hay datos en la tabla
          </TableCell>
        </TableRow>
      ) : (
        data.map(row => (
          <TableRow key={row.id}>
            <TableCell>{new Date(row.date).toLocaleDateString('es-ES')}</TableCell>
            <TableCell>{row.concept}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell align="right" style={{ color: row.amount >= 0 ? 'green' : 'red' }}>
              {formatAmount(row.amount)}
            </TableCell>
            <TableCell align="center">
              <IconButton onClick={() => onEdit(row)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => onDelete(row.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))
      )}
    </>
  );
};

export default TableBodyContent;
