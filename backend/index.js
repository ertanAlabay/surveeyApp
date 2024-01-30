/**
 * Ertan Osman ALABAY - 30.01.2024
 */


/**
 * express: Web sunucusu oluşturmada kullanıldı.
 * mysql: Database için kullanıldı.
 * cors: İstemci ve sunucu arasındaki iletişimden sorumlu(bunu yeni öğrendim çok hakim değilim.)
 * cookie-parse: Kullanıcının çerezleri işlemesi için kullanıldı.(bunu da yeni öğrendim)
 * jsonwebtoken: JWT işlemleri için kullanıldı(bu da yeni valla).
 * 
 * NOTE: Cors, cookie-parse ve jsonwebtoken için internetten araştırmalar yaptım. Bazı kaynakları olduğu gibi kullandım.
 * NOTE_2: frontend de bulunan axios da internette bulduğum araştırmalardan ve 
 *    hazır kaynaklardan kullandığım bazı kodları içeriyor. 
 */

import express from "express";
import mysql from "mysql";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

/**
 * Buradaki kodlar server-side'ı oluşturuyor. 
 * Database ve API işlemlerini burada gerçekleştiriyoruz.
 * Database bağlantısını XAMPP kontrol panelinden "Apache" ve "MySQL" serverlerını çalıştırarak gerçekleştirdim.
 */

//express uygulaması oluşturur.
const app = express();

//gelen JSON verilerini işler
app.use(express.json());

//http://localhost:3000 den gelen isteklere(POST, GET) izin veririmiş. 
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET"],
  credentials: true
}));

//gelen cookileri yönetmek için kullanılıyormuş.
app.use(cookieParser());

/**
 * MySQL dbsine bağlantı oluşturuyor.
 * Bağlantıyı XAMPP kontrol panelinden "Apache" ve "MySQL" çalıştırarak oluşturdum.
 */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "deneme"
});

/**
 * Bağlantını durumunu kontrol eder.
 * Bağlantı yoksa VS terminaline bilgilendirmede bulunur.
 */
db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

/** 
 * oluşturduğum sql değişkeni bir SQL komutu tutuyor. 
 * Bu komut db deki login tablosundan email ve password değerlerini arıyor.
 * Kullanıcı databaseye kayıtlı değilse uyarı verir.
 * kullanıcı databaseye kayıtlıysa 1 günlük bir Token oluşturuyor. 
*/
app.post('/login', (req, res) => {
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
      return res.json({ Message: "Kayıt bilgisi bulunamadı..." });
    }
  });
});

/**
 * Kayıt bilgisi bulunmayan kullanıcılara yeni kayıt oluşturur.
 * sql değişkeninde bulunan SQL kodu sayesinde db e veriler insert edilir.
 * Kayıt oluşmazsa uyarı verir, kayıt oluşursa "Success" döner.
 */
app.post('/register', (req, res) => { 
  const sql = "INSERT INTO login(`email`,`password`) VALUES (?,?)";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    console.log(err);
    if (err) {
      console.log("Kullanıcı veritabanına kaydedilemedi.")
      return res.json({ Message: "Kullaıncı kaydı oluşmadı. Tekrar deneyin." });
    }
    console.log("Kullanıcı başarıyla kaydedildi");
    return res.json({ Status: "Success" });
  });
});

/**
 * /login de oluşturduğumuz JWT'ı burada kontrol ediyoruz.
 * Kullanıcı Logout olduysa ya da bir hata nedeniyle token silindiyse
 * bu kısımda kullanıcıyı uyarıyoruz.
 *  
 */
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "Kimliğiniz doğrulanmadı." });
  } else {
    jwt.verify(token, "our-json-web-token-secretkey", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Jeton doğru değil" });
      } else {
        req.name = decoded.name;
        next();
      }
    })
  }
}

/**
 * Oluşturduğumuz tokeni silerek bir nevi logout yapmış oluyoruz.
 */
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: "Success" });
})

/**
 * verifyUser fonksiyonu Success dönerse ana sayfaya yönlendirilir.
 */
app.get('/', verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
})

/**
 * questions tablosundaki değerleri survay_id ye göre arayan kodu çalıştırır.
 */
