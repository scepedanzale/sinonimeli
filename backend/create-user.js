require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("./db");

async function createUser() {
    const email = "test@test.it";
    const password = "password123";

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
    );

    console.log("Utente creato");

    process.exit();
}

createUser();