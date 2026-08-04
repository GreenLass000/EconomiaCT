import React from 'react';
import { Stack, Button, CircularProgress } from '@mui/material';
import DateRangeFields from './components/DateRangeFields';
import PersonSelector from './components/PersonSelector';
import SnackbarAlert from './components/SnackbarAlert';
import { useGenerateReport } from './hooks/useGenerateReport';

const GenerateReportModal = () => {
  const {
    persons, selectedPerson, startDate, endDate,
    loading, snackbar,
    setSelectedPerson, setStartDate, setEndDate,
    handlePdfSubmit, handleExcelSubmit, closeSnackbar
  } = useGenerateReport();

  return (
    <>
      <Stack spacing={2}>
        <PersonSelector
          persons={persons}
          value={selectedPerson}
          onChange={setSelectedPerson}
        />

        <DateRangeFields
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            onClick={handlePdfSubmit}
            disabled={loading || !selectedPerson}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Generar PDF'}
          </Button>
          <Button
            variant="outlined"
            onClick={handleExcelSubmit}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Generar Excel'}
          </Button>
        </Stack>
      </Stack>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
    </>
  );
};

export default GenerateReportModal;
