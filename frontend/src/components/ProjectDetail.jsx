import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { token, BASE_URL } = useAuth();
  
  const [project, setProject] = useState(null);
  const [sessions, setSessions] = useState([]);
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [colorNotes, setColorNotes] = useState('#aa3bff'); 
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(allProjects => {
        const current = allProjects.find(p => p.id === parseInt(id));
        setProject(current);
      });

    fetch(`${BASE_URL}/projects/${id}/sessions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(err => console.error(err));
  }, [id, token, BASE_URL]);

  const handleLogSession = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date, color_notes: colorNotes, playlist_url: playlistUrl, duration_minutes: durationMinutes })
      });
      const data = await res.json();
      if (res.ok) {
        setSessions([...sessions, { id: data.id, date, color_notes: colorNotes, playlist_url: playlistUrl, duration_minutes: parseInt(durationMinutes) }]);
        setPlaylistUrl('');
        setDurationMinutes('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Remove this studio timeline log?")) return;
    try {
      const res = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!project) return <p style={{ padding: '20px' }}>Loading Studio Context Ledger parameters...</p>;

  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '15px' }}>← Return to Workbench</Link>
      
      <div style={{ margin: '20px 0', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <h1>{project.title}</h1>
        <p style={{ color: 'var(--text)' }}><strong>Medium Canvas:</strong> {project.medium}</p>
        <p style={{ color: 'var(--text)', marginTop: '5px' }}>{project.description}</p>
      </div>

      <form onSubmit={handleLogSession} style={{ background: 'var(--code-bg)', padding: '20px', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
        <h3>Log New Studio Session Track</h3>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Session Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ flex: '1' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Duration (Minutes)</label>
            <input type="number" placeholder="90" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Dominant Substrate Palette Color</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              type="color" 
              value={colorNotes} 
              onChange={e => setColorNotes(e.target.value)} 
              style={{ padding: '0', width: '40px', height: '40px', border: 'none', cursor: 'pointer', background: 'none' }}
            />
            <input 
              type="text" 
              value={colorNotes} 
              onChange={e => setColorNotes(e.target.value)}
              placeholder="#ffffff"
              style={{ padding: '8px', width: '120px' }}
            />
            <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: colorNotes, border: '1px solid var(--border)' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Audio Accompaniment Stream (URL)</label>
          <input type="url" placeholder="https://open.spotify.com/playlist/..." value={playlistUrl} onChange={e => setPlaylistUrl(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>

        <button type="submit" className="counter" style={{ width: 'fit-content', margin: '10px 0 0 0' }}>Commit Session Log</button>
      </form>

      <h3>Chronological Session Timeline</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
        {sessions.length === 0 ? <p style={{ color: 'var(--text)' }}>No tracking periods documented for this target workspace.</p> : null}
        {sessions.map(session => (
          <div key={session.id} style={{ padding: '15px', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)' }}>
            <div>
              <strong style={{ color: 'var(--text-h)' }}>{session.date}</strong> — <span>{session.duration_minutes} Mins active tracing</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '14px' }}>
                <span>Swatches logged:</span>
                <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: session.color_notes, border: '1px solid #ccc' }}></span>
                <code>{session.color_notes}</code>
              </div>

              {session.playlist_url && (
                <a href={session.playlist_url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--accent)', display: 'block', marginTop: '6px' }}>
                  🎵 Launch Connected Audio Context
                </a>
              )}
            </div>
            <button onClick={() => handleDeleteSession(session.id)} className="counter" style={{ margin: 0, padding: '4px 8px', color: 'red', background: 'none', fontSize: '13px' }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}