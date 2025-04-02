import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddPersonDialog from './components/AddPersonDialog';
import NewIncomeSpentDialog from './components/NewIncomeSpentDialog';
import GenerateReportDialog from './components/GenerateReportDialog';
import './menu_styles.css';

const ResponsiveAppBar = ({ onRefresh }) => {
    const [selectedDialog, setSelectedDialog] = useState(null);

    const handleItemClick = (index) => {
        setSelectedDialog(index);
    };

    const handleClose = () => {
        setSelectedDialog(null);
    };

    const handleNewPersonFormSubmit = (formData) => {
        handleClose();
    };

    const handleNewIncomeSpentFormSubmit = (formData) => {
        // Puedes hacer algo con formData si quieres
    };

    const handleNewIncomeSpentFinish = () => {
        if (typeof onRefresh === 'function') {
            onRefresh();
        }
        handleClose();
    };

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Economía Comunidad Terapéutica
                    </Typography>
                    <Button color="inherit" onClick={() => handleItemClick(0)}>Añadir Persona</Button>
                    <Button color="inherit" onClick={() => handleItemClick(1)}>Nuevo Ingreso/Gasto</Button>
                    <Button color="inherit" onClick={() => handleItemClick(2)}>Generar Reporte</Button>
                </Toolbar>
            </AppBar>

            <AddPersonDialog
                open={selectedDialog === 0}
                onClose={handleClose}
                onSubmit={handleNewPersonFormSubmit}
                onFinish={() => {
                    onRefresh();
                    handleClose();
                }}
                />

            <NewIncomeSpentDialog
                open={selectedDialog === 1}
                onClose={handleClose}
                onSubmit={handleNewIncomeSpentFormSubmit}
                onFinish={handleNewIncomeSpentFinish}
            />

            <GenerateReportDialog
                open={selectedDialog === 2}
                onClose={handleClose}
            />
        </>
    );
};

export default ResponsiveAppBar;
