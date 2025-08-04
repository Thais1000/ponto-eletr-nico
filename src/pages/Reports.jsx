import React, { useState } from 'react';
import { 
  Box, Container, Typography, Paper, AppBar, Toolbar, IconButton, Button, Grid, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Card, CardContent 
} from '@mui/material';
import { ArrowBack, Assessment, QueryBuilder, CalendarToday, Print, FileDownload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { apiGetRecords } from '../services/api';
import { CSVLink } from 'react-csv';

const calculateReportSummary = (records) => {
  if (!records || records.length === 0) {
    return { hours: 0, minutes: 0, workedDays: 0 };
  }
  let totalMilliseconds = 0;
  const entries = records.filter(r => r.type === 'Entrada').sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const exits = records.filter(r => r.type === 'Saída').sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  for (let i = 0; i < exits.length; i++) {
    if (entries[i]) {
      totalMilliseconds += new Date(exits[i].timestamp) - new Date(entries[i].timestamp);
    }
  }
  const hours = Math.floor(totalMilliseconds / 3600000);
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  const uniqueDays = new Set(records.map(r => new Date(r.timestamp).toDateString()));
  const workedDays = uniqueDays.size;
  return { hours, minutes, workedDays };
};

const Reports = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) return;
    setIsLoading(true);
    setSearched(true);
    setSummary(null);
    try {
      const data = await apiGetRecords(startDate, endDate);
      setReportData(data);
      setSummary(calculateReportSummary(data));
    } catch (error) {
      console.error("Erro ao gerar relatório", error);
    } finally {
      setIsLoading(false);
    }
  };

  const csvHeaders = [
    { label: "ID do Registo", key: "id" },
    { label: "Tipo", key: "type" },
    { label: "Data e Hora", key: "timestamp" }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Box className="printable-area" sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f0f2f5' }}>
        <AppBar className="non-printable" position="static" color="inherit" elevation={1}>
          <Toolbar>
            <IconButton onClick={() => navigate('/dashboard')} color="primary" sx={{ mr: 2 }}><ArrowBack /></IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Histórico e Relatórios</Typography>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          <Container maxWidth="lg">
            <Paper className="non-printable" elevation={3} sx={{ p: 3, mb: 4 }}>
               <Typography variant="h5" gutterBottom>Selecione um Período</Typography>
              <Grid container spacing={3} sx={{ mt: 1 }} alignItems="center">
                <Grid item xs={12} sm={5}><DatePicker label="Data de Início" value={startDate} onChange={setStartDate} slotProps={{ textField: { fullWidth: true } }} /></Grid>
                <Grid item xs={12} sm={5}><DatePicker label="Data de Fim" value={endDate} onChange={setEndDate} slotProps={{ textField: { fullWidth: true } }} minDate={startDate} /></Grid>
                <Grid item xs={12} sm={2}>
                  <Button variant="contained" startIcon={<Assessment />} onClick={handleGenerateReport} disabled={!startDate || !endDate || isLoading} fullWidth sx={{ height: '56px' }}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Gerar'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
            ) : searched && (
              <>
                <Box className="non-printable" sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" startIcon={<Print />} onClick={handlePrint} disabled={reportData.length === 0}>Imprimir</Button>
                  <CSVLink data={reportData} headers={csvHeaders} filename={`relatorio_ponto_${new Date().toLocaleDateString('pt-BR')}.csv`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" startIcon={<FileDownload />} disabled={reportData.length === 0}>Exportar para CSV</Button>
                  </CSVLink>
                </Box>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Card sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>Resumo do Período</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}><QueryBuilder sx={{ mr: 1.5, color: 'text.secondary' }} /><Typography variant="body1">Total de Horas:</Typography><Typography variant="body1" sx={{ ml: 'auto', fontWeight: 'bold' }}>{summary ? `${summary.hours}h ${summary.minutes}m` : '-'}</Typography></Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}><CalendarToday sx={{ mr: 1.5, color: 'text.secondary' }} /><Typography variant="body1">Dias Trabalhados:</Typography><Typography variant="body1" sx={{ ml: 'auto', fontWeight: 'bold' }}>{summary ? summary.workedDays : '-'}</Typography></Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Card>
                      <CardContent>
                        {reportData.length > 0 ? (
                          <TableContainer><Table size="small"><TableHead><TableRow><TableCell>Tipo</TableCell><TableCell align="right">Data e Hora</TableCell></TableRow></TableHead><TableBody>{reportData.map((record) => (<TableRow key={record.id}><TableCell>{record.type}</TableCell><TableCell align="right">{new Date(record.timestamp).toLocaleString('pt-BR')}</TableCell></TableRow>))}</TableBody></Table></TableContainer>
                        ) : (
                          <Typography sx={{ textAlign: 'center', color: 'text.secondary', p: 4 }}>Nenhum registo encontrado para o período selecionado.</Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </>
            )}
          </Container>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;