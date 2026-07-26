#!/bin/bash

# Define variables
DB_NAME="KheloIndore"
BACKUP_DIR="/home/db"
TIMESTAMP=$(date +"%F")
BACKUP_PATH="/tmp/${DB_NAME}_${TIMESTAMP}"
ARCHIVE_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.tar.gz"
CONTAINER_NAME="kheloindore-mongo-1"

# Create backup directory on the host if it doesn't exist
mkdir -p $BACKUP_DIR

# Execute the backup command inside the container without compression
docker exec -i $CONTAINER_NAME bash -c "mongodump --db $DB_NAME --out $BACKUP_PATH"

# Create a tar.gz archive of the backup
docker exec -i $CONTAINER_NAME bash -c "tar -czvf ${BACKUP_PATH}.tar.gz -C /tmp ${DB_NAME}_${TIMESTAMP}"

# Copy the tar.gz archive from the container to the host
docker cp $CONTAINER_NAME:${BACKUP_PATH}.tar.gz $ARCHIVE_FILE

# Remove the backup and the tar.gz file from the container
docker exec $CONTAINER_NAME bash -c "rm -rf ${BACKUP_PATH} ${BACKUP_PATH}.tar.gz"

echo "Database backup saved to $ARCHIVE_FILE"
