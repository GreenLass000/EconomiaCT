import React, { useState, useEffect, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Snackbar, Alert, IconButton, Paper, Grid, TextField, FormControlLabel, Checkbox
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, PersonRemoveAlt1, FormatListNumbered } from '@mui/icons-material';
import axios from 'axios';
import config from '../../config';
import './interactivelist_styles.css';
import CustomTextBox from '../CustomTextBox';

const InteractiveList = () => {
    const [persons, setPersons] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [deleteRecordDialogOpen, setDeleteRecordDialogOpen] = useState(false);
    const [disablePersonDialogOpen, setDisablePersonDialogOpen] = useState(false);

    const [editPersonDialogOpen, setEditPersonDialogOpen] = useState(false);
    const [editPersonData, setEditPersonData] = useState({ firstName: '', lastName: '', isConcertado: false });
    const [editRecordDialogOpen, setEditRecordDialogOpen] = useState(false);
    const [editRecordData, setEditRecordData] = useState(null);

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

    // Detail handlers

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

    // Disable person handlers

    const handleDisablePersonClick = async (id) => {
        setSelectedId(id);
        setDisablePersonDialogOpen(true);
    };

    const handleDisablePersonConfirm = async () => {
        if (!selectedRow) return;
        try {
            await axios.patch(`${config.API_URL}/person/delete/${selectedRow.id}`);
            setSnackbar({ open: true, message: 'Persona dada de baja exitosamente.', severity: 'success' });
            setIsModalOpen(false);
            setDisablePersonDialogOpen(false);
            fetchPersons();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al dar de baja a persona.', severity: 'error' });
            console.error('Error deleting person:', error);
        }
    };

    // Delete record handlers

    const handleDeleteRecordClick = async (id) => {
        setSelectedId(id);
        setDeleteRecordDialogOpen(true);
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

    // Edit record handlers

    const handleEditRecord = async (row) => {
        setSelectedId(row.id);
        setEditRecordData({ ...row });
        setEditRecordDialogOpen(true);
    };

    const handleEditRecordSave = async () => {
        try {
            await axios.put(`${config.API_URL}/record/${selectedId}`, editRecordData);
            setDetailData(detailData.map(item => (item.id === editRecordData.id ? editRecordData : item)));
            setEditRecordDialogOpen(false);
            setSnackbar({ open: true, message: 'Registro editado exitosamente.', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al editar registro.', severity: 'error' });
            console.error('Error editing record:', error);
        }
    };

    // Edit person handlers

    const handleEditPerson = async () => {
        setEditPersonData({
            firstName: selectedRow.firstName,
            lastName: selectedRow.lastName,
            isConcertado: selectedRow.isConcertado
        });
        setSelectedId(selectedRow.id);
        setEditPersonDialogOpen(true);
    };

    const handleEditPersonSave = async () => {
        try {
            await axios.put(`${config.API_URL}/person/${selectedId}`, editPersonData);
            setSnackbar({ open: true, message: 'Persona editada exitosamente.', severity: 'success' });
            setEditPersonDialogOpen(false);
            setIsModalOpen(false);
            fetchPersons();
        } catch (error) {
            setSnackbar({ open: true, message: 'Error al editar persona.', severity: 'error' });
            console.error('Error editing person:', error);
        }
    };

    const formatAmount = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

    const closeSnackbar = () => setSnackbar({ ...snackbar, open: false });

    useEffect(() => {
        fetchPersons();
    }, [fetchPersons]);

    return (
        <div className="grid-item">
            <CustomTextBox text="Gastos Personales Usuarios" />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align='right'>Saldo</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align='center'>Detalles</TableCell>
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
                                    <TableCell align='right' style={{ color: row.balance >= 0 ? 'green' : 'red' }}>
                                        {formatAmount(row.balance)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={(e) => { e.stopPropagation(); handleRowClick(row); }}>
                                            <FormatListNumbered color='gray_dark' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={editPersonDialogOpen} onClose={() => setEditPersonDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Persona</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Nombre"
                        value={editPersonData.firstName}
                        onChange={(e) => setEditPersonData({ ...editPersonData, firstName: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Apellidos"
                        value={editPersonData.lastName}
                        onChange={(e) => setEditPersonData({ ...editPersonData, lastName: e.target.value })}
                        margin="normal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={editPersonData.isConcertado}
                                onChange={(e) => setEditPersonData({ ...editPersonData, isConcertado: e.target.checked })}
                            />
                        }
                        label="Concertado"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditPersonDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleEditPersonSave} variant="contained" color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item style={{ maxWidth: '60%', wordBreak: 'break-word' }}>
                            Detalles de {selectedRow?.name && selectedRow.name.length > 30 ? (
                                <>
                                    {selectedRow.name.split(',')[0]},
                                    <br />
                                    {selectedRow.name.split(',')[1]}
                                </>
                            ) : (
                                selectedRow?.name
                            )}
                        </Grid>
                        <Grid item style={{ gap: '1rem', display: 'flex' }}>
                            <Button
                                variant="contained"
                                color='white'
                                onClick={handleEditPerson}
                            >
                                <b>Editar persona</b>
                            </Button>
                            <Button
                                variant="contained"
                                color='error'
                                onClick={handleDisablePersonClick}
                            >
                                <b>Dar de baja</b>&nbsp;&nbsp;
                                <PersonRemoveAlt1 />
                            </Button>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Concepto</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Descripción</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }} align="right">Cantidad</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3} align="left">
                                    <b>Saldo:</b>
                                </TableCell>
                                <TableCell align='right' style={{ color: selectedRow?.balance >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {formatAmount(selectedRow?.balance)}
                                </TableCell>
                                <TableCell />
                            </TableRow>
                            {detailData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No hay datos en la tabla
                                    </TableCell>
                                </TableRow>
                            ) : (
                                detailData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{new Date(row.date).toLocaleDateString('es-ES')}</TableCell>
                                        <TableCell>{row.concept}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell align="right" style={{ color: row.amount >= 0 ? 'green' : 'red' }}>
                                            {formatAmount(row.amount)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleEditRecord(row)}>
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

            <Dialog open={disablePersonDialogOpen} onClose={() => setDisablePersonDialogOpen(false)}>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogContent>
                    Esta acción no se puede deshacer. Se dará de baja a esta persona.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDisablePersonDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleDisablePersonConfirm} color="error">Dar de baja</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editRecordDialogOpen} onClose={() => setEditRecordDialogOpen(false)}>
                <DialogTitle>Editar Registro</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Concepto"
                        value={editRecordData?.concept}
                        onChange={(e) => setEditRecordData({ ...editRecordData, concept: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Descripción"
                        value={editRecordData?.description || ''}
                        onChange={(e) => setEditRecordData({ ...editRecordData, description: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Cantidad"
                        type="number"
                        value={editRecordData?.amount || ''}
                        onChange={(e) => setEditRecordData({ ...editRecordData, amount: e.target.value })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditRecordDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleEditRecordSave} variant="contained" color="primary">Guardar</Button>
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
