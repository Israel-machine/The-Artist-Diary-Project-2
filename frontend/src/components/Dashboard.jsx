import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { token, BASE_URL } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = () => {
    fetch(`${BASE_URL}/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setProjects(data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, [token, BASE_URL]);

  const handleCreateProject = async (e) => {
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
      if (!res.ok) throw new Error('Could not generate canvas footprint.');
      
      // Reset forms and update tracking UI
      setTitle('');
      setMedium('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div id="center">Loading studio space...</div>;

  return (
    <div id="center" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>Your Studio Dashboard</h1>

      <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <h3>🎨 Initialize New Artwork</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="text" placeholder="Artwork Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }} />
        <input type="text" placeholder="Medium (e.g., Oil, Acrylic, Digital)" value={medium} onChange={e => setMedium(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }} />
        <textarea placeholder="Creative notes, background details, or targets..." value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '8px' }} />
        <button type="submit" className="counter" style={{ cursor: 'pointer' }}>Commit Project</button>
      </form>

      <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {projects.map(project => (
          <div key={project.id} style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0' }}>{project.title}</h2>
              <span style={{ fontSize: '13px', background: 'var(--accent-bg)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '12px' }}>{project.medium}</span>
              <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--text)' }}>{project.description}</p>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Link to={`/projects/${project.id}`} className="counter" style={{ textDecoration: 'none', display: 'inline-block' }}>Open Log & Sessions →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}