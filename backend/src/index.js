const express = require('express');
const mongoose = require('mongoose');
const Court = require('../models/Court');
const Reservation = require('../models/Reservation');
const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://user0:1234@cluster0.lo4yax1.mongodb.net/project?appName=Cluster0')


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
app.get('/api/courts', async (req, res) => {
  const allCourts = await Court.find();
  res.status(200).json(allCourts);
});

// Pokaż obiekt o podanym id
app.get('/api/courts/:id', (req, res, next) => {
  const court = courts.find(p => p.id === parseInt(req.params.id));
  if (!court) return next(new AppError('Nie znaleziono boiska o podanym ID', 404));
  res.status(200).json(court);
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
  const { courtId, start, end } = req.body;

  const newRes = { id: Date.now(), courtId, start, end, paid: false, userId: 'current-user' };

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

// Dodanie nowego obiektu
app.post('/api/admin/courts', checkRole(['admin']), (req, res) => {
  const { name } = req.body;

  const newCourt = { id: courts.length + 1, name, status: 'available' };
  courts.push(newCourt);
  res.status(201).json(newCourt);
});

// Aktualizacja obiektu
app.put('/api/admin/courts/:id', checkRole(['admin']), (req, res, next) => {
  const index = courts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return next(new AppError('Nie znaleziono obiektu do aktualizacji', 404));

  courts[index] = { ...courts[index], ...req.body };
  res.status(200).json(courts[index]);
});

app.delete('/api/admin/courts/:id', checkRole(['admin']), (req, res, next) => {
  const index = courts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return next(new AppError('Nie można usunąć – obiekt nie istnieje', 404));

  courts.splice(index, 1);
  res.status(204).send();
});

// Zarządzanie grafikiem
app.patch('/api/admin/courts/:id/schedule', checkRole(['admin']), (req, res) => {
  res.json({ message: "Grafik zaktualizowany" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`System działa na porcie ${PORT}`));