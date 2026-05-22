from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from flask_cors import CORS
from datetime import datetime
from config import DevelopmentConfig
from models import db, User, Project, Session, bcrypt
from flask_bcrypt import Bcrypt

# Initialization & App Setup
app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
cors = CORS(app) 

# Authentication Routes 

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    # if User.query.filter_by(username=username).first():
    #     return jsonify({"error": "Username already exists"}), 400

    # new_user = User(username=username, password_hash=password)
    # db.session.add(new_user)
    # db.session.commit()
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400
    
    new_user = User(username=username)
    new_user.password_hash = password 
    db.session.add(new_user)
    db.session.commit()




    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({"message": "User created successfully", "token": access_token}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or not user.authenticate(password):
        return jsonify({"error": "unauthorized request"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "token": access_token, 
        "user": {"id": user.id, "username": user.username}
    }), 200

#LOGOUT
@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout_backend():
    # Since we are using stateless JWTs stored in localStorage, 
    # the client deleting the token is technically enough, but this route 
    # completes your API requirements.
    return jsonify({"message": "Logged out successfully"}), 200


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_me():
    current_user_id = get_jwt_identity()
    
    user = db.session.get(User, int(current_user_id))
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({
        "id": user.id, 
        "username": user.username
    }), 200


# Project Routes (Home Page / Dashboard)

@app.route('/api/projects', methods=['GET', 'POST'])
@jwt_required()
def handle_projects():
    current_user_id = get_jwt_identity()

    if request.method == 'GET':
        projects = Project.query.filter_by(user_id=current_user_id).all()
        return jsonify([{
            "id": p.id,
            "title": p.title,
            "medium": p.medium,
            "description": p.description
        } for p in projects]), 200

    if request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        
        if not title:
            return jsonify({"error": "Project title is required"}), 400

        new_project = Project(
            title=title,
            medium=data.get('medium'),
            description=data.get('description'),
            user_id=current_user_id
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify({"message": "Project created", "id": new_project.id}), 201


@app.route('/api/projects/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def handle_single_project(id):
    current_user_id = int(get_jwt_identity())
    project = Project.query.get_or_404(id)

    if project.user_id != current_user_id:
        return jsonify({"error": "Unauthorized to access this project"}), 403

    if request.method == 'PUT':
        data = request.get_json()
        project.title = data.get('title', project.title)
        project.medium = data.get('medium', project.medium)
        project.description = data.get('description', project.description)
        
        db.session.commit()
        return jsonify({"message": "Project updated successfully"}), 200

    if request.method == 'DELETE':
        db.session.delete(project)
        db.session.commit()
        return jsonify({"message": "Project and its associated sessions deleted"}), 200


# Session Routes (Studio Logs Detail Page)

@app.route('/api/projects/<int:id>/sessions', methods=['GET', 'POST'])
@jwt_required()
def handle_project_sessions(id):
    current_user_id = int(get_jwt_identity())
    project = Project.query.get_or_404(id)

    if project.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    if request.method == 'GET':
        sessions = Session.query.filter_by(project_id=id).all()
        return jsonify([{
            "id": s.id,
            "date": s.date.strftime('%Y-%m-%d'),
            "color_notes": s.color_notes,
            "playlist_url": s.playlist_url,
            "duration_minutes": s.duration_minutes
        } for s in sessions]), 200

    if request.method == 'POST':
        data = request.get_json()
        duration = data.get('duration_minutes')

        if not duration:
            return jsonify({"error": "Duration minutes is required"}), 400

        session_date = datetime.utcnow()
        if data.get('date'):
            try:
                session_date = datetime.strptime(data.get('date'), '%Y-%m-%d')
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

        new_session = Session(
            date=session_date,
            color_notes=data.get('color_notes'),
            playlist_url=data.get('playlist_url'),
            duration_minutes=int(duration),
            project_id=id
        )
        db.session.add(new_session)
        db.session.commit()
        return jsonify({"message": "Studio session logged successfully", "id": new_session.id}), 201


@app.route('/api/sessions/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def handle_single_session(id):
    current_user_id = int(get_jwt_identity())
    session = Session.query.get_or_404(id)
    
    if session.project.user_id != current_user_id:
        return jsonify({"error": "Unauthorized to alter this session log"}), 403

    if request.method == 'GET':
        return jsonify({
            "id": session.id,
            "date": session.date.strftime('%Y-%m-%d'),
            "color_notes": session.color_notes,
            "playlist_url": session.playlist_url,
            "duration_minutes": session.duration_minutes,
            "project_id": session.project_id
        }), 200

    if request.method == 'PUT':
        data = request.get_json()
        if data.get('date'):
            session.date = datetime.strptime(data.get('date'), '%Y-%m-%d')
        
        session.color_notes = data.get('color_notes', session.color_notes)
        session.playlist_url = data.get('playlist_url', session.playlist_url)
        session.duration_minutes = data.get('duration_minutes', session.duration_minutes)
        
        db.session.commit()
        return jsonify({"message": "Session log updated successfully"}), 200

    if request.method == 'DELETE':
        db.session.delete(session)
        db.session.commit()
        return jsonify({"message": "Session log deleted"}), 200


if __name__ == '__main__':
    app.run(port=5555, debug=True)