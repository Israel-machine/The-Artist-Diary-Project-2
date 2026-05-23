import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../../src/components.css'


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
  const [textNotes, setTextNotes] = useState('');

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

  if (loading) return <div className="page-loading">Loading project canvas...</div>;
  if (!project) return <div className="page-not-found">Project not found. <Link to="/">Return Home</Link></div>;

  return (
    <div className="project-detail">
      <Link to="/" className="project-detail__back-link">← Back to Dashboard</Link>

      <div className="project-detail__header">
        <h1 className="project-detail__title">{project.title}</h1>
        <div className="project-detail__time-badge">
          ⏱️ Total Time: {sessions.reduce((total, session) => total + (session.duration_minutes || 0), 0)} mins
        </div>
      </div>

      <p className="project-detail__medium">Medium: <strong>{project.medium}</strong></p>

      {error && <div className="form-error form-error--block">⚠️ {error}</div>}

      <div className="project-detail__grid">

        {/* Record Session Form */}
        <div>
          <h3>⏱️ Record Studio Session</h3>
          <form onSubmit={handleAddSession} className="session-form">
            <div className="form-field">
              <label className="form-field__label">Session Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="form-field__input" />
            </div>
            <div className="form-field">
              <label className="form-field__label">Duration (Minutes)</label>
              <input type="number" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} required className="form-field__input" />
            </div>

            <div className="form-field">
              <label className="form-field__label">Session Color Swatches</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  value={pickerColor}
                  onChange={e => setPickerColor(e.target.value)}
                  className="color-picker-row__input"
                />
                <button type="button" onClick={addColorSwatch} className="color-picker-row__add-btn">+ Add Color</button>
              </div>
              <div className="swatch-tray">
                {sessionColors.length === 0 && (
                  <span className="swatch-tray__empty">No colors picked yet</span>
                )}
                {sessionColors.map(hex => (
                  <div
                    key={hex}
                    title="Click to remove"
                    onClick={() => setSessionColors(sessionColors.filter(c => c !== hex))}
                    className="color-swatch color-swatch--removable"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            <div className="form-field">
              <label className="form-field__label">Session &amp; Palette Notes</label>
              <textarea
                placeholder="Describe your progress, texture alterations, or dry time experiences..."
                value={textNotes}
                onChange={e => setTextNotes(e.target.value)}
                className="form-field__textarea"
              />
            </div>

            <div className="form-field">
              <label className="form-field__label">Playlist Focus Link</label>
              <input type="url" value={playlistUrl} onChange={e => setPlaylistUrl(e.target.value)} className="form-field__input" />
            </div>
            <button type="submit" className="counter session-form__submit">Create New Session</button>
          </form>
        </div>

        {/* Session Timeline Log */}
        <div>
          <h3>📜 Production Timeline Log</h3>
          <div className="session-list">
            {sessions.length === 0 ? (
              <p className="session-list__empty">No session logs saved to this piece yet.</p>
            ) : (
              sessions.map(session => {
                const parsedData = parseSessionData(session.color_notes);

                return (
                  <div key={session.id} className="session-entry">
                    {editingSessionId === session.id ? (
                      <form onSubmit={(e) => handleUpdateSession(e, session.id)} className="session-entry__edit-form">
                        <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} required />
                        <input type="number" value={editDuration} onChange={e => setEditDuration(e.target.value)} required />
                        <div>
                          <label className="session-entry__edit-label">Edit Swatches (Click to delete):</label>
                          <div className="session-entry__edit-swatches">
                            {editColors.map(hex => (
                              <div
                                key={hex}
                                onClick={() => setEditColors(editColors.filter(c => c !== hex))}
                                className="color-swatch color-swatch--edit"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                          <input
                            type="color"
                            onChange={e => {
                              if (!editColors.includes(e.target.value))
                                setEditColors([...editColors, e.target.value]);
                            }}
                          />
                        </div>
                        <textarea
                          value={editTextNotes}
                          onChange={e => setEditTextNotes(e.target.value)}
                          placeholder="Update session details..."
                        />
                        <input
                          type="url"
                          value={editPlaylist}
                          onChange={e => setEditPlaylist(e.target.value)}
                          placeholder="Playlist URL..."
                        />
                        <div className="session-entry__edit-actions">
                          <button type="submit" className="btn-save">Save</button>
                          <button type="button" onClick={() => setEditingSessionId(null)} className="btn-cancel">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="session-entry__meta">
                          <span>📅 {session.date}</span>
                          <code className="session-entry__duration">{session.duration_minutes} mins</code>
                        </div>

                        {parsedData.colors.length > 0 && (
                          <div className="session-entry__palette">
                            <strong className="session-entry__palette-label">Palette:</strong>
                            <div className="session-entry__swatches">
                              {parsedData.colors.map((hex, idx) => (
                                <div
                                  key={idx}
                                  title={hex}
                                  className="color-swatch color-swatch--display"
                                  style={{ backgroundColor: hex }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedData.notes && (
                          <p className="session-entry__notes">{parsedData.notes}</p>
                        )}

                        {session.playlist_url && (
                          <p className="session-entry__playlist">
                            🎵 <a href={session.playlist_url} target="_blank" rel="noreferrer" className="session-entry__playlist-link">Soundtrack</a>
                          </p>
                        )}

                        <div className="session-entry__actions">
                          <button onClick={() => startEditingSession(session)} className="btn-text-accent">Edit Log</button>
                          <button
                            onClick={async () => {
                              if (!window.confirm("Delete this session entry?")) return;
                              try {
                                await fetch(`${BASE_URL}/sessions/${session.id}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                fetchWorkspaceDetails();
                              } catch (err) { console.error(err); }
                            }}
                            className="btn-text-danger"
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