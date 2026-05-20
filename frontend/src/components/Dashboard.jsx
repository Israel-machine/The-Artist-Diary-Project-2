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

      {!editingProject && (
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px', background: 'var(--code-bg)', padding: '20px', borderRadius: '6px' }}>
          <h3>Initialize New Project Ledger</h3>
          <input type="text" placeholder="Project Title (e.g., Marble Bust)" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '8px' }} />
          <input type="text" placeholder="Medium (e.g., Oil, Digital, Sculpting)" value={medium} onChange={e => setMedium(e.target.value)} style={{ padding: '8px' }} />
          <textarea placeholder="Target parameters, concepts, and scope notes..." value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '8px' }} />
          <button type="submit" className="counter" style={{ width: 'fit-content', margin: 0 }}>Create Entry</button>
        </form>
      )}

      <h3>Active Project</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {projects.map(project => (
          <div key={project.id} style={{ border: '1px solid var(--border)', padding: '20px', borderRadius: '6px', background: 'var(--bg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-h)' }}>{project.title}</h4>
              <span style={{ fontSize: '13px', background: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px' }}>{project.medium || 'Unspecified Medium'}</span>
              <p style={{ marginTop: '10px', fontSize: '15px', color: 'var(--text)' }}>{project.description || 'No description provided.'}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Link to={`/projects/${project.id}`} className="counter" style={{ textDecoration: 'none', margin: 0, fontSize: '14px' }}>View Logs</Link>
              <button onClick={() => setEditingProject(project)} className="counter" style={{ margin: 0, fontSize: '14px', background: 'none' }}>Edit</button>
              <button onClick={() => handleDelete(project.id)} className="counter" style={{ margin: 0, fontSize: '14px', background: 'none', color: 'red' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}