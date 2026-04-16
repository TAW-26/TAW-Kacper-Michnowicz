const express = require('express');
const mongoose = require('mongoose');
const Court = require('../models/Court');
const Reservation = require('../models/Reservation');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://user0:1234@cluster0.lo4yax1.mongodb.net/project?appName=Cluster0')



const JWT_SECRET = 'tajny_klucz_123';

// rejestracja
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const user = new User({ username, password, role });
    await user.save();
    res.status(201).json({ message: "Użytkownik zarejestrowany" });
  } catch (err) {
    res.status(400).json({ error: "Użytkownik już istnieje lub błąd danych" });
  }
});

// logowanie
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Błędny login lub hasło" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});


// klasa obsługi błędów
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const protect = (roles = []) => {
  return async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ error: "Brak dostępu. Zaloguj się." });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Brak uprawnień do tej akcji" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Nieprawidłowy token" });
    }
  };
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
app.get('/api/courts/:id', async (req, res, next) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) return next(new AppError('Nie znaleziono boiska o podanym ID', 404));
    res.status(200).json(court);
  } catch (err) {
    next(new AppError('Nieprawidłowy format ID', 400));
  }
});

// UŻYTKOWNIK ZALOGOWANY

// Dokonywanie rezerwacji + Płatność online
app.post('/api/reservations', protect(['user', 'admin']), async (req, res, next) => {
  try {
    const { courtId, start, end } = req.body;
    const startTime = new Date(start);
    const endTime = new Date(end);

    const conflict = await Reservation.findOne({
      courtId: courtId,
      $and: [
        { start: { $lt: endTime } },
        { end: { $gt: startTime } }
      ]
    });

    if (conflict) {
      return next(new AppError('Ten termin jest już zarezerwowany', 409));
    }

    const newRes = new Reservation({
      courtId,
      start: startTime,
      end: endTime,
      paid: true
    });

    await newRes.save();
    res.status(201).json({ message: "Zarezerwowano i opłacono", data: newRes });
  } catch (err) {
    next(err);
  }
});

// Anulowanie rezerwacji
app.delete('/api/reservations/:id', protect(['user', 'admin']), async (req, res) => {
  await Reservation.findByIdAndDelete(req.params.id);
  res.json({ message: "Rezerwacja anulowana" });
});

// ADMINISTRATOR

// Dodanie nowego obiektu
app.post('/api/admin/courts', protect(['admin']), async (req, res) => {
  const newCourt = new Court(req.body);
  await newCourt.save();
  res.status(201).json(newCourt);
});

// Aktualizacja obiektu
app.put('/api/admin/courts/:id', protect(['admin']), async (req, res, next) => {
  try {
    const updatedCourt = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourt) return next(new AppError('Nie znaleziono obiektu', 404));
    res.status(200).json(updatedCourt);
  } catch (err) {
    next(err);
  }
});

// Usuwanie obiektu
app.delete('/api/admin/courts/:id', protect(['admin']), async (req, res, next) => {
  try {
    const deleted = await Court.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new AppError('Nie znaleziono obiektu', 404));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Zarządzanie grafikiem
app.patch('/api/admin/courts/:id/schedule', protect(['admin']), (req, res) => {
  res.json({ message: "Grafik zaktualizowany" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`System działa na porcie ${PORT}`));