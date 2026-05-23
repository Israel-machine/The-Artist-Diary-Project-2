import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { token, BASE_URL } = useAuth();
  const [project, setProject] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State Creation Inputs
  const [date, setDate] = useState('');
  const [colorNotes, setColorNotes] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [error, setError] = useState('');

  // --- NEW UPDATE/EDIT STATE FOR SESSIONS ---
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editColors, setEditColors] = useState('');
  const [editPlaylist, setEditPlaylist] = useState('');

  const fetchWorkspaceDetails = async () => {
    try {
      const projRes = await fetch(`${BASE_URL}/projects/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!projRes.ok) throw new Error('Project footprint not found on backend');
      const projData = await projRes.json();
      setProject(projData);

      try {
        const sessRes = await fetch(`${BASE_URL}/projects/${id}/sessions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (sessRes.ok) {
          const sessData = await sessRes.json();
          setSessions(sessData);
        }
      } catch (sErr) { console.warn(sErr); }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkspaceDetails(); }, [id, token, BASE_URL]);

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date, color_notes: colorNotes, playlist_url: playlistUrl, duration_minutes: parseInt(durationMinutes, 10) })
      });
      if (!res.ok) throw new Error('Failed to record session entries.');
      setDate(''); setColorNotes(''); setPlaylistUrl(''); setDurationMinutes('');
      fetchWorkspaceDetails();
    } catch (err) { setError(err.message); }
  };

  // --- NEW SESSION PUT HANDLER ---
  const handleUpdateSession = async (e, sessionId) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: editDate,
          duration_minutes: parseInt(editDuration, 10),
          color_notes: editColors,
          playlist_url: editPlaylist
        })
      });
      if (!res.ok) throw new Error('Could not update timeline details.');
      setEditingSessionId(null);
      fetchWorkspaceDetails();
    } catch (err) { setError(err.message); }
  };

  const startEditingSession = (session) => {
    setEditingSessionId(session.id);
    setEditDate(session.date);
    setEditDuration(session.duration_minutes);
    setEditColors(session.color_notes || '');
    setEditPlaylist(session.playlist_url || '');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading project canvas...</div>;
  if (!project) return <div style={{ padding: '40px', textAlign: 'center' }}>Project not found. <Link to="/">Return Home</Link></div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
      <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to Dashboard</Link>
      
      <h1 style={{ marginTop: '10px', marginBottom: '5px' }}>{project.title}</h1>
      <p style={{ color: 'var(--text)', margin: '0 0 20px 0' }}>Medium: <strong>{project.medium}</strong></p>

      {error && <div style={{ color: 'red', margin: '15px 0' }}>⚠️ {error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
        
        <div>
          <h3>⏱️ Record Studio Session</h3>
          <form onSubmit={handleAddSession} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--social-bg)', padding: '20px', borderRadius: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Session Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Duration (Minutes)</label>
              <input type="number" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Swatch Helper</label>
              <input type="color" onChange={e => setColorNotes(p => p ? `${p} | Hex: ${e.target.value}` : `Hex: ${e.target.value}`)} style={{ width: '50px', height: '35px', cursor: 'pointer', marginBottom: '8px' }} />
              <textarea placeholder="Palette details..." value={colorNotes} onChange={e => setColorNotes(e.target.value)} style={{ width: '100%', padding: '8px', minHeight: '60px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Playlist Focus Link</label>
              <input type="url" value={playlistUrl} onChange={e => setPlaylistUrl(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" className="counter" style={{ cursor: 'pointer', marginTop: '10px' }}>Commit Session Details</button>
          </form>
        </div>

        <div>
          <h3>📜 Production Timeline Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {sessions.length === 0 ? (
              <p style={{ color: 'var(--text)', fontStyle: 'italic' }}>No session logs saved to this piece yet.</p>
            ) : (
              sessions.map(session => (
                <div key={session.id} style={{ padding: '15px', borderLeft: '4px solid var(--accent)', background: 'var(--code-bg)', borderRadius: '0 6px 6px 0' }}>
                  
                  {editingSessionId === session.id ? (
                    /* INLINE EDIT FOR A SINGLE TIMELINE BLOC */
                    <form onSubmit={(e) => handleUpdateSession(e, session.id)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} required />
                      <input type="number" value={editDuration} onChange={e => setEditDuration(e.target.value)} required />
                      <textarea value={editColors} onChange={e => setEditColors(e.target.value)} placeholder="Palette notes..." />
                      <input type="url" value={editPlaylist} onChange={e => setEditPlaylist(e.target.value)} placeholder="Playlist URL..." />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ background: '#28a745', color: '#fff', padding: '2px 6px', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => setEditingSessionId(null)} style={{ background: '#6c757d', color: '#fff', padding: '2px 6px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    /* VIEW LAYOUT MODE */
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>📅 {session.date}</span>
                        <code style={{ color: 'var(--accent)' }}>{session.duration_minutes} mins</code>
                      </div>
                      {session.color_notes && <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}><strong>Palette:</strong> {session.color_notes}</p>}
                      {session.playlist_url && <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>🎵 <a href={session.playlist_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Soundtrack</a></p>}
                      
                      <div style={{ textAlign: 'right', marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button onClick={() => startEditingSession(session)} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px' }}>Edit Log</button>
                        <button 
                          onClick={async () => {
                            if(!window.confirm("Delete this session entry?")) return;
                            try {
                              await fetch(`${BASE_URL}/sessions/${session.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                              fetchWorkspaceDetails();
                            } catch(err) { console.error(err); }
                          }} 
                          style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  )}

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}