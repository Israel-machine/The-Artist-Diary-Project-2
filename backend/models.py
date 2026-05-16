from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize the database instance. 
db = SQLAlchemy()

#USERS TABLE
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    projects = db.relationship('Project', backref='user', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.username}>"

#PROJECT TABLE
class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    medium = db.Column(db.String(100), nullable=True) 
    description = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sessions = db.relationship('Session', backref='project', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Project {self.title}>"

#SESSION TABLE
class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    color_notes = db.Column(db.Text, nullable=True)
    playlist_url = db.Column(db.String(255), nullable=True)
    duration_minutes = db.Column(db.Integer, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)

    def __repr__(self):
        return f"<Session Date: {self.date.strftime('%Y-%m-%d')} | Duration: {self.duration_minutes} mins>"