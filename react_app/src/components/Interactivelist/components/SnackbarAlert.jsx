import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarAlert = ({ snackbar, onClose }) => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={4000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity={snackbar.severity} sx={{ width: '100%' }}>
      {snackbar.message}
    </Alert>
  </Snackbar>
);

export default SnackbarAlert;
