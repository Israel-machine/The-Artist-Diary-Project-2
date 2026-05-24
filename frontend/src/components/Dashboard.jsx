import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../../src/components.css'

export default function Dashboard() {
  const { token, logout, BASE_URL } = useAuth(); 
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [medium, setMedium] = useState('');
  const [description, setDescription] = useState('');

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMedium, setEditMedium] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchProjects = () => {
    fetch(`${BASE_URL}/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => { 
     
      if (data && Array.isArray(data.projects)) {
        setProjects(data.projects); 
      } 
    })
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
      setTitle(''); setMedium(''); setDescription('');
      fetchProjects();
    } catch (err) { setError(err.message); }
  };

  const handleUpdateProject = async (e, id) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: editTitle, medium: editMedium, description: editDescription })
      });
      if (!res.ok) throw new Error('Failed to update project data.');
      setEditingProjectId(null);
      fetchProjects();
    } catch (err) { setError(err.message); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to scrub this project and all its session history?")) return;
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Could not delete project footprint.');
      fetchProjects();
    } catch (err) { setError(err.message); }
  };

  const startEditing = (project) => {
    setEditingProjectId(project.id);
    setEditTitle(project.title);
    setEditMedium(project.medium);
    setEditDescription(project.description);
  };

  if (loading) return <div id="center">Loading studio space...</div>;

  return (
    <div id="center" className="dashboard">
      <div className="dashboard__header">
        <h1>Your Studio Dashboard</h1>
        <button onClick={logout} className="counter dashboard__logout-btn">Leave Diary (Logout)</button>
      </div>

      <form onSubmit={handleCreateProject} className="project-create-form">
        <h3>🎨 New Project Details</h3>
        {error && <p className="form-error">{error}</p>}
        <input
          type="text"
          placeholder="Artwork Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="text"
          placeholder="Medium"
          value={medium}
          onChange={e => setMedium(e.target.value)}
          required
          className="form-input"
        />
        <textarea
          placeholder="Creative notes..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="form-textarea"
        />
        <button type="submit" className="counter">Create New Project</button>
      </form>

      <div>CURRENT PROJECTS</div>
      <div className="project-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            {editingProjectId === project.id ? (
              <form onSubmit={(e) => handleUpdateProject(e, project.id)} className="project-card__edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                  className="project-card__edit-input"
                />
                <input
                  type="text"
                  value={editMedium}
                  onChange={e => setEditMedium(e.target.value)}
                  required
                  className="project-card__edit-input"
                />
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="project-card__edit-textarea"
                />
                <div className="project-card__edit-actions">
                  <button type="submit" className="btn-save">Save</button>
                  <button type="button" onClick={() => setEditingProjectId(null)} className="btn-cancel">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="project-card__body">
                  <h2 className="project-card__title">{project.title}</h2>
                  <span className="project-card__medium">{project.medium}</span>
                  <p className="project-card__description">{project.description}</p>
                </div>
                <div className="project-card__footer">
                  <Link to={`/projects/${project.id}`} className="counter project-card__open-link">Open Log →</Link>
                  <div className="project-card__actions">
                    <button onClick={() => startEditing(project)} className="btn-text-accent">Edit Info</button>
                    <button onClick={() => handleDeleteProject(project.id)} className="btn-text-danger">Discard</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}