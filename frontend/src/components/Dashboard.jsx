import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { token, BASE_URL } = useAuth();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState('');
  const [description, setDescription] = useState('');
  
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, [token, BASE_URL]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, medium, description })
      });
      const data = await res.json();
      if (res.ok) {
        setProjects([...projects, { id: data.id, title, medium, description }]);
        setTitle(''); setMedium(''); setDescription('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProject)
      });
      if (res.ok) {
        setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
        setEditingProject(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project and all associated logs?")) return;
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      <h2>Studio Workbench</h2>

      {editingProject && (
        <div style={{ background: 'var(--code-bg)', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid var(--accent)' }}>
          <h3>Edit Project Matrix</h3>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} required style={{ padding: '8px' }}/>
            <input type="text" value={editingProject.medium || ''} onChange={e => setEditingProject({...editingProject, medium: e.target.value})} style={{ padding: '8px' }}/>
            <textarea value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} style={{ padding: '8px' }}/>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="counter" style={{ margin: 0 }}>Save Changes</button>
              <button type="button" className="counter" onClick={() => setEditingProject(null)} style={{ margin: 0, background: 'none', color: 'var(--text)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      
  );
}