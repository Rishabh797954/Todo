import { query } from '../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const todos = await query('SELECT * FROM todos');
      console.log('Todos:', todos);
      res.status(200).json(todos || []);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  } else if (req.method === 'POST') {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    try {
      const result = await query(
        'INSERT INTO todos (title, completed) VALUES (?, ?)',
        [title, false]
      );
      res.status(201).json({ id: result.insertId, title, completed: false });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add todo' });
    }
  } else if (req.method === 'PUT') {
    const { id, completed } = req.body;
    if (id === undefined || completed === undefined) {
      res.status(400).json({ error: 'ID and completed status are required' });
      return;
    }

    try {
      const result = await query(
        'UPDATE todos SET completed = ? WHERE id = ?',
        [completed, id]
      );
      res.status(200).json({ message: `Todo with ID ${id} updated successfully` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update todo' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ error: 'ID is required' });
      return;
    }

    try {
      const result = await query('DELETE FROM todos WHERE id = ?', [id]);
      res.status(200).json({ message: `Todo with ID ${id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


