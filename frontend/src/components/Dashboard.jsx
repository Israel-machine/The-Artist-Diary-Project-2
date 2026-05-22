import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
// 1. Destructure logout from your AuthContext hook
const { token, logout, BASE_URL } = useAuth(); 
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

// 2. Add the Delete Handler function
const handleDeleteProject = async (id) => {
  if (!window.confirm("Are you sure you want to scrub this project and all its session history?")) return;
  try {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Could not delete project footprint.');
    fetchProjects(); // Refresh UI layout
  } catch (err) {
    setError(err.message);
  }
};

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
    setTitle('');
    setMedium('');
    setDescription('');
    fetchProjects();
  } catch (err) { setError(err.message); }
};

if (loading) return <div id="center">Loading studio space...</div>;

return (
  <div id="center" style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
    {/* 3. Added Logout Button Header bar */}
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>Your Studio Dashboard</h1>
      <button onClick={logout} className="counter" style={{ background: '#ff4d4d', color: '#fff', cursor: 'pointer' }}>Leave Diary (Logout)</button>
    </div>

    <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <h3>🎨 Initialize New Artwork</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="text" placeholder="Artwork Title" value={title} onChange={e => setTitle(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }} />
      <input type="text" placeholder="Medium (e.g., Oil, Acrylic, Digital)" value={medium} onChange={e => setMedium(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)' }} />
      <textarea placeholder="Creative notes..." value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border)', minHeight: '60px' }} />
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
          {/* 4. Layout Controls with integrated Delete Hook */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to={`/projects/${project.id}`} className="counter" style={{ textDecoration: 'none', margin: 0 }}>Open Log →</Link>
            <button onClick={() => handleDeleteProject(project.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '14px' }}>Discard</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}