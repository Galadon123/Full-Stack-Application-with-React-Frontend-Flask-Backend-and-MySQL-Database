## Mysql Setup in `Mysql-Instance`

### Requirements
- **Docker**: You need Docker installed on your machine. Docker is available for Windows, macOS, and Linux distributions. You can download it from [Docker's official website](https://www.docker.com/get-started).
- **Docker Compose**: Docker Compose comes installed with Docker Desktop for Windows and Mac, but you may need to install it separately on Linux.

### Docker Compose File
Your Docker Compose file is already defined as follows:

```yaml
version: '3.8'

services:
  db:
    image: mysql:latest
    container_name: mysql-container
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: test_db
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### Steps to Run the MySQL Container

#### Step 1: Save the Compose File
Save the above Docker Compose YAML configuration in a file named `docker-compose.yml` in a directory of your choice.

#### Step 2: Start the Container
Open a terminal or command prompt, navigate to the directory where you saved the `docker-compose.yml` file, and run the following command to start the MySQL container:

```bash
docker-compose up -d
```

This command will:
- Start the MySQL container in detached mode (the `-d` flag).
- Pull the MySQL image from Docker Hub if it’s not already present on your machine.
- Set up a volume `mysql_data` for persistent storage of the MySQL database.
- Expose port 3306 on your host, which allows you to connect to the MySQL server from your host machine using MySQL client tools.


#### Step 4: Accessing the MySQL Database
To access the MySQL database, you can use MySQL client software or command line tools. For example, to connect using the MySQL command line tool, you can use:

```bash
docker exec -it mysql-container mysql -uuser -ppassword
```

This command logs you into the MySQL server running inside the container using the username `user` and password `password`.

#### Step 5: Stopping the Container
When you are done, you can stop the MySQL container by running:

```bash
docker-compose down
```

This command stops and removes the containers created by the `docker-compose up` command. To preserve your database, Docker Compose keeps your volume intact.


This documentation should help you get your MySQL server running inside a Docker container using Docker Compose with ease.