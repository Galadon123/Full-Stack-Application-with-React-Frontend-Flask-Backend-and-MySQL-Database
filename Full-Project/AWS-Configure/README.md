# Full-Stack-Application-with-React-Frontend-Flask-Backend-and-MySQL-Database 

### Setting Up a Secure AWS VPC with Public and Private Subnets

In this project, you will learn how to create and configure a Virtual Private Cloud (VPC) on AWS, set up both public and private subnets, and launch various EC2 instances in each subnet. You will establish secure communication between instances in different subnets, with a particular focus on accessing private subnet instances via a public subnet instance. 

Specifically, you will:

1. **Configure AWS CLI and Pulumi** to interact with AWS services.
2. **Set up a VPC** with one public subnet and one private subnet.
3. **Create and configure network components**, including an Internet Gateway (IGW) for the public subnet and a NAT Gateway for the private subnet.
4. **Launch EC2 instances** in the public and private subnets:
   - An Nginx server in the public subnet.
   - A React app, a Flask app, and a MySQL database in the private subnet.
5. **Establish secure SSH access**:
   - SSH into the public subnet instance.
   - From the public subnet instance, SSH into the private subnet instances.

![](https://github.com/Galadon123/Full-Stack-Application-with-React-Frontend-Flask-Backend-and-MySQL-Database/blob/main/Full-Project/images/yasin-2.jpg)


### Step 1: Configure AWS CLI

1. **Install AWS CLI**:
   - Download and install the AWS CLI MSI Installer for Windows from [AWS CLI installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

2. **Configure AWS CLI**:
   - Open Command Prompt or PowerShell and run:
     ```sh
     aws configure
     ```
   - Enter your AWS Access Key ID, Secret Access Key, default region (`us-east-1`), and default output format (`json`).

### Step 2: Set Up a Pulumi Project
1. **Install Pulumi CLI**:
   - Download and install the Pulumi CLI from [Pulumi Installation Guide](https://www.pulumi.com/docs/get-started/install/).

2. **Set Up a Pulumi Project**:
   - Create a new directory for your project and navigate into it:
     ```sh
     mkdir my-vpc
     cd my-vpc
     ```

3. **Initialize a New Pulumi Project**:
   - Run the following command to create a new Pulumi project:
     ```sh
     pulumi new aws-python
     ```
   - Follow the prompts to set up your project.

4. **Create a Key Pair**:
   - Run the following command to create a new key pair:
     ```sh
     aws ec2 create-key-pair --key-name MyKeyPair --query 'KeyMaterial' --output text > MyKeyPair.pem
     ```

5. **Set File Permissions**:
   - **For Windows**: Open PowerShell and navigate to the directory where `MyKeyPair.pem` is located. Then, use the following command to set the correct permissions:
     ```powershell
     icacls MyKeyPair.pem /inheritance:r
     icacls MyKeyPair.pem /grant:r "$($env:USERNAME):(R)"
     ```

   - **For Linux**:
     ```sh
     chmod 400 MyKeyPair.pem
     ```

### Step 3: Create the Pulumi Program

1. **Open `__main__.py`**:
   - Open the `__main__.py` file in your project directory.

2. **Create the VPC**:
   - A Virtual Private Cloud (VPC) is a virtual network dedicated to your AWS account. You can configure your VPC with a range of IP addresses, subnets, route tables, and network gateways.
   ```python
   import pulumi
   import pulumi_aws as aws

   # Create a VPC
   vpc = aws.ec2.Vpc("my-vpc",
       cidr_block="10.0.0.0/16"
   )

   pulumi.export("vpc_id", vpc.id)
   ```

3. **Create the Public Subnet**:
   - A public subnet is one that has a route to an Internet Gateway, enabling instances within it to communicate with the Internet.
   ```python
   # Create a public subnet
   public_subnet = aws.ec2.Subnet("public-subnet",
       vpc_id=vpc.id,
       cidr_block="10.0.1.0/24",
       availability_zone="us-east-1a",
       map_public_ip_on_launch=True
   )

   pulumi.export("public_subnet_id", public_subnet.id)
   ```

4. **Create the Private Subnet**:
   - A private subnet does not have a route to an Internet Gateway, preventing instances within it from directly communicating with the Internet.
   ```python
   # Create a private subnet
   private_subnet = aws.ec2.Subnet("private-subnet",
       vpc_id=vpc.id,
       cidr_block="10.0.2.0/24",
       availability_zone="us-east-1a"
   )

   pulumi.export("private_subnet_id", private_subnet.id)
   ```

5. **Create the Internet Gateway**:
   - An Internet Gateway (IGW) allows communication between instances in your VPC and the Internet.
   ```python
   # Create an Internet Gateway
   igw = aws.ec2.InternetGateway("internet-gateway",
       vpc_id=vpc.id
   )

   pulumi.export("igw_id", igw.id)
   ```

6. **Create the Public Route Table and Associate with Public Subnet**:
   - A route table contains a set of rules, called routes, that are used to determine where network traffic is directed. Here, you will create a route table, add a route to the IGW, and associate it with the public subnet.
   ```python
   # Create a route table
   public_route_table = aws.ec2.RouteTable("public-route-table",
       vpc_id=vpc.id
   )

   # Create a route in the route table for the Internet Gateway
   route = aws.ec2.Route("igw-route",
       route_table_id=public_route_table.id,
       destination_cidr_block="0.0.0.0/0",
       gateway_id=igw.id
   )

   # Associate the route table with the public subnet
   route_table_association = aws.ec2.RouteTableAssociation("public-route-table-association",
       subnet_id=public_subnet.id,
       route_table_id=public_route_table.id
   )

   pulumi.export("public_route_table_id", public_route_table.id)
   ```

7. **Create the NAT Gateway**:
   - A NAT Gateway allows instances in a private subnet to connect to the Internet or other AWS services, but prevents the Internet from initiating connections with the instances. This is necessary for updating instances in the private subnet.
   ```python
   # Allocate an Elastic IP for the NAT Gateway
   eip = aws.ec2.Eip("nat-eip", vpc=True)

   # Create the NAT Gateway
   nat_gateway = aws.ec2.NatGateway("nat-gateway",
       subnet_id=public_subnet.id,
       allocation_id=eip.id
   )

   pulumi.export("nat_gateway_id", nat_gateway.id)
   ```

8. **Create the Private Route Table and Associate with Private Subnet**:
   - The private route table directs traffic from the private subnet to the NAT Gateway for outbound Internet access.
   ```python
   # Create a route table for the private subnet
   private_route_table = aws.ec2.RouteTable("private-route-table",
       vpc_id=vpc.id
   )

   # Create a route in the route table for the NAT Gateway
   private_route = aws.ec2.Route("nat-route",
       route_table_id=private_route_table.id,
       destination_cidr_block="0.0.0.0/0",
       nat_gateway_id=nat_gateway.id
   )

   # Associate the route table with the private subnet
   private_route_table_association = aws.ec2.RouteTableAssociation("private-route-table-association",
       subnet_id=private_subnet.id,
       route_table_id=private_route_table.id
   )

   pulumi.export("private_route_table_id", private_route_table.id)
   ```

### Step 4: Create the EC2 Instances and Security Groups

1. **Create Security Groups**:

   - **Nginx Security Group**:
     ```python
     # Create a security group for the Nginx instance
     nginx_security_group = aws.ec2.SecurityGroup("nginx-secgrp",
         vpc_id=vpc.id,
         description='Enable HTTP and SSH access for Nginx instance',
         ingress=[
             {'protocol': '-1', 'from_port': 0, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0']},
             {'protocol': 'tcp', 'from_port': 22, 'to_port': 22, 'cidr_blocks': ['0.0.0.0/0']}
         ],
         egress=[
             {'protocol': '-1', 'from_port': 0, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0']}
         ]
     )

     pulumi.export("nginx_security_group_id", nginx_security_group.id)
     ```
     ![](https://github.com/Galadon123/Full-Stack-Application-with-React-Frontend-Flask-Backend-and-MySQL-Database/blob/main/Full-Project/images/nginx-sg.png)

   - **React App Security Group**:
     ```python
     # Create a security group for the React app instance
     react_security_group = aws.ec2.SecurityGroup("react-secgrp",
         vpc_id=vpc.id,
         description='Enable SSH and Nginx access for React app instance',
         ingress=[
             {'protocol': 'tcp', 'from_port': 22, 'to_port': 22, 'cidr_blocks': ['0.0.0.0/0']},
             {'protocol': '-1', 'from_port': 0, 'to_port': 65535, 'security_groups': [nginx_security_group.id]}
         ],
         egress=[
             {'protocol': '-1', 'from_port': 0, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0']}
         ]
     )

     pulumi.export("react_security_group_id", react_security_group.id)
     ```
     ![](https://github.com/Galadon123/Full-Stack-Application-with-React-Frontend-Flask-Backend-and-MySQL-Database/blob/main/Full-Project/images/react-sg.png)

   - **Flask App Security Group**:
     ```python
     # Create a security group for the Flask app instance
     flask_security_group = aws.ec2.SecurityGroup("flask-secgrp",
         vpc_id=vpc.id,
         description='Enable SSH and Nginx access for Flask app instance',
         ingress=[
             {'protocol': 'tcp', 'from_port': 22, 'to_port': 22, 'cidr_blocks': ['0.0.0.0/0']},
             {'protocol': '-1', 'from_port': 0, 'to_port': 65535, 'security_groups': [nginx_security_group.id]}
         ],
         egress=[
             {'protocol': '-1', 'from_port': 0, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0']}
         ]
     )

     pulumi.export("flask_security_group_id", flask_security_group.id)
     ```
     ![](https://github.com/Galadon123/Full-Stack-Application-with-React-Frontend-Flask-Backend-and-MySQL-Database/blob/main/Full-Project/images/flask-sg.png)

   - **MySQL Security Group**:
     ```python
     # Create a security group for the MySQL instance
     mysql_security_group = aws.ec2.SecurityGroup("mysql-secgrp",
         vpc_id=vpc.id,
         description='Enable SSH and MySQL access for MySQL instance',
         ingress=[
             {'protocol': 'tcp', 'from_port': 22, 'to_port': 22, 'cidr_blocks': ['0.0.0.0/0']},
             {'protocol': '-MYSQL/Aurora', 'from_port': 3306, 'to_port': 3306, 'security_groups': [flask_security_group.id]}
         ],
         egress=[
             {'protocol': '-1', 'from_port': 0, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0']}
         ]
     )

     pulumi.export("mysql_security_group_id", mysql_security_group.id)
     ```
     ![](https://github.com/Galadon123/Full-Stack-Application-with-React-Frontend-Flask-Backend-and-MySQL-Database/blob/main/Full-Project/images/mysql-sg.png)

2. **Create EC2 Instances**:

   - **Nginx Instance in Public Subnet**:
     ```python
     # Use the specified Ubuntu 24.04 LTS AMI
     ami_id = 'ami-04b70fa74e45c3917'

     # Create an EC2 instance for Nginx in the public subnet
     nginx_instance = aws.ec2.Instance("nginx-instance",
         instance_type="t2.micro",
         vpc_security_group_ids=[nginx_security_group.id],
         ami=ami_id,
         subnet_id=public_subnet.id,
         key_name="MyKeyPair",
         associate_public_ip_address=True
     )

     pulumi.export("nginx_instance_id", nginx_instance.id)
     pulumi.export("nginx_instance_ip", nginx_instance.public_ip)
     ```

   - **React App Instance in Private Subnet**:
     ```python
     # Create an EC2 instance for the React app in the private subnet
     react_instance = aws.ec2.Instance("react-instance",
         instance_type="t2.micro",
         vpc_security_group_ids=[react_security_group.id],
         ami=ami_id,
         subnet_id=private_subnet.id,
         key_name="MyKeyPair"
     )

     pulumi.export("react_instance_id", react_instance.id)
     ```

   - **Flask App Instance in Private Subnet**:
     ```python
     # Create an EC2 instance for the Flask app in the private subnet
     flask_instance = aws.ec2.Instance("flask-instance",
         instance_type="t2.micro",
         vpc_security_group_ids=[flask_security_group.id],
         ami=ami_id,
         subnet_id=private_subnet.id,
         key_name="MyKeyPair"
     )

     pulumi.export("flask_instance_id", flask_instance.id)
     ```

   - **MySQL Instance in Private Subnet**:
     ```python
     # Create an EC2 instance for MySQL in the private subnet
     mysql_instance = aws.ec2.Instance("mysql-instance",
         instance_type="t2.micro",
         vpc_security_group_ids=[mysql_security_group.id],
         ami=ami_id,
         subnet_id=private_subnet.id,
         key_name="MyKeyPair"
     )

     pulumi.export("mysql_instance_id", mysql_instance.id)
     ```

### Step 5: Deploy the Pulumi Stack

1. **Run Pulumi Up**:
   - Deploy the stack using:
     ```sh
     pulumi up
     ```
   - Review the changes and confirm by typing "yes".

### Step 6: Copy the Key Pair to the Public Instance

1. **Copy the Key Pair to the Public Instance**:
   - On your local machine, run the following command to copy the key pair to the public instance:
     ```sh
     scp -i MyKeyPair.pem MyKeyPair.pem ubuntu@<nginx-instance-ip>:/home/ubuntu/
     ```
   - Replace `<nginx_instance_ip>` with the public IP address of the Nginx instance.

### Step 7: Access the Public Instance via SSH

1. **SSH into the Public Instance**:
   - Open a terminal and run:
     ```sh
     ssh -i MyKeyPair.pem ubuntu@<nginx_instance_ip>
     ```
   - Replace `<nginx_instance_ip>` with the public IP address of the Nginx instance, which you can find in the Pulumi output or the AWS Management Console.



### Step 8: SSH from the Public Instance to the Private Instances

1. **SSH into the Private Instances from the Public Instance**:
   - On the public instance, change the permissions of the copied key pair:
     ```sh
     chmod 400 MyKeyPair.pem
     ```
   - Then, SSH into the private instances:
     ```sh
     ssh -i MyKeyPair.pem ubuntu@<react_instance_ip>
     ssh -i MyKeyPair.pem ubuntu@<flask_instance_ip>
     ssh -i MyKeyPair.pem ubuntu@<mysql_instance_ip>
     ```
   - Replace `<react_instance_ip>`, `<flask_instance_ip>`, and `<mysql_instance_ip>` with the private IP addresses of the respective instances, which you can find in the Pulumi output or the AWS Management Console.
### Outputs:
Resource Map for VPC we created:
![](https://github.com/Galadon123/Full-Stack-Application-with-React-Frontend-Flask-Backend-and-MySQL-Database/blob/main/Full-Project/images/res-map-1.png)

![](https://github.com/Galadon123/Full-Stack-Application-with-React-Frontend-Flask-Backend-and-MySQL-Database/blob/main/Full-Project/images/res-map-2.png)

### Summary

By following these steps, you will have set up a VPC with one public subnet and one private subnet, launched EC2 instances in both subnets (Nginx in the public subnet, and React, Flask, and MySQL in the private subnet), and used SSH to connect from the public subnet instance to the private subnet instances using Pulumi and AWS CLI on Windows. If you encounter any issues or need further assistance, feel free to ask!