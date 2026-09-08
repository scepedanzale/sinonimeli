require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("./db");

async function createUser() {
    const email = "melissartuso@gmail.com";
    const password = "$inonyM3l1_app";

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
    );


    process.exit();
}

createUser();
