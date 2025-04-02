import { styled } from '@mui/system';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

export const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    width: '40%',
    maxWidth: 'none',
  },
});

export const StyledDialogActions = styled(DialogActions)({
  justifyContent: 'flex-start',
});
