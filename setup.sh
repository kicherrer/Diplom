#!/bin/bash

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
SECRET_KEY=django-insecure-development-key
DEBUG=True
DB_NAME=mediadb
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
TMDB_API_KEY=your_tmdb_api_key
YOUTUBE_API_KEY=your_youtube_api_key
EOL
fi

# Initialize database
python scripts/init_db.py

# Apply migrations
python manage.py migrate

# Make manage.py executable
chmod +x manage.py

echo "Setup complete! Next steps:"
echo "1. Update .env with your API credentials"
echo "2. Start server: ./manage.py runserver"
