import React, { useState, useEffect } from "react";
import {
	TextField,
	Button,
	MenuItem,
	Stack,
	CircularProgress,
	Snackbar,
	Alert
} from "@mui/material";

const GenerateReportModal = () => {
	const [persons, setPersons] = useState([]);
	const [selectedPerson, setSelectedPerson] = useState("");
	const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
	const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

	useEffect(() => {
		fetch('/persons/active')
			.then(response => response.json())
			.then(data => setPersons(data));
	}, []);

	const handleSubmit = async () => {
		if (!selectedPerson || !startDate || !endDate) return;

		setLoading(true);
		try {
			const query = new URLSearchParams({
				person_id: selectedPerson,
				start_date: startDate,
				end_date: endDate
			});
			const response = await fetch(`/report?${query.toString()}`);
			if (!response.ok) {
				throw new Error("Error al generar el reporte");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;

			const person = persons.find(person => person.id === selectedPerson);
			const filename = `${person.firstName}_${person.lastName}_report.pdf`;
			a.download = filename;

			document.body.appendChild(a);
			a.click();
			a.remove();
		} catch (error) {
			console.error(error);
			setSnackbar({ open: true, message: 'Error al generar el reporte', severity: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Stack spacing={2}>
				<TextField
					select
					label="Seleccionar Persona"
					value={selectedPerson}
					onChange={(e) => setSelectedPerson(e.target.value)}
					fullWidth
				>
					{persons.map((p) => (
						<MenuItem key={p.id} value={p.id}>
							{p.firstName} {p.lastName}
						</MenuItem>
					))}
				</TextField>

				<TextField
					label="Fecha Inicio"
					type="date"
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					InputLabelProps={{ shrink: true }}
					fullWidth
				/>

				<TextField
					label="Fecha Fin"
					type="date"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					InputLabelProps={{ shrink: true }}
					fullWidth
				/>

				<Button
					variant="contained"
					onClick={handleSubmit}
					disabled={loading || !selectedPerson}
				>
					{loading ? <CircularProgress size={24} /> : 'Generar PDF'}
				</Button>
			</Stack>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default GenerateReportModal;
