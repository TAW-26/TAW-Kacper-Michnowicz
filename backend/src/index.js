const express = require('express');
const app = express();
app.use(express.json());

// przykładowe dane
let pitches = [
    { id: 1, name: 'Boisko Orlik', status: 'available' },
    { id: 2, name: "Kort Tenisowy", status: 'available' }];
let reservations = [];
let users = []; // Role: 'guest', 'user', 'admin'


// klasa obsługi błędów
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// autoryzacja
const checkRole = (role) => (req, res, next) => {
  const userRole = req.headers['x-role'] || 'guest';
  if (role.includes(userRole)) {
    next();
  } else {
    res.status(403).json({ error: "Brak uprawnień do tej akcji." });
  }
};

// middleware do obsługi błędów
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Wewnętrzny błąd serwera'
  });
};

// UŻYTKOWNIK NIEZALOGOWANY

// Przeglądanie boisk
app.get('/api/pitches', (req, res) => {
  res.status(200).json(pitches);
});

// Pokaż obiekt o podanym id
app.get('/api/pitches/:id', (req, res, next) => {
  const pitch = pitches.find(p => p.id === parseInt(req.params.id));
  if (!pitch) return next(new AppError('Nie znaleziono boiska o podanym ID', 404));
  res.status(200).json(pitch);
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

// Dodanie obiektu
app.post('/api/admin/pitches', checkRole(['admin']), (req, res) => {
  const { name } = req.body;
  const newPitch = { id: `P${pitches.length + 1}`, name, status: 'available' };
  pitches.push(newPitch);
  res.status(201).json(newPitch);
});

// Aktualizacja obiektu
app.put('/api/admin/pitches/:id', checkRole(['admin']), (req, res, next) => {
  const index = pitches.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return next(new AppError('Nie znaleziono obiektu do aktualizacji', 404));

  pitches[index] = { ...pitches[index], ...req.body };
  res.status(200).json(pitches[index]);
});

// Zarządzanie grafikiem
app.patch('/api/admin/pitches/:id/schedule', checkRole(['admin']), (req, res) => {
  res.json({ message: "Grafik zaktualizowany" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`System działa na porcie ${PORT}`));