import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { token, BASE_URL } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/projects/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to capture project data');
        return res.json();
      })
      .then(data => setProject(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id, token, BASE_URL]);

  if (loading) return <div id="center">Analyzing canvas...</div>;
  if (!project) return <div id="center"><h3>Project workspace not found.</h3><Link to="/">Back to Studio</Link></div>;

  return (
    <div id="center" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', alignItems: 'flex-start', textAlign: 'left' }}>
      <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none', marginBottom: '10px' }}>← Return to Dashboard</Link>
      <h1>{project.title}</h1>
      <code>ID: {id}</code>
      <p style={{ marginTop: '20px', fontSize: '20px', lineHeight: '1.6' }}>{project.description}</p>
    </div>
  );
}