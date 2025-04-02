import React, { useEffect } from 'react';
import './styles/interactivelist_styles.css';
import CustomTextBox from '../CustomTextBox';
import PersonTable from './components/PersonTable';
import PersonDetailDialog from './components/PersonDetailDialog';
import EditPersonDialog from './components/EditPersonDialog';
import EditRecordDialog from './components/EditRecordDialog';
import ConfirmDialog from './components/ConfirmDialog';
import SnackbarAlert from './components/SnackbarAlert';
import { usePersons } from './hooks/usePersons';

const InteractiveList = ({ refreshKey }) => {
  const {
    persons,
    detailData,
    selectedRow,
    isModalOpen,
    snackbar,
    dialogs,
    editPersonData,
    editRecordData,
    setEditPersonData,
    setEditRecordData,
    handlers,
    closeSnackbar,
    formatAmount,
    fetchPersons
  } = usePersons();

  useEffect(() => {
    fetchPersons();
  }, [refreshKey, fetchPersons]);

  return (
    <div className="grid-item">
      <CustomTextBox text="Gastos Personales Usuarios" />

      <PersonTable
        persons={persons}
        onRowClick={handlers.handleRowClick}
        formatAmount={formatAmount}
      />

      <PersonDetailDialog
        open={isModalOpen}
        row={selectedRow}
        detailData={detailData}
        formatAmount={formatAmount}
        onClose={handlers.handleCloseModal}
        onEditPerson={handlers.handleEditPerson}
        onDisablePerson={handlers.handleDisablePersonClick}
        onDeleteRecord={handlers.handleDeleteRecordClick}
        onEditRecord={handlers.handleEditRecord}
      />

      <EditPersonDialog
        open={dialogs.editPersonDialogOpen}
        data={editPersonData}
        setData={setEditPersonData}
        onClose={() => handlers.setEditPersonDialogOpen(false)}
        onSave={handlers.handleEditPersonSave}
      />

      <EditRecordDialog
        open={dialogs.editRecordDialogOpen}
        data={editRecordData}
        setData={setEditRecordData}
        onClose={() => handlers.setEditRecordDialogOpen(false)}
        onSave={handlers.handleEditRecordSave}
      />

      <ConfirmDialog
        open={dialogs.deleteRecordDialogOpen}
        title="¿Estás seguro?"
        content="Esta acción no se puede deshacer. Se eliminará permanentemente este registro."
        onClose={() => handlers.setDeleteRecordDialogOpen(false)}
        onConfirm={handlers.handleDeleteRecordConfirm}
      />

      <ConfirmDialog
        open={dialogs.disablePersonDialogOpen}
        title="¿Estás seguro?"
        content="Esta acción no se puede deshacer. Se dará de baja a esta persona."
        onClose={() => handlers.setDisablePersonDialogOpen(false)}
        onConfirm={handlers.handleDisablePersonConfirm}
      />

      <SnackbarAlert snackbar={snackbar} onClose={closeSnackbar} />
    </div>
  );
};

export default InteractiveList;
