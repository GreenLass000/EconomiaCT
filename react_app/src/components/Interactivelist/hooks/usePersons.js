import { useState, useCallback } from 'react';
import axios from 'axios';

export const usePersons = () => {
  const [persons, setPersons] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPersonDialogOpen, setEditPersonDialogOpen] = useState(false);
  const [editRecordDialogOpen, setEditRecordDialogOpen] = useState(false);
  const [deleteRecordDialogOpen, setDeleteRecordDialogOpen] = useState(false);
  const [disablePersonDialogOpen, setDisablePersonDialogOpen] = useState(false);

  const [editPersonData, setEditPersonData] = useState({ firstName: '', lastName: '' });
  const [editRecordData, setEditRecordData] = useState({});

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const formatAmount = (amount) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

  const closeSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const fetchPersonBalance = async (personId) => {
    try {
      const response = await axios.get(`http://192.168.1.117:5000/record/person/${personId}`);
      const records = response.data;
      return records.reduce((total, r) => total + r.amount, 0);
    } catch {
      return 0;
    }
  };

  const fetchPersons = useCallback(async () => {
    try {
      const response = await axios.get(`http://192.168.1.117:5000/persons/active`);
      const withBalances = await Promise.all(response.data.map(async (p) => {
        const balance = await fetchPersonBalance(p.id);
        return {
          ...p,
          name: `${p.lastName}, ${p.firstName}`,
          balance,
        };
      }));

      setPersons(
        withBalances.filter(p =>
          !(p.firstName.toLowerCase() === 'comunidad' && p.lastName.toLowerCase() === 'terapeutica')
        )
      );
    } catch (err) {
      console.error('Error fetching persons:', err);
    }
  }, []);

  const handleRowClick = async (row) => {
    setSelectedRow(row);
    setSelectedId(row.id);
    try {
      const res = await axios.get(`http://192.168.1.117:5000/record/person/${row.id}`);
      setDetailData(res.data);
    } catch (err) {
      console.error('Error fetching person detail:', err);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
    setDetailData([]);
  };

  const handleDisablePersonClick = () => {
    setDisablePersonDialogOpen(true);
  };

  const handleDisablePersonConfirm = async () => {
    try {
      await axios.patch(`http://192.168.1.117:5000/person/delete/${selectedRow.id}`);
      setSnackbar({ open: true, message: 'Persona dada de baja exitosamente.', severity: 'success' });
      setDisablePersonDialogOpen(false);
      setIsModalOpen(false);
      fetchPersons();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al dar de baja.', severity: 'error' });
    }
  };

  const handleDeleteRecordClick = (id) => {
    setSelectedId(id);
    setDeleteRecordDialogOpen(true);
  };

  const handleDeleteRecordConfirm = async () => {
    try {
      await axios.delete(`http://192.168.1.117:5000/record/${selectedId}`);
      setDetailData(prev => prev.filter(item => item.id !== selectedId));
      setSnackbar({ open: true, message: 'Registro eliminado.', severity: 'success' });
      setDeleteRecordDialogOpen(false);
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar.', severity: 'error' });
    }
  };

  const handleEditRecord = (row) => {
    setSelectedId(row.id);
    setEditRecordData(row);
    setEditRecordDialogOpen(true);
  };

  const handleEditRecordSave = async () => {
    try {
      await axios.put(`http://192.168.1.117:5000/record/${selectedId}`, editRecordData);
      setDetailData(prev => prev.map(r => r.id === editRecordData.id ? editRecordData : r));
      setSnackbar({ open: true, message: 'Registro editado.', severity: 'success' });
      setEditRecordDialogOpen(false);
    } catch {
      setSnackbar({ open: true, message: 'Error al editar.', severity: 'error' });
    }
  };

  const handleEditPerson = () => {
    setEditPersonData({
      firstName: selectedRow.firstName,
      lastName: selectedRow.lastName,
    });
    setEditPersonDialogOpen(true);
  };

  const handleEditPersonSave = async () => {
    try {
      await axios.put(`http://192.168.1.117:5000/person/${selectedRow.id}`, editPersonData);
      setSnackbar({ open: true, message: 'Persona editada.', severity: 'success' });
      setEditPersonDialogOpen(false);
      setIsModalOpen(false);
      fetchPersons();
    } catch {
      setSnackbar({ open: true, message: 'Error al editar persona.', severity: 'error' });
    }
  };

  return {
    persons,
    detailData,
    selectedRow,
    isModalOpen,
    snackbar,
    dialogs: {
      editPersonDialogOpen,
      editRecordDialogOpen,
      deleteRecordDialogOpen,
      disablePersonDialogOpen,
    },
    editPersonData,
    editRecordData,
    setEditPersonData,
    setEditRecordData,
    closeSnackbar,
    formatAmount,
    fetchPersons,
    handlers: {
      handleRowClick,
      handleCloseModal,
      handleDisablePersonClick,
      handleDisablePersonConfirm,
      handleDeleteRecordClick,
      handleDeleteRecordConfirm,
      handleEditRecord,
      handleEditRecordSave,
      handleEditPerson,
      handleEditPersonSave,
      setEditPersonDialogOpen,
      setEditRecordDialogOpen,
      setDeleteRecordDialogOpen,
      setDisablePersonDialogOpen,
    }
  };
};
