# MySQL Database Backup Instructions

This document provides instructions on how to set up automated daily backups for your MySQL database in the Star Mango project.

## Option 1: Using the Bash Script (Linux/Mac/WSL)

### Setup

1. Edit the `backup_mysql.sh` script and update the following variables:
   ```bash
   DB_USER="your_mysql_user"
   DB_PASSWORD="your_mysql_password"
   DB_NAME="your_mysql_db_name"
   BACKUP_DIR="backups"  # Directory to store backups
   ```

2. Make the script executable:
   ```bash
   chmod +x backup_mysql.sh
   ```

3. Test the script by running it manually:
   ```bash
   ./backup_mysql.sh
   ```

### Schedule Daily Backups

#### On Linux/Mac (using cron):

1. Open the crontab editor:
   ```bash
   crontab -e
   ```

2. Add a line to run the script daily at 2 AM:
   ```
   0 2 * * * /path/to/your/backup_mysql.sh
   ```

3. Save and exit the editor.

#### On PythonAnywhere:

1. Go to the PythonAnywhere dashboard
2. Navigate to the "Tasks" tab
3. Add a new scheduled task:
   - Command: `bash /path/to/your/backup_mysql.sh`
   - Schedule: Daily
   - Time: Choose a time when your site has low traffic (e.g., 2:00 AM)

## Option 2: Using the Python Script

### Setup

1. Edit the `backup_mysql.py` script and update the following variables:
   ```python
   DB_USER = "your_mysql_user"
   DB_PASSWORD = "your_mysql_password"
   DB_NAME = "your_mysql_db_name"
   BACKUP_DIR = "backups"  # Directory to store backups
   ```

2. Make the script executable (Linux/Mac):
   ```bash
   chmod +x backup_mysql.py
   ```

3. Test the script by running it manually:
   ```bash
   python backup_mysql.py
   ```

### Schedule Daily Backups

#### On Windows (using Task Scheduler):

1. Open Task Scheduler
2. Create a new Basic Task
3. Set it to run daily
4. Action: Start a program
5. Program/script: `python`
6. Add arguments: `/path/to/your/backup_mysql.py`

#### On PythonAnywhere:

1. Go to the PythonAnywhere dashboard
2. Navigate to the "Tasks" tab
3. Add a new scheduled task:
   - Command: `python /path/to/your/backup_mysql.py`
   - Schedule: Daily
   - Time: Choose a time when your site has low traffic (e.g., 2:00 AM)

## Restoring from Backup

To restore your database from a backup:

1. Uncompress the backup file:
   ```bash
   gunzip backups/backup_your_mysql_db_name_YYYY-MM-DD_HH-MM-SS.sql.gz
   ```

2. Restore the database:
   ```bash
   mysql -u your_mysql_user -p your_mysql_db_name < backups/backup_your_mysql_db_name_YYYY-MM-DD_HH-MM-SS.sql
   ```

## Important Notes

1. **Security**: The backup scripts contain your database password. Make sure they are not accessible to unauthorized users.

2. **Storage**: Since there is no automatic cleanup, you should periodically review your backup directory and manually remove old backups to prevent running out of disk space.

3. **Testing**: Periodically test the restoration process to ensure your backups are working correctly.

4. **Offsite Backups**: Consider copying your backups to an offsite location (like cloud storage) for additional safety.
