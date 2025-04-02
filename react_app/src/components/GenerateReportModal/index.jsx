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
    handleSubmit, closeSnackbar
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

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !selectedPerson}
        >
          {loading ? <CircularProgress size={24} /> : 'Generar PDF'}
        </Button>
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
