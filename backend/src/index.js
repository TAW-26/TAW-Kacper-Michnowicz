const express = require('express');
const app = express();
app.use(express.json());

// przykładowe dane
let pitches = [{ id: 'A1', name: 'Boisko Orlik', status: 'available' }];
let reservations = [];
let users = []; // Role: 'guest', 'user', 'admin'

// autoryzacja
const checkRole = (role) => (req, res, next) => {
  const userRole = req.headers['x-role'] || 'guest';
  if (role.includes(userRole)) {
    next();
  } else {
    res.status(403).json({ error: "Brak uprawnień do tej akcji." });
  }
};

// UŻYTKOWNIK NIEZALOGOWANY

// Przeglądanie boisk
app.get('/api/pitches', (req, res) => {
  res.json(pitches);
});

// Rejestracja / Logowanie
app.post('/api/auth/register', (req, res) => {
  const { username } = req.body;
  users.push({ username, role: 'user' });
  res.status(201).json({ message: "Zarejestrowano pomyślnie" });
});

// UŻYTKOWNIK ZALOGOWANY

// Dokonywanie rezerwacji + Płatność online
app.post('/api/reservations', checkRole(['user', 'admin']), (req, res) => {
  const { pitchId, start, end } = req.body;

  const newRes = { id: Date.now(), pitchId, start, end, paid: false, userId: 'current-user' };

  newRes.paid = true;

  reservations.push(newRes);
  res.status(201).json({ message: "Zarezerwowano i opłacono", data: newRes });
});

// Anulowanie rezerwacji
app.delete('/api/reservations/:id', checkRole(['user', 'admin']), (req, res) => {
  const { id } = req.params;
  reservations = reservations.filter(r => r.id !== parseInt(id));
  res.json({ message: "Rezerwacja anulowana" });
});

// ADMINISTRATOR

// Zarządzanie obiektami
app.post('/api/admin/pitches', checkRole(['admin']), (req, res) => {
  const { name } = req.body;
  const newPitch = { id: `P${pitches.length + 1}`, name, status: 'available' };
  pitches.push(newPitch);
  res.status(201).json(newPitch);
});

// Zarządzanie grafikiem
app.patch('/api/admin/pitches/:id/schedule', checkRole(['admin']), (req, res) => {
  res.json({ message: "Grafik zaktualizowany" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`System działa zgodnie z modelem na porcie ${PORT}`));