import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton
} from '@mui/material';
import { FormatListNumbered } from '@mui/icons-material';

const PersonTable = ({ persons, onRowClick, formatAmount }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
          <TableCell style={{ fontWeight: 'bold' }} align="right">Saldo</TableCell>
          <TableCell style={{ fontWeight: 'bold' }} align="center">Detalles</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {persons.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} align="center">
              No hay datos en la tabla
            </TableCell>
          </TableRow>
        ) : (
          persons.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right" style={{ color: row.balance >= 0 ? 'green' : 'red' }}>
                {formatAmount(row.balance)}
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={(e) => { e.stopPropagation(); onRowClick(row); }}>
                  <FormatListNumbered />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default PersonTable;