app.get('/questions', (req, res) => {

  //query parametresi olarak surveyId'yi alır
  const { surveyId } = req.query; 

  // Gelen surveyId'si ile ilişkilendirilmiş soruları alır
  const getQuestionsQuery = 'SELECT * FROM questions WHERE survay_id = ?';

  db.query(getQuestionsQuery, [surveyId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const questionsWithOptions = results.map((question) => ({
        ...question,
        options: JSON.parse(question.options || '[]'), // soruları JSON şeklinde pars eder ya da boş bir dizi döner
      }));
      res.status(200).json(questionsWithOptions);
    }
  });
});

/**
 * Soru ekle sayfasında oluşturduğumuz soruları seçilen ankete eklemek için kullanılır.
 */
app.post('/create', (req, res) => {
  const { questions, surveyId } = req.body;

  // Gelen surveId'si ile ilişkilendirilmiş anket tablosundaki anketi alır
  const getSurveyQuery = 'SELECT * FROM survay WHERE id = ?';

  db.query(getSurveyQuery, [surveyId], (surveyError, surveyResults) => {
    
    // server durumunu kontrol eder. bağlantı sağlanmazsa hata veriri 
    if (surveyError) {
      console.error(surveyError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {

      // surveyId değerini bulmaması durumunda hata mesajı döner, 
      if (surveyResults.length === 0) {
        res.status(404).json({ error: 'Anket bulunamadı.' });
      } else {

        // İlişkilendirilmiş anket bulunursa soruları ekler.
        const insertQuestionsQuery = 'INSERT INTO questions (question, options, survay_id) VALUES ?';
        const values = questions.map((q) => [q.question, JSON.stringify(q.options), surveyId]);

        //INSERT işlemi durumunu belirten başarı mesajı ya da hata mesajı döner.
        db.query(insertQuestionsQuery, [values], (error) => {
          if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(200).json({ message: 'Sorular başarıyla ankete eklendi.' });
          }
        });
      }
    }
  });
});

/**
 * survey_response tablosunun içinde bulunandeğerleri döner.
 */
app.get('/survey-responses', (req, res) => {
  const query = 'SELECT * FROM survey_responses';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(results);
    }
  });
});

/**
 * Çözülen anketlerin cevaplarını survey_responses tablosuna ekler.
 * 
 */
app.post('/survey-responses', (req, res) => {
  
  const { surveyId, responses } = req.body;
  
  if (!surveyId || !responses || Object.keys(responses).length === 0) {
    return res.status(400).json({ error: 'Anket numarası ve yanıtlar gereklidir.' });
  }

  /**
   * surveyId  değerini survay tablosuyla, questionId değerini response tablosuyla ilişkilendirir. 
   * Bu ilişkilendirmede eksik varsa hata verir.
   * Hata yoksa kullanıcının cevaplarını survey_response tablosuna kayıt eder.
   **/ 
  const responseValues = Object.entries(responses).map(([questionId, response]) => [surveyId, questionId, response]);
  const insertResponseQuery = 'INSERT INTO survey_responses (survey_id, survey_question_id, response) VALUES ?';

  //db bağlantısında sorun yoksa onay mesajı, bağlantı yoksa hata mesajı verir.
  db.query(insertResponseQuery, [responseValues], (error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Anket yanıtları başarıyla kaydedildi.' });
    }
  });
});

/**
 * survay tablosundaki değerleri döner.
 */
app.get('/surveys', (req, res) => {
  const query = 'SELECT * FROM survay';

  // Bağlantı durumuna göre result değerini ya da hata mesajı döner.
  db.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(results);
    }
  });
});

/**
 * Kullanıcıdan aldığı name(anket ismi) ve explanation(açıklama) 
 * uygun olarak yeni anketi databaseye kaydeder.
 */
app.post('/addSurvey', (req, res) => {

  const { name, explanation } = req.body;

  if (!name || !explanation) {
    return res.status(400).json({ error: 'Lütfen anketin adını ve açıklamasını belirtin.' });
  }
  //databaseye kayır eklemek için kullandığım SQL kodu 
  const query = 'INSERT INTO survay (name, explanation) VALUES (?, ?)';

  // bağlantı durumuna göre kaydedildi mesajı ya da hata mesajı döner.
  db.query(query, [name, explanation], (error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Anket başarıyla kaydedildi.' });
    }
  });
});


/**
 * backendin hangi portta çalıştığını görmek için yaptım.
 */
app.listen(3001, () => {
  console.log("Running on http://localhost:3001");
});