import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static("./loginpage"));
app.use(express.static("./verification"));
app.use(express.static('./userpage'));

app.use(express.json());

const secretKey = "sdZxW+<cGqRKX9-FauSty";

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/loginpage/login.html");
});

app.get("/user", (req, res) => {
    res.sendFile(__dirname + "/userpage/user.html");
});

app.get("/ArtigoTCC", (req, res) => {
    res.sendFile(__dirname + "/word/GustavoMon-TCC.docx");
});

app.get("/Verification", (req, res) => {
    res.sendFile(__dirname + "/verification/verification.html");
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader); // Debugging line
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.error('No token provided');
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}

app.listen(80, '0.0.0.0', () => {
    console.log("Servidor rodando!");
});