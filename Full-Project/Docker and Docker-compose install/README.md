
### Docker and Docker Compose Installation Guide


#### Step 1: Create the Installation Script

Save the script below as `install.sh`. This script will install Docker along with Docker Compose on your Ubuntu system.

```bash
#!/bin/bash

# Update and upgrade package database
echo "Updating and upgrading package database..."
sudo apt update && sudo apt upgrade -y

# Install prerequisites
echo "Installing required prerequisites..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker’s official GPG key
echo "Adding Docker’s GPG key..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable repository
echo "Adding Docker APT repository..."
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package database with Docker packages
echo "Updating package database with Docker packages..."
sudo apt update

# Install Docker CE
echo "Installing Docker..."
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Start and enable Docker
echo "Starting and enabling Docker..."
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to the Docker group
echo "Adding current user to Docker group..."
sudo usermod -aG docker $USER

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Print Docker and Docker Compose versions
echo "Verifying Docker and Docker Compose installation..."
docker --version
docker-compose --version

echo "Docker and Docker Compose have been installed successfully!"
echo "Please log out and back in for group changes to take effect."
```

#### Step 2: Make the Script Executable

To make the script executable, use the following command:

```bash
chmod +x install.sh
```

#### Step 3: Run the Installation Script

Execute the script to install Docker and Docker Compose:

```bash
./install.sh
```

After running this script, Docker and Docker Compose will be installed and configured on your system. Remember to log out and log back in to apply the group changes, or you can use the `newgrp docker` command in your current terminal to start using Docker without logging out.