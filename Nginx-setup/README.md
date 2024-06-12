### Install Nginx from Source on Ubuntu

### Create a Shell Script

1. **Create a new shell script file**:

    ```bash
    nano install_nginx.sh
    ```

2. **Add the following content to the script**:

    ```bash
    #!/bin/bash

    # Step 1: Obtain Sudo Privileges
    sudo su

    # Step 2: Install Dependencies
    apt update -y && apt-get install -y git build-essential libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev libgd-dev libxml2 libxml2-dev uuid-dev

    # Step 3: Download Nginx Source Code
    wget http://nginx.org/download/nginx-1.26.1.tar.gz

    # Step 4: Extract the Downloaded File
    tar -zxvf nginx-1.26.1.tar.gz

    # Step 5: Build and Install Nginx
    cd nginx-1.26.1

    ./configure \
        --prefix=/etc/nginx \
        --conf-path=/etc/nginx/nginx.conf \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --pid-path=/run/nginx.pid \
        --sbin-path=/usr/sbin/nginx \
        --with-http_ssl_module \
        --with-http_v2_module \
        --with-http_stub_status_module \
        --with-http_realip_module \
        --with-file-aio \
        --with-threads \
        --with-stream \
        --with-stream_ssl_preread_module

    make && make install

    # Verify the installation
    nginx -V
    ```

3. **Save and close the file** (in nano, press `Ctrl + O` to save and `Ctrl + X` to exit).

4. **Make the script executable and Run it**:

    ```bash
    chmod +x install_nginx.sh
     ./install_nginx.sh
    ```

### Explanation

- The script will run all the necessary commands sequentially.
- `sudo su` is included at the beginning to ensure that you have the necessary permissions to install and configure software.
- Dependencies are installed, and Nginx is downloaded, extracted, configured, built, and installed.
- Finally, the script verifies the installation by running `nginx -V`.

By using this script, you can automate the entire process of installing Nginx from source on your system.

#### Step 5: Move the Current Configuration File

First, you need to move the existing Nginx configuration file to a backup location. This ensures that you have a copy of the original configuration in case you need to revert to it.

```bash
mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
```

#### Step 6: Create a New Configuration File

Now, create a new Nginx configuration file with the desired settings.

1. **Open a new configuration file** for editing:

    ```bash
    nano /etc/nginx/nginx.conf
    ```

2. **Update the Nginx configuration** to proxy requests to the Docker container:

    ```nginx
    worker_processes 1;

    events {
        worker_connections 1024;
    }

    http {
        include       mime.types;
        default_type  application/octet-stream;

        sendfile        on;
        keepalive_timeout  65;

        server {
            listen       80;
            server_name  localhost;

            location / {
                proxy_pass http://<react-app-private-IP>:3000;  #port number of Docker container exposed.
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            location /api/ {
                proxy_pass http://<private-IP-Flask>:5000/;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   /usr/share/nginx/html;
            }
        }
    }
    ```

3. **Save and close the file** (in nano, press `Ctrl + O` to save and `Ctrl + X` to exit).

#### Step 3: Verify the New Configuration

Before applying the new configuration, it is a good practice to verify the configuration to ensure there are no syntax errors.

```bash
nginx -t
```

### Step-by-Step Guide to Start Nginx Manually

#### Step 1: Ensure No Port Conflicts

1. **Check for Processes Using Port 80**:

    ```bash
    sudo lsof -i :80
    ```

    If another process is using port 80

    kill the process using its PID:

    ```bash
    sudo kill -9 <PID>
    ```
#### Step 2: Start Nginx

1. **Start Nginx Manually**:

    ```bash
    sudo /usr/sbin/nginx
    ```





