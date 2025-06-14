const express = require('express');
const session = require('express-session');
const app = express();

const buses = [
  { id: 1, route: "City A - City B", time: "9:00 AM", price: 100, seats: 5 },
  { id: 2, route: "City C - City D", time: "2:00 PM", price: 150, seats: 3 }
];

const bookings = [];

const users = [
  { username: "student", password: "pass123" }
];

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: "bus-pass-secret",
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => res.render('index'));

app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
  const user = users.find(u => u.username === req.body.username && u.password === req.body.password);
  if (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.send("❌ Invalid credentials");
  }
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('dashboard', { user: req.session.user, buses });
});

app.get('/book/:id', (req, res) => {
  const bus = buses.find(b => b.id == req.params.id);
  res.render('payment', { bus });
});

app.post('/book/:id', (req, res) => {
  const bus = buses.find(b => b.id == req.params.id);
  if (bus && bus.seats > 0) {
    bus.seats -= 1;
    bookings.push({ bus: bus.route, user: req.session.user.username });
    res.send("✅ Booking Confirmed!");
  } else {
    res.send("🚫 No seats available.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚌 Running on port ${PORT}`));
