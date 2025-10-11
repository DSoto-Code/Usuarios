const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();

// 🔹 Conexión a la base de datos MySQL
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'MiP0Ddav1d',
    database: '5IV9',
    charset: 'utf8mb4' // ✅ Soporte completo para Unicode
});

// Conexión a MySQL
con.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar con la base de datos:", err);
        process.exit(1);
    }
    console.log("✅ Conexión exitosa a MySQL");
});

// 🔹 Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ===========================
//     AGREGAR USUARIO
// ===========================
app.post('/agregarUsuario', (req, res) => {
    const { id, nombre } = req.body;

    if (!id || !nombre) {
        return res.status(400).send("⚠️ Debes enviar un ID y un nombre.");
    }

    const sql = 'INSERT INTO usuario (id_usuario, nombre) VALUES (?, ?)';
    con.query(sql, [id, nombre], (err, result) => {
        if (err) {
            console.error("❌ Error al insertar usuario:", err);
            return res.status(500).send("Error al agregar el usuario.");
        }
        return res.send(`<h2>✅ Usuario agregado correctamente</h2>
                         <p><strong>ID:</strong> ${id}</p>
                         <p><strong>Nombre:</strong> ${nombre}</p>`);
    });
});

// ===========================
//     CONSULTAR USUARIOS
// ===========================
app.get('/obtenerUsuario', (req, res) => {
    con.query('SELECT * FROM usuario', (err, resultados) => {
        if (err) {
            console.error("❌ Error al obtener usuarios:", err);
            return res.status(500).send("Error al obtener usuarios.");
        }

        let tablaHTML = `
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

        tablaHTML += `</table>`;
        res.send(`<h2>📋 Lista de Usuarios</h2>${tablaHTML}`);
    });
});

// ===========================
//     BORRAR USUARIO
// ===========================
app.post('/borrarUsuario', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).send("⚠️ Debes enviar el ID del usuario a borrar.");
    }

    const sql = 'DELETE FROM usuario WHERE id_usuario = ?';
    con.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error al borrar usuario:", err);
            return res.status(500).send("Error al borrar el usuario.");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("⚠️ Usuario no encontrado.");
        }

        res.send(`✅ Usuario con ID ${id} eliminado correctamente.`);
    });
});

// ===========================
//     INICIAR SERVIDOR
// ===========================
const PORT = 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
