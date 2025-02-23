import psycopg2
from psycopg2 import errors
import os
from dotenv import load_dotenv

load_dotenv()

def init_database():
    # Connection parameters for connecting to default postgres database
    params = {
        "user": os.getenv("DB_USER", "postgres"),
        "password": os.getenv("DB_PASSWORD", "postgres"),
        "host": os.getenv("DB_HOST", "localhost"),
        "port": os.getenv("DB_PORT", "5432"),
    }

    db_name = os.getenv("DB_NAME", "mediadb")

    # Connect to default postgres database
    conn = psycopg2.connect(dbname="postgres", **params)
    conn.autocommit = True
    cursor = conn.cursor()

    try:
        # Try to create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE {db_name}")
        print(f"Database {db_name} created successfully")
    except errors.DuplicateDatabase:
        print(f"Database {db_name} already exists")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    init_database()
