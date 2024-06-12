
## Run React-App

#### Instal Docker
//
 
### docker-compose

     ```
     sudo yum update -y
     sudo yum install curl gnupg -y
     sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
     sudo chmod +x /usr/local/bin/docker-compose
     ```

Create a `docker-compose.yaml`:
```bash
version: '3.8'

services:
  react-app:
    image: fazlulkarim105925/my-react-app:v1.0
    container_name: my-react-app
    ports:
      - "3000:80"
```

## Run the Docker Compose up command to start the container:

```bash
docker-compose up -d
```
