const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MiP0Ddav1d',
    database: '5IV9',
    charset: 'utf8mb4'
});

con.connect((err) => {
    if (err) {
        console.error("No se pudo conectar a la base de datos", err);
        process.exit(1);
    }
    
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.post('/agregarUsuario', (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).send("Inserta el nombre");
    }

    const sql = 'INSERT INTO usuario (nombre) VALUES (?)';
    con.query(sql, [nombre], (err, result) => {
        if (err) {
            console.error("No se ha podido agregar el usuario", err);
            return res.status(500).send("No se ha podido agregar el usuario");
        }

        
        return res.send(`
            <h2>✅ Usuario agregado correctamente</h2>
            <p><strong>ID asignado:</strong> ${result.insertId}</p>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <a href="/">⬅️ Volver</a>
        `);
    });
});


app.get('/obtenerUsuario', (req, res) => {
    con.query('SELECT * FROM usuario', (err, resultados) => {
        if (err) {
            console.error("No se ha podido obtener el usuario:", err);
            return res.status(500).send("No se ha podido obtener el usuario");
        }

        let tablaHTML = `
        <h2>Lista de Usuarios</h2>
        <table border="1" cellpadding="5" cellspacing="0">
            <tr>
                <th>#</th>
                <th>ID</th>
                <th>Nombre</th>
            </tr>`;

        resultados.forEach((user, i) => {
            tablaHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${user.id_usuario}</td>
                <td>${user.nombre}</td>
            </tr>`;
        });

        tablaHTML += `</table><br><a href="/">⬅️ Volver</a>`;
        res.send(tablaHTML);
    });
});


app.post('/borrarUsuario', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send("Inserta el ID del usuario a borrar");
    }

    const sql = 'DELETE FROM usuario WHERE id_usuario = ?';
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error("No se ha podido borrar el usuario", err);
            return res.status(500).send("No se ha podido borrar el usuario");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("No se ha encontrado el usuario");
        }

        res.send(`Se ha eliminado correctamente el usuario con ID: ${id} .<br><a href="/">⬅️ Volver</a>`);
    });
});


const PORT = 10000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
