import React from 'react';
import { TextField } from '@mui/material';

const DateRangeFields = ({ startDate, endDate, onStartChange, onEndChange }) => (
  <>
    <TextField
      label="Fecha Inicio"
      type="date"
      value={startDate}
      onChange={(e) => onStartChange(e.target.value)}
      InputLabelProps={{ shrink: true }}
      fullWidth
    />

    <TextField
      label="Fecha Fin"
      type="date"
      value={endDate}
      onChange={(e) => onEndChange(e.target.value)}
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
  </>
);

export default DateRangeFields;
