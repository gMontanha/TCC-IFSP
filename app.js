import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRouter from './routes/users.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.static("./loginpage"));
app.use(express.static("./verification"));
app.use(express.static("./userpage"));
app.use(express.json());

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

const secretKey = process.env.SECRET_KEY;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/loginpage/login.html");
});

app.get("/ArtigoTCC", (req, res) => {
    res.sendFile(__dirname + "/word/GustavoMon-TCC.docx");
});

app.get('/auth-check', authenticateToken, (req, res) => {
    res.sendStatus(200);
});

app.post('/login', (req, res) => {
    let token = req.headers['authorization'];
    token = token.split(' ')[1];

    res.cookie('authToken', token, { httpOnly: true, secure: false }); //Para HTTPS4
    res.sendStatus(200);
});

app.get("/Verification", (req, res) => {
    res.sendFile(__dirname + "/verification/verification.html");
});

app.use("/user", userRouter);

// Middleware para autenticar token
function authenticateToken(req, res, next) {
    let token = req.headers['authorization'];
    token = token ? token.split(' ')[1] : req.cookies.authToken;

    if (!token) {
        console.error('No token provided');
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error('Invalid token');
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        //console.log(req.user);
        next();
    });
}

app.listen(80, '0.0.0.0', () => {
    console.log("Servidor rodando!");
});

export { authenticateToken };