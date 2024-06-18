## React Application Setup

### Requirements
- **Docker**: Ensure Docker is installed on your system. If not, you can download and install it from [Docker's official website](https://www.docker.com/get-started).
- **Docker Compose**: Typically installed with Docker Desktop on Windows and macOS. If you are using Linux, make sure Docker Compose is installed separately.

### Docker Compose File
Create a Docker Compose file named `docker-compose.yml` in a directory of your choice and include the following configuration:

```yaml
version: '3.8'

services:
  react-app-1:
    image: fazlulkarim105925/final-react-app-1
    container_name: final-react-app-1
    ports:
      - "3000:80"
    restart: unless-stopped

  react-app-2:
    image: fazlulkarim105925/final-react-application-2
    container_name: final-react-app-2
    ports:
      - "3001:80"
    restart: unless-stopped
```

### Explanation of Compose File
- **Service Names**: `react-app-1` and `react-app-2` are names of the services.
- **Image**: Specifies the Docker image to use for each service.
- **Container Name**: Names given to the containers for easier management.
- **Ports**: Maps port 3000 on the host to port 3000 inside the `react-app-1` container and port 3001 on the host to port 3000 inside the `react-app-2` container.
- **Restart Policy**: `unless-stopped` ensures that the container will restart unless it has been explicitly stopped.

### Steps to Run the Containers

#### Step 1: Save the Compose File
Ensure you save the above Docker Compose configuration as `docker-compose.yml` in a desired directory.

#### Step 2: Launch the Containers
Open a terminal or command prompt, navigate to the directory containing your `docker-compose.yml` file, and run the following command:
```bash
docker-compose up -d
```
This command will:
- Start both containers in detached mode.
- Pull the images from Docker Hub if they are not already present on your machine.

#### Step 3: Verify the Containers are Running
To check the status of your containers, use:
```bash
docker-compose ps
```

#### Step 4: Stopping the Containers
When you are finished, you can stop the containers by running:
```bash
docker-compose down
```

This setup provides a quick and efficient way to run multiple React applications on different ports using Docker and Docker Compose.