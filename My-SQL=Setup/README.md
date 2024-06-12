
## My SQL Setup

### Create a directory** for your MySQL Dockerfile (e.g., `mysql`).

    ```bash
    mkdir mysql
    cd mysql
    ```
### Docker Compose File

Create a file named `docker-compose.yml` with the following content:

```yaml
version: '3.8'

services:
  mysql:
    image: fazlulkarim105925/my-sql:v1.0
    container_name: mysql_container
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: test_db
    ports:
      - "3306:3306"
```

### Command to Start the Services

Navigate to the directory containing your `docker-compose.yml` file and run:

```bash
docker-compose up -d
```

This command will start the MySQL container in detached mode.