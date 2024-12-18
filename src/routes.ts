import express, { Request, Response } from 'express';
import { pool } from './db';

const router = express.Router();

// Obtener todos los registros
router.get('/records', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM records');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

// Crear un nuevo registro
router.post('/records', async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO records (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el registro' });
  }
});

// Actualizar un registro existente
router.put('/records/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE records SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
});

// Eliminar un registro
router.delete('/records/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM records WHERE id = $1', [id]);
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

export default router;
