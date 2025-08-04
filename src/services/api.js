const API_BASE_URL = 'https://api.seusistema.com'; 

export const apiLogin = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error('Falha na autenticação');
  }
  return response.json();
};

export const apiGetRecords = async (startDate, endDate) => {
  const token = localStorage.getItem('authToken');
  
  let url = `${API_BASE_URL}/records`;
  if (startDate && endDate) {
    url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
  }

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Falha ao buscar registos');
  }
  return response.json();
};

export const apiCreateRecord = async (recordType) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: recordType,
      timestamp: new Date().toISOString(),
    }),
  });
  if (!response.ok) {
    throw new Error('Falha ao criar registo');
  }
  return response.json();
};

export const apiGetAllUsers = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Falha ao buscar utilizadores');
  }
  return response.json();
};