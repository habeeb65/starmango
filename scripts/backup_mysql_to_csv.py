import os
import datetime
import pymysql
import csv

# --- CONFIGURATION ---
DB_USER = "habeeb321"
DB_PASSWORD = ""  # Add password if any
DB_NAME = "habeeb321$default"
MYSQL_HOST = "habeeb321.mysql.pythonanywhere-services.com"
BACKUP_DIR = "/home/habeeb321/backups"

# --- SETUP ---
os.makedirs(BACKUP_DIR, exist_ok=True)
timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
backup_folder = os.path.join(BACKUP_DIR, f"csv_backup_{timestamp}")
os.makedirs(backup_folder, exist_ok=True)

try:
    print(f"Connecting to database {DB_NAME}...")
    conn = pymysql.connect(
        host=MYSQL_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES;")
    tables = [row[0] for row in cursor.fetchall()]
    
    print(f"Found tables: {tables}")

    for table in tables:
        cursor.execute(f"SELECT * FROM `{table}`;")
        rows = cursor.fetchall()
        headers = [desc[0] for desc in cursor.description]
        
        file_path = os.path.join(backup_folder, f"{table}.csv")
        with open(file_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(rows)
        
        print(f"Exported {table} to {file_path}")

    print("✅ Backup completed successfully!")
except Exception as e:
    print("❌ Backup failed:", e)
