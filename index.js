// Import Library yang digunakan
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("connect-flash");

const app = express();

// Definisi lokasi file router
const loginRoutes = require("./src/routes/router-login");
const registerRoutes = require("./src/routes/router-register");
const contactRoutes = require("./src/routes/router-contact");
const appRoutes = require("./src/routes/router-app");

// Konfigurasi library session
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "t@1k0ch3ng",
    name: "secretName",
    cookie: {
      sameSite: true,
      maxAge: 60000, // Sesuaikan dengan kebutuhan
    },
  })
);

// Konfigurasi dan gunakan library
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash()); // Gunakan connect-flash untuk pesan flash

// Set headers untuk menghindari caching
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.setHeader("Pragma", "no-cache");
  next();
});

// Konfigurasi static folder untuk public assets
app.use("/public", express.static(path.join(__dirname, "public")));

// Setting folder views dan view engine
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

// Rute untuk todos
app.get("/todos", (req, res) => {
  const url = "/"; // Atur URL dasar sesuai kebutuhan
  res.render("todos", { url }); // Kirim url ke template todos.ejs
});

// Route for the team page
app.get("/team", (req, res) => {
  res.render("team", { url }); // Pastikan mengirimkan variabel 'url' ke file ejs
});

app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/contact", contactRoutes);
app.use("/", appRoutes);

// Middleware untuk penanganan error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Gunakan port server
const PORT = process.env.PORT || 5051; // Menggunakan PORT dari environment atau default ke 5050
app.listen(PORT, () => {
  console.log(`Server Berjalan di Port: ${PORT}`);
});
