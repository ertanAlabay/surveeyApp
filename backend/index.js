import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "deneme"
});

app.post('/login', (req, res) => { // <-- req ve res sırası düzeltilmiş
  const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    console.log(err);
    if (err) {
      return res.json({ Message: "Server Side Error" });
    }

    if (data.length > 0) {
      const name = data[0].name;
      const token = jwt.sign({ name }, "our-json-web-token-secretkey", { expiresIn: '1D' });
      res.cookie('token', token);
      return res.json({ Status: "Success" });

    } else {
      console.log("Kullanıcı bilgisi yok.")
      return res.json({ Message: "No Record Existing" });
    }
  });
});

app.post('/register', (req, res) => { // <-- req ve res sırası düzeltilmiş
  const sql = "INSERT INTO login(`email`,`password`) VALUES (?,?)";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    console.log(err);
    if (err) {
      console.log("Kullanıcı veritabanına kaydedilemedi.")
      return res.json({ Message: "Inserting data error in server" });
    }
    console.log("Kullanıcı başarıyla kaydedildi");
    return res.json({Status: "Success"});

  /*const values = [
    req.body.email,
    req.body.password
  ]*/
  });
});
 
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    return res.json({ Error: "You are not authenticated." });
  } else {
    jwt.verify(token, "our-json-web-token-secretkey", (err, decoded) =>{
      if(err){
        return res.json({ Error: "Token is not correct" });
      } else {
        req.name = decoded.name; 
        next();
      }
    })
  }
}

app.get('/', verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name});
})


app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({Status: "Success"});
})

app.listen(3001, () => {
  console.log("Running on http://localhost:3001");
});