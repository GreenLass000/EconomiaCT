import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const FeedbackSnackbar = ({ snackbar, onClose }) => (
  <Snackbar
    open={snackbar.open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
      {snackbar.message}
    </Alert>
  </Snackbar>
);

export default FeedbackSnackbar;
