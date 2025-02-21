const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const dotenv=require("dotenv")
const { MongoClient } = require('mongodb');
dotenv.config();


const middlewares = require('./middlewares');  

const app = express();

app.use(morgan('dev'));      
app.use(helmet());           
//app.use(cors());
app.use(cors({
    origin: "http://localhost/"
}));

app.use(express.json());     


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);


app.get("/", (req, res) => {
    res.json({
        message: 'On',
    });
});


app.get("/api/users", async (req, res) => {
    const nombreUsuario = req.body.usuario;
    const contraseñaUsuario = req.body.contraseña;
    
    try {
      await client.connect();
      const database = client.db("restaurante");
      const usuarios = database.collection("usuarios");
  
      // Buscar el usuario por su nombre
      const user = await usuarios.findOne({ usuario: nombreUsuario});
      console.log(user);
  
      if (!user) {
        return res.status(401).json({ error: "❌ Usuario no encontrado" });
      }
  
      if (user.password !== contraseñaUsuario) {
        return res.status(401).json({ error: "❌ Contraseña incorrecta" });
      }
  
      res.json({ message: "✅ Login exitoso", user });
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      res.status(500).json({ error: "Error al obtener los usuarios" });
    } finally {
      
      await client.close();
    }
  });




app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


module.exports = app;
