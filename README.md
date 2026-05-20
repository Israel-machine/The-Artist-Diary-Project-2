Set up env
    cd backend server
    pipenv install
    pipenv shell

Start backend server
    flask db init
    flask db migrate -m "initial migration"
    flask db upgrade

Start frontend server
    cd frontend
    npm run dev
    
install req.txt
    pip install -r requirements.txt

Front end packages:
install react-router-dom


Will need to initialize the backend server(virtual env activation), then the front end server (npm run dev)
