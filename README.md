# The Artist Diary
As someone who enjoys making original art it can be tough to return to a project and feel the same focus or motivation you felt when you began the project. It's easy to forget what colors you used, how you mixed them and even what music you were listening to that made your last session so productive or unproductive.

By keeping track of all of these details, you can streamline your work flow to cut down on the amount of time you have to invest every session to make a session feel productive or fulfilling. My project aims to make a resource for artists or creatives to catalog their progress to make jumping into a project easier. It will also allow them to better track the effort and time they invest into a project so that they can confidently set price points of a finished project.

# Technologies
## Frontend Architecture
React 18 & Vite
React Router v6 
Context API
## Backend Infrastructure
Flask (Python)
SQLAlchemy ORM & SQLite
Flask-Bcrypt
Flask-JWT-Extended

# Set up and run instructions
## Install and activate depedencies
pipenv install
pipenv shell
pip install -r requirements.txt

## Backend Set Up
cd backend
python app.py or python3 app.py

## Front End Set Up
create new terminal
cd frontend
npm install
npm run dev
if npm run dev succesful open URL in browser: http://localhost:5173/

# Overview of core functionality
## User Authentication & Security Boundaries: 
Secure registration and encrypted logins return an authorization bearer token. This JWT key syncs with browser localStorage, keeping user sessions active across page reloads while preventing unauthorized data access.

## Studio Dashboard (Full Project CRUD): 
Users can create an acount with custom username and passwords and create projects 
Users can edit their projects and delete projects
Users will also be able to navigate between pages by clicking "Dashboard" to return home and "Logout" to end their session. 

## Production Timeline Log (Full Session CRUD): 
Inside each individual project, users can create, edit, and delete individual sessions
Deleting a project will delete the sessions contained with each project
Users will be able to see the total number of minutes logged within each project at the top of their project page

## Palette Swatch Serialization & State Management: 
Users will be able to add multiple colors using a color picking feature. They will also have the ability to enter notes for their session that can house specific names for paints used etc. 
