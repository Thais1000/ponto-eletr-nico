import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'https://api.seusistema.com';

// --- GERAÇÃO DE DADOS FALSOS ---

const generateMockData = () => {
  const today = new Date();
  const yesterday = new Date(new Date().setDate(today.getDate() - 1));
  const twoDaysAgo = new Date(new Date().setDate(today.getDate() - 2));

  return [
    { id: 1, type: 'Entrada', timestamp: new Date(twoDaysAgo.setHours(8, 5, 0)).toISOString() },
    { id: 2, type: 'Saída', timestamp: new Date(twoDaysAgo.setHours(17, 30, 0)).toISOString() },
    { id: 3, type: 'Entrada', timestamp: new Date(yesterday.setHours(8, 0, 0)).toISOString() },
    { id: 4, type: 'Saída', timestamp: new Date(yesterday.setHours(12, 15, 0)).toISOString() },
    { id: 5, type: 'Entrada', timestamp: new Date(yesterday.setHours(13, 10, 0)).toISOString() },
    { id: 6, type: 'Saída', timestamp: new Date(yesterday.setHours(17, 45, 0)).toISOString() },
    { id: 7, type: 'Entrada', timestamp: new Date(today.setHours(9, 0, 0)).toISOString() },
  ];
};

let mockRecords = generateMockData();

// Lista de utilizadores falsos
const mockUsers = [
  { id: 1, name: 'Thais Silva', username: 'testuser', role: 'user', email: 'thais.silva@email.com' },
  { id: 2, name: 'Admin Geral', username: 'adminuser', role: 'admin', email: 'admin.geral@podevim.com' },
  { id: 3, name: 'Carlos Pereira', username: 'carlos.p', role: 'user', email: 'carlos.pereira@email.com' },
  { id: 4, name: 'Beatriz Costa', username: 'bia.costa', role: 'user', email: 'beatriz.costa@email.com' },
];


// --- MANIPULADORES (HANDLERS) DA API ---

export const handlers = [

  // Endpoint de Login
  http.post(`${API_BASE_URL}/login`, async ({ request }) => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    const { username } = await request.json();

    if (username.toLowerCase() === 'testuser') {
      return HttpResponse.json({ 
        token: 'fake-jwt-token-for-user',
        user: { name: 'testuser', role: 'user' }
      });
    }
    
    if (username.toLowerCase() === 'adminuser') {
      return HttpResponse.json({
        token: 'fake-jwt-token-for-admin',
        user: { name: 'adminuser', role: 'admin' }
      });
    }

    return new HttpResponse(JSON.stringify({ message: 'Credenciais inválidas' }), { 
      status: 401, 
      headers: { 'Content-Type': 'application/json' }
    });
  }),

  // Endpoint para buscar todos os utilizadores (para o admin)
  http.get(`${API_BASE_URL}/users`, async () => {
    await new Promise(resolve => setTimeout(resolve, 600)); 
    return HttpResponse.json(mockUsers);
  }),

  // Endpoint para buscar registos de ponto
  http.get(`${API_BASE_URL}/records`, ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!startDate || !endDate) {
      const todayRecords = mockRecords.filter(r => new Date(r.timestamp).toDateString() === new Date().toDateString());
      return HttpResponse.json(todayRecords);
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredRecords = mockRecords.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= start && recordDate <= end;
    });

    return HttpResponse.json(filteredRecords);
  }),

  // Endpoint para criar um novo registo de ponto
  http.post(`${API_BASE_URL}/records`, async ({ request }) => {
    const newRecord = await request.json();
    const newId = Math.max(...mockRecords.map(r => r.id), 0) + 1;
    mockRecords.push({ ...newRecord, id: newId });
    return HttpResponse.json({ ...newRecord, id: newId }, { status: 201 });
  }),
];