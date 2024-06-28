import React, { useState } from 'react';
import { styled } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import NewPersonModal from '../../modals/newperson';
import NewIncomeSpentModal from '../../modals/newincomespent';
import "./menu_styles.css";

const ResponsiveAppBar = () => {
  const pages = ['Añadir Persona', 'Nuevo Ingreso/Gasto'];

  const [selectedDialog, setSelectedDialog] = useState(null);

  const handleItemClick = (index) => {
    setSelectedDialog(index);
  };

  const handleClose = () => {
    setSelectedDialog(null);
  };

  const handleNewPersonFormSubmit = (formData) => {
    // console.log('Formulario enviado:', formData);
    handleClose();
  };

  const handleNewIncomeSpentFormSubmit = (formData) => {
    // console.log('Formulario enviado:', formData);
    handleClose();
  };

  const StyledDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
      width: '40%',
      maxWidth: 'none',
    },
  });

  const StyledDialogActions = styled(DialogActions)({
    justifyContent: 'flex-start',
  });

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Economía Comunidad Terapéutica
          </Typography>
          {pages.map((item, index) => (
            <Button
              key={index}
              color="inherit"
              onClick={() => handleItemClick(index)}
            >
              {item}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      {/* Dialogs */}
      <StyledDialog open={selectedDialog === 0} onClose={handleClose}>
        <DialogTitle>Añadir Persona</DialogTitle>
        <DialogContent>
          <NewPersonModal onSubmit={handleNewPersonFormSubmit} />
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </StyledDialogActions>
      </StyledDialog>

      <StyledDialog open={selectedDialog === 1} onClose={handleClose}>
        <DialogTitle>Nuevo Ingreso/Gasto</DialogTitle>
        <DialogContent>
          <NewIncomeSpentModal onSubmit={handleNewIncomeSpentFormSubmit} />
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </StyledDialogActions>
      </StyledDialog>

      <StyledDialog open={selectedDialog === 2} onClose={handleClose}>
        <DialogTitle>Lista de gastos</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Lista de todos los gastos.</Typography>
        </DialogContent>
        <StyledDialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </StyledDialogActions>
      </StyledDialog>
    </>
  );
};

export default ResponsiveAppBar;
