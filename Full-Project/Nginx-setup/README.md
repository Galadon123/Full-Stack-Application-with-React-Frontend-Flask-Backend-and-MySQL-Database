
## Nginx Setup in `Nginx-Instance`

### Step 1: Install NGINX
Open a terminal and run the following command to install NGINX:
```bash
sudo apt install nginx
```

### Step 2: Configure NGINX
Open the NGINX configuration file for editing:
```bash
sudo nano /etc/nginx/sites-available/default
```
Add the following server blocks into the configuration file. Make sure to replace `<React-app-instance-private-ip>` and `<flask-instance-private-ip>` with the actual IP addresses of your React and Flask applications.

```nginx
server {
    listen 80;
    server_name bus.students.poridhi.io;

    location / {
        proxy_pass http://<React-app-instance-private-ip>:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name bus-api.students.poridhi.io;

    location / {
        proxy_pass http://<flask-instance-private-ip>:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_enable X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name payment.students.poridhi.io;

    location / {
        proxy_pass http://<React-app-instance-private-ip>:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name payment-api.students.poridhi.io;

    location / {
        proxy_pass http://<flask-instance-private-ip>:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Step 3: Check NGINX Configuration for Syntax Errors
Before restarting NGINX, it’s a good practice to check if there are any syntax errors in your configuration files:
```bash
sudo nginx -t
```

### Step 4: Restart NGINX
If the configuration syntax is correct, restart NGINX to apply the changes:
```bash
sudo systemctl restart nginx
```

### Final Step: Verify
After restarting, ensure that NGINX is running and that your applications are reachable:
```bash
systemctl status nginx
```

Visit `http://bus.students.poridhi.io`, `http://bus-api.students.poridhi.io`, `http://payment.students.poridhi.io`, and `http://payment-api.students.poridhi.io` in your browser to check if the applications are serving correctly.

This guide should help you set up a basic reverse proxy configuration with NGINX for your applications. Make sure that the IP addresses and ports in your NGINX configuration match those that your React and Flask apps are actually running on.