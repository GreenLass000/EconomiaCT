import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import './newperson_styles.css';
import axios from 'axios';
import config from '../../config';

const NewPersonModal = ({ onSubmit }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isConcertado, setIsConcertado] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            firstName,
            lastName,
            isConcertado,
        };

        try {
            const response = await axios.post(`${config.API_URL}/persons`, formData);
            // console.log('Persona añadida:', response.data);
            onSubmit(response.data);

            setFirstName('');
            setLastName('');
            setIsConcertado(false);

            window.location.reload();
        } catch (error) {
            console.error('Error al añadir persona:', error);
        }
    };


    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div className='form-item'>
                <TextField
                    id="firstName"
                    name="firstName"
                    label="Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                />
            </div>
            <div className='form-item'>
                <TextField
                    id="lastName"
                    name="lastName"
                    label="Apellidos"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                />
            </div>
            {/* <div className='form-item'>
                <FormControlLabel
                    control={
                        <Checkbox
                            id="isConcertado"
                            name="isConcertado"
                            checked={isConcertado}
                            onChange={(e) => setIsConcertado(e.target.checked)}
                        />
                    }
                    label="Concertado"
                />
            </div> */}
            <div className='form-item'>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Añadir Persona
                </Button>
            </div>
        </form>
    );
};

export default NewPersonModal;
