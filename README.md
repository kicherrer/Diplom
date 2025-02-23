# Media Content Management Platform

## Local Development Setup

### Prerequisites

1. Python 3.11 or higher
2. PostgreSQL
3. Redis (optional for development)

### Installation

1. Install PostgreSQL:
```bash
# macOS using Homebrew
brew install postgresql
brew services start postgresql
```

2. Set up the development environment:
```bash
# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

3. Update `.env` file with your credentials

4. Create and setup database:
```bash
createdb mediadb
./manage.py migrate
```

5. Run development server:
```bash
./manage.py runserver
```

### Installing Docker (optional)

If you want to use Docker later:

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Docker Desktop
brew install --cask docker

# After Docker Desktop is installed and running:
brew install docker-compose
```

Then you can use `docker-compose up --build` to run the containerized version.
