import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
    Snackbar, Alert, IconButton, Paper, Grid
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import config from '../../config'; // Importar la configuración
import './interactivelist_styles.css';

const InteractiveList = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [persons, setPersons] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchPersonBalance = async (personId) => {
        try {
            const response = await axios.get(`${config.API_URL}/record/person/${personId}`);
            const records = response.data;
            const balance = records.reduce((total, record) => total + record.amount, 0);
            return balance;
        } catch (error) {
            console.error('Error fetching person balance:', error);
            return 0;
        }
    };

    const fetchPersons = useCallback(async () => {
        try {
            const response = await axios.get(`${config.API_URL}/persons/active`);
            const activePersons = await Promise.all(response.data.map(async person => {
                const balance = await fetchPersonBalance(person.id);
                return {
                    id: person.id,
                    firstName: person.firstName,
                    lastName: person.lastName,
                    name: `${person.lastName}, ${person.firstName}`,
                    balance
                };
            }));

            const filteredPersons = activePersons.filter(person =>
                !(person.firstName.toLowerCase() === 'comunidad' && person.lastName.toLowerCase() === 'terapeutica')
            );

            setPersons(filteredPersons);
        } catch (error) {
            console.error('Error fetching persons list:', error);
        }
    }, []);

    const handleRowClick = async (row) => {
        setSelectedRow(row);
        try {
            const response = await axios.get(`${config.API_URL}/record/person/${row.id}`);
            setDetailData(response.data);
        } catch (error) {
            console.error('Error fetching person details:', error);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
        setDetailData([]);
    };

    const handleDeletePerson = async () => {
        if (!selectedRow) return;
        try {
            await axios.delete(`${config.API_URL}/person/${selectedRow.id}`);
            setSnackbar({ open: true, message: 'Persona eliminada exitosamente.', severity: 'success' });
            setIsModalOpen(false);
            fetchPersons();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar persona.', severity: 'error' });
            console.error('Error deleting person:', error);
        }
    };

    const handleDeleteClick = async (id) => {
        try {
            await axios.delete(`${config.API_URL}/person/${id}`);
            setSnackbar({ open: true, message: 'Registro eliminado exitosamente.', severity: 'success' });
            fetchPersons();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar registro.', severity: 'error' });
            console.error('Error deleting record:', error);
        }
    };

    const handleEdit = async (row) => {
        try {
            // Aquí puedes añadir lógica para editar el registro, por ejemplo mostrando un formulario
            setSnackbar({ open: true, message: 'Edición realizada correctamente.', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al editar registro.', severity: 'error' });
            console.error('Error editing record:', error);
        }
    };

    const formatBalance = (balance) => {
        const formattedBalance = balance.toFixed(2) + ' €';
        const balanceStyle = { color: balance >= 0 ? 'green' : 'red' };
        return <span style={balanceStyle}>{formattedBalance}</span>;
    };

    const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

    useEffect(() => {
        fetchPersons();
    }, [fetchPersons]);

    return (
        <div className="grid-item">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell align='right'>Saldo</TableCell>
                            <TableCell align='center'>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {persons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} align="center">
                                    No hay datos en la tabla
                                </TableCell>
                            </TableRow>
                        ) : (
                            persons.map((row) => (
                                <TableRow key={row.id} hover onClick={() => handleRowClick(row)}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell align='right'>
                                        {formatBalance(row.balance)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteClick(row.id); }} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            Detalles de {selectedRow?.name}
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDeletePerson}
                            >
                                Dar de baja
                            </Button>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Concepto</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {detailData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No hay datos en la tabla
                                    </TableCell>
                                </TableRow>
                            ) : (
                                detailData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{row.concept}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell align="right" style={{ color: row.amount >= 0 ? 'green' : 'red' }}>
                                            {formatBalance(row.amount)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleEdit(row)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(row.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default InteractiveList;
