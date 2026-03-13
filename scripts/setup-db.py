#!/usr/bin/env python3
import os
import sys
from pathlib import Path

# Get database URL from environment
db_url = os.getenv('POSTGRES_URL')
if not db_url:
    print("Error: POSTGRES_URL not set")
    sys.exit(1)

# Read the SQL file
sql_file = Path(__file__).parent / 'init-db.sql'
if not sql_file.exists():
    print(f"Error: SQL file not found at {sql_file}")
    sys.exit(1)

sql_content = sql_file.read_text()

# Try to execute the SQL
try:
    import psycopg2
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    # Execute the SQL file
    cursor.execute(sql_content)
    conn.commit()
    cursor.close()
    conn.close()
    
    print("✓ Database schema created successfully!")
    
except ImportError:
    print("psycopg2 not available, trying with asyncpg...")
    import asyncio
    import asyncpg
    
    async def setup():
        conn = await asyncpg.connect(db_url)
        await conn.execute(sql_content)
        await conn.close()
        print("✓ Database schema created successfully!")
    
    asyncio.run(setup())
except Exception as e:
    print(f"Error setting up database: {e}")
    sys.exit(1)
