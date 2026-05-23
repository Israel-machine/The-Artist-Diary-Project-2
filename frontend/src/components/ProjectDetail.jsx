import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { token, BASE_URL } = useAuth();
  const [project, setProject] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [date, setDate] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [error, setError] = useState('');

  
  const [sessionColors, setSessionColors] = useState([]); 
  const [pickerColor, setPickerColor] = useState('#00f0ff');
  const [textNotes, setTextNotes] = useState(''); // New text area state

  
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editColors, setEditColors] = useState([]); 
  const [editPlaylist, setEditPlaylist] = useState('');
  const [editTextNotes, setEditTextNotes] = useState(''); 

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

  const addColorSwatch = () => {
    if (!sessionColors.includes(pickerColor)) {
      setSessionColors([...sessionColors, pickerColor]);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      
      const combinedPayload = JSON.stringify({
        colors: sessionColors,
        notes: textNotes
      });

      const res = await fetch(`${BASE_URL}/projects/${id}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          date, 
          color_notes: combinedPayload, 
          playlist_url: playlistUrl, 
          duration_minutes: parseInt(durationMinutes, 10) 
        })
      });
      if (!res.ok) throw new Error('Failed to record session entries.');
      
      // Reset form fields
      setDate(''); 
      setSessionColors([]); 
      setTextNotes('');
      setPlaylistUrl(''); 
      setDurationMinutes('');
      fetchWorkspaceDetails();
    } catch (err) { setError(err.message); }
  };

  const handleUpdateSession = async (e, sessionId) => {
    e.preventDefault();
    try {
      const combinedPayload = JSON.stringify({
        colors: editColors,
        notes: editTextNotes
      });

      const res = await fetch(`${BASE_URL}/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: editDate,
          duration_minutes: parseInt(editDuration, 10),
          color_notes: combinedPayload,
          playlist_url: editPlaylist
        })
      });
      if (!res.ok) throw new Error('Could not update timeline details.');
      setEditingSessionId(null);
      fetchWorkspaceDetails();
    } catch (err) { setError(err.message); }
  };

  const parseSessionData = (rawString) => {
    try {
      const parsed = JSON.parse(rawString);
      return {
        colors: parsed.colors || [],
        notes: parsed.notes || ""
      };
    } catch (e) {
      
      if (rawString && rawString.startsWith('#')) {
        return { colors: rawString.split(',').filter(Boolean), notes: "" };
      }
      return { colors: [], notes: rawString || "" };
    }
  };

  const startEditingSession = (session) => {
    const parsedData = parseSessionData(session.color_notes);
    setEditingSessionId(session.id);
    setEditDate(session.date);
    setEditDuration(session.duration_minutes);
    setEditColors(parsedData.colors);
    setEditTextNotes(parsedData.notes);
    setEditPlaylist(session.playlist_url || '');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading project canvas...</div>;
  if (!project) return <div style={{ padding: '40px', textAlign: 'center' }}>Project not found. <Link to="/">Return Home</Link></div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
    <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to Dashboard</Link>
  
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', marginBottom: '5px' }}>
      <h1 style={{ margin: 0 }}>{project.title}</h1>
      
      <div style={{ 
        background: 'var(--accent-bg)', 
        border: '1px solid var(--accent-border)', 
        color: 'var(--accent)', 
        padding: '8px 16px', 
        borderRadius: '20px', 
        fontWeight: 'bold',
        fontSize: '15px'
      }}>
        ⏱️ Total Time: {
          sessions.reduce((total, session) => total + (session.duration_minutes || 0), 0)
        } mins
      </div>
    </div>

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
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Session Color Swatches</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <input type="color" value={pickerColor} onChange={e => setPickerColor(e.target.value)} style={{ width: '45px', height: '35px', cursor: 'pointer', border: 'none', padding: 0 }} />
                <button type="button" onClick={addColorSwatch} style={{ padding: '6px 12px', cursor: 'pointer', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>+ Add Color</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '30px', padding: '8px', background: 'var(--code-bg)', borderRadius: '4px', marginBottom: '12px' }}>
                {sessionColors.length === 0 && <span style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>No colors picked yet</span>}
                {sessionColors.map(hex => (
                  <div key={hex} title="Click to remove" onClick={() => setSessionColors(sessionColors.filter(c => c !== hex))} style={{ width: '24px', height: '24px', backgroundColor: hex, borderRadius: '50%', cursor: 'pointer', border: '2px solid #fff' }} />
                ))}
              </div>
            </div>

            
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Session & Palette Notes</label>
              <textarea 
                placeholder="Describe your progress, texture alterations, or dry time experiences..." 
                value={textNotes} 
                onChange={e => setTextNotes(e.target.value)} 
                style={{ width: '100%', padding: '8px', minHeight: '80px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid var(--border)' }} 
              />
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
              sessions.map(session => {
                
                const parsedData = parseSessionData(session.color_notes);

                return (
                  <div key={session.id} style={{ padding: '15px', borderLeft: '4px solid var(--accent)', background: 'var(--code-bg)', borderRadius: '0 6px 6px 0' }}>
                    
                    {editingSessionId === session.id ? (
                      
                      <form onSubmit={(e) => handleUpdateSession(e, session.id)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} required />
                        <input type="number" value={editDuration} onChange={e => setEditDuration(e.target.value)} required />
                        
                        <div>
                          <label style={{ fontSize: '12px' }}>Edit Swatches (Click to delete):</label>
                          <div style={{ display: 'flex', gap: '6px', margin: '5px 0' }}>
                            {editColors.map(hex => (
                              <div key={hex} onClick={() => setEditColors(editColors.filter(c => c !== hex))} style={{ width: '20px', height: '20px', backgroundColor: hex, borderRadius: '50%', cursor: 'pointer', border: '1px solid #fff' }} />
                            ))}
                          </div>
                          <input type="color" onChange={e => { if(!editColors.includes(e.target.value)) setEditColors([...editColors, e.target.value]) }} />
                        </div>

                        <textarea value={editTextNotes} onChange={e => setEditTextNotes(e.target.value)} placeholder="Update session details..." />

                        <input type="url" value={editPlaylist} onChange={e => setEditPlaylist(e.target.value)} placeholder="Playlist URL..." />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" style={{ background: '#28a745', color: '#fff', padding: '2px 6px', cursor: 'pointer' }}>Save</button>
                          <button type="button" onClick={() => setEditingSessionId(null)} style={{ background: '#6c757d', color: '#fff', padding: '2px 6px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                          <span>📅 {session.date}</span>
                          <code style={{ color: 'var(--accent)' }}>{session.duration_minutes} mins</code>
                        </div>
                        
                        
                        {parsedData.colors.length > 0 && (
                          <div style={{ margin: '12px 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '13px' }}>Palette:</strong>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {parsedData.colors.map((hex, idx) => (
                                <div key={idx} title={hex} style={{ width: '18px', height: '18px', backgroundColor: hex, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)' }} />
                              ))}
                            </div>
                          </div>
                        )}

                        
                        {parsedData.notes && (
                          <p style={{ margin: '10px 0', fontSize: '14px', color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                            {parsedData.notes}
                          </p>
                        )}

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
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}