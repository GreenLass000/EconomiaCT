import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../styles/newperson_styles.css';

const PersonForm = ({ formState, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} style={{ width: '100%' }}>
    <div className='form-item'>
      <TextField
        id="firstName"
        name="firstName"
        label="Nombre"
        value={formState.firstName}
        onChange={(e) => onChange('firstName', e.target.value)}
        required
        fullWidth
      />
    </div>
    <div className='form-item'>
      <TextField
        id="lastName"
        name="lastName"
        label="Apellidos"
        value={formState.lastName}
        onChange={(e) => onChange('lastName', e.target.value)}
        required
        fullWidth
      />
    </div>
    <div className='form-item'>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Añadir Persona
      </Button>
    </div>
  </form>
);

export default PersonForm;
