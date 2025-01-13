import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { TextField } from '@mui/material';

const CustomDatePicker = ({ value, onChange }) => (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
        <DatePicker
            label="Fecha"
            value={value}
            onChange={onChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
            inputFormat="dd/MM/yyyy"
        />
    </LocalizationProvider>
);

export default CustomDatePicker;
