require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");

const db = require("./db");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);


const synonymsRoutes = require("./routes/synonymsRoutes");


app.use("/synonyms", synonymsRoutes);

// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email e password obbligatorie",
            });
        }

        const [users] = await db.execute(
            "SELECT id, email, password FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Credenziali non valide",
            });
        }

        const user = users[0];

        const passwordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "Credenziali non valide",
            });
        }

        req.session.userId = user.id;

        return res.json({
            message: "Login effettuato",
            user: {
                id: user.id,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Errore del server",
        });
    }
});


// UTENTE LOGGATO
app.get("/me", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                message: "Non autenticato",
            });
        }

        const [users] = await db.execute(
            "SELECT id, email FROM users WHERE id = ?",
            [req.session.userId]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Utente non trovato",
            });
        }

        return res.json(users[0]);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Errore del server",
        });
    }
});


// LOGOUT
app.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Errore durante il logout",
            });
        }

        res.clearCookie("connect.sid");

        return res.json({
            message: "Logout effettuato",
        });
    });
});


app.listen(process.env.PORT || 3000, () => {
    console.log(
        `Server in ascolto sulla porta ${process.env.PORT || 3000}`
    );
});