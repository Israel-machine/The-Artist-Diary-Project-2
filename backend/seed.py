from app import app
from models import db, User, Project, Session
from datetime import datetime, timedelta

def seed_database():
    print("Starting database seed...")
    with app.app_context():
        print("Clearing old data...")
        Session.query.delete()
        Project.query.delete()
        User.query.delete()
        db.session.commit()

        # Create a Test User
        print("Creating test user...")
        mock_hash = "$2b$12$K3d6K9XgVnJbL9A8f7m2e.uR0Z1Wj8y3vG9Z7x6c5v4b3n2m1l0k."
        
        test_user = User(
            username="creative_artist",
            password_hash=mock_hash
        )
        db.session.add(test_user)
        db.session.commit() 

        # Create Test Projects
        print("Creating sample projects...")
        project1 = Project(
            title="Starry Night Study",
            medium="Oil on Canvas",
            description="An expressionist copy focusing on fluid brushwork, impasto textures, and mixing cool cerulean tones.",
            user_id=test_user.id
        )
        
        project2 = Project(
            title="Cyberpunk Streetscape",
            medium="Digital (Procreate)",
            description="Concept art for a neon-lit alleyway. Experimenting with extreme perspective and neon color palettes.",
            user_id=test_user.id
        )
        
        db.session.add_all([project1, project2])
        db.session.commit() 

        # Create Sample Sessions
        print("Logging mock studio sessions...")
        
        # Sessions for Project 1 (Oil Painting)
        p1_session1 = Session(
            date=datetime.utcnow() - timedelta(days=3),
            color_notes="Mixed French Ultramarine with Titanium White for the sky swirls. Added a touch of Phthalo Green for depth.",
            playlist_url="https://open.spotify.com/playlist/37i9dQZF1DX8NTLIw6Z6g0",  # Classical Focus
            duration_minutes=120,
            project_id=project1.id
        )
        
        p1_session2 = Session(
            date=datetime.utcnow() - timedelta(days=2),
            color_notes="Blocked in the foreground cypress tree. Used Ivory Black blended with Raw Umber and Cadmium Yellow highlights.",
            playlist_url="https://open.spotify.com/playlist/37i9dQZF1DX5cZuA7UnjIF",  # Ambient Painting Music
            duration_minutes=90,
            project_id=project1.id
        )

        # Session for Project 2 (Digital Art)
        p2_session1 = Session(
            date=datetime.utcnow() - timedelta(days=1),
            color_notes="Hex Codes used: #FF007F (Neon Pink), #00F0FF (Cyber Cyan), #120136 (Deep Purple Background). Saved custom airbrush sets.",
            playlist_url="https://open.spotify.com/playlist/37i9dQZF1DXdLTE7w7X970",  # Synthwave/Cyberpunk Focus
            duration_minutes=180,
            project_id=project2.id
        )

        db.session.add_all([p1_session1, p1_session2, p2_session1])
        db.session.commit()

        print("Database successfully seeded with test configurations!")

if __name__ == "__main__":
    seed_database()