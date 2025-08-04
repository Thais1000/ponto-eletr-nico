import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, CircularProgress, Box 
} from '@mui/material';

// --- NOVO: Componente de Ilustração (SVG embutido) ---
const EmptyStateIllustration = () => (
  <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#e0e0e0"/>
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#bdbdbd"/>
  </svg>
);
// --- FIM DA ILUSTRAÇÃO ---

const TimeRecordList = ({ records, isLoading }) => {
  if (isLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
    );
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        Meus Registos de Ponto
      </Typography>
      {/* LÓGICA ATUALIZADA PARA O ESTADO VAZIO */}
      {records.length === 0 ? (
        <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
          <EmptyStateIllustration />
          <Typography sx={{ mt: 2 }}>
            Nenhum registo encontrado para hoje.
          </Typography>
          <Typography variant="body2">
            O seu primeiro registo do dia aparecerá aqui.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell align="right">Data e Hora</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Typography component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: record.type === 'Entrada' ? 'success.main' : 'error.main' }}>
                       {record.type === 'Entrada' ? '✅' : '❌'} {record.type}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{new Date(record.timestamp).toLocaleString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default TimeRecordList;