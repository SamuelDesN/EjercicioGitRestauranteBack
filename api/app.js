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
app.use(cors());


app.use(express.json());     


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);


app.get("/", (req, res) => {
    res.json({
        message: 'On',
    });
});


app.get("/api/users", async (req, res) => {

    const nombreUsuario = req.query.usuario;
    const contraseñaUsuario = req.query.contraseña;
    if(nombreUsuario==undefined||contraseñaUsuario==undefined){
      await client.connect();
      const database = client.db("restaurante");
      const usuarios = database.collection("usuarios");
      const user = await usuarios.findOne({ login: true});
      res.json({ message: "✅ Login exitoso", user });
    }
    else{
      try {
        await client.connect();
        const database = client.db("restaurante");
        const usuarios = database.collection("usuarios");
        usuarios.updateOne({nombre: nombreUsuario,password:contraseñaUsuario}, { $set: { login: true} });
        const user = await usuarios.findOne({ login: true});
    
        if (!user) {
          return res.status(401).json({ error: "❌ Usuario no encontrado" });
        }
        res.json({ message: "✅ Login exitoso", user });
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).json({ error: "Error al obtener los usuarios" });
      }
    }
  });
app.post("/api/users",async (res)=>{
  
  try {
    await client.connect();
    const database = client.db("restaurante");
    const usuarios = database.collection("usuarios");
    await usuarios.updateOne({login:true},{$set:{login:false}});
  } catch (error) {
    console.error("Error al cerrar la sesion del usuario:", error);
    res.status(500).json({
      message: "Error al cerrar la sesion del usuario",
      error: error.message,
    });
  }  
})
app.get("/api/mesas", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("restaurante");
    const mesas = database.collection("mesas");
    
    const lista_mesas = await mesas.find({}).toArray();

    res.json(lista_mesas);
  } catch (error) {
    console.error("Error al obtener las mesas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/api/pedidos", async (req, res) => {
  try {
    await client.connect();
    const database = client.db("restaurante");
    const pedidos = database.collection("pedidos");
    
    const lista_pedidos = await pedidos.find({}).toArray();

    res.json(lista_pedidos);
  } catch (error) {
    console.error("Error al obtener las mesas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


module.exports = app;
