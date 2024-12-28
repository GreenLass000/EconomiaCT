import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Snackbar, Alert, IconButton, Paper, Grid
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import config from '../../config';
import './interactivelist_styles.css';

const InteractiveList = () => {
    const [deleteRecordDialogOpen, setDeleteRecordDialogOpen] = useState(false);
    const [deletePersonDialogOpen, setDeletePersonDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
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

    const handleDisablePerson = async () => {
        if (!selectedRow) return;
        try {
            await axios.patch(`${config.API_URL}/person/delete/${selectedRow.id}`);
            setSnackbar({ open: true, message: 'Persona dada de baja exitosamente.', severity: 'success' });
            setIsModalOpen(false);
            fetchPersons();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al dar de baja a persona.', severity: 'error' });
            console.error('Error deleting person:', error);
        }
    };

    const handleDeleteRecordClick = async (id) => {
        setSelectedId(id);
        setDeleteRecordDialogOpen(true);
    };

    const handleDeletePersonClick = async (id) => {
        
    };

    const handleDeleteRecordConfirm = async () => {
        try {
            await axios.delete(`${config.API_URL}/record/${selectedId}`);
            setDetailData(prevDetailData => prevDetailData.filter(item => item.id !== selectedId));
            setDeleteRecordDialogOpen(false);
            setSnackbar({ open: true, message: 'Registro eliminado exitosamente.', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar registro.', severity: 'error' });
            console.error('Error deleting record:', error);
        }
    };

    const handleDeletePersonConfirm = async () => {
        try {
            await axios.delete(`${config.API_URL}/person/${selectedId}`);
            setSnackbar({ open: true, message: 'Persona eliminada exitosamente.', severity: 'success' });
            fetchPersons();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar persona.', severity: 'error' });
            console.error('Error deleting record:', error);
        }
    };

    const handleEdit = async (row) => {
        try {
            setSnackbar({ open: true, message: 'No implementado', severity: 'info' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error no implementado', severity: 'error' });
            console.error('Error editing record:', error);
        }
    };

    const personHandleEdit = async (row) => {
        try {
            setSnackbar({ open: true, message: 'No implementado', severity: 'info' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error no implementado', severity: 'error' });
            console.error('Error editing record:', error);
        }
    };

    const personHandleDeleteClick = async (id) => {
        try {
            await axios.delete(`${config.API_URL}/person/${id}`);
            setSnackbar({ open: true, message: 'Persona eliminada exitosamente.', severity: 'success' });
            fetchPersons();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al eliminar persona.', severity: 'error' });
            console.error('Error deleting record:', error);
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
                                <TableCell colSpan={3} align="center">
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
                                        <IconButton onClick={(e) => { e.stopPropagation(); personHandleEdit(row); }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={(e) => { e.stopPropagation(); personHandleDeleteClick(row.id); }} color="error">
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
                                onClick={handleDisablePerson}
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
                                    <TableCell colSpan={5} align="center">
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
                                            <IconButton onClick={() => handleDeleteRecordClick(row.id)} color="error">
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

            <Dialog open={deleteRecordDialogOpen} onClose={() => setDeleteRecordDialogOpen(false)}>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>
                    Esta acción no se puede deshacer. Se eliminará permanentemente este registro.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteRecordDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDeleteRecordConfirm} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deletePersonDialogOpen} onClose={() => setDeletePersonDialogOpen(false)}>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>
                    Esta acción no se puede deshacer. Se eliminará permanentemente esta persona.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletePersonDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDeletePersonConfirm} color="error">Eliminar</Button>
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
