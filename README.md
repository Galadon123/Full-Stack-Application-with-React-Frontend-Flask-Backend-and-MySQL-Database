### Step 1: Install and Configure AWS CLI

1. **Install AWS CLI**:
   - Download and install the AWS CLI MSI Installer for Windows from [AWS CLI installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

2. **Configure AWS CLI**:
   - Open Command Prompt or PowerShell and run:
     ```sh
     aws configure
     ```
   - Enter your AWS Access Key ID, Secret Access Key, default region (`us-east-1`), and default output format (`json`).

### Step 2: Install Pulumi

1. **Install Pulumi CLI**:
   - Download and install the Pulumi CLI from [Pulumi Installation Guide](https://www.pulumi.com/docs/get-started/install/).

2. **Set Up a Pulumi Project**:
   - Create a new directory for your project and navigate into it:
     ```sh
     mkdir my-vpc-project
     cd my-vpc-project
     ```

3. **Initialize a New Pulumi Project**:
   - Run the following command to create a new Pulumi project:
     ```sh
     pulumi new aws-python
     ```
   - Follow the prompts to set up your project.
4.  **Create a Key pair**:


```sh
aws ec2 create-key-pair --key-name MyKeyPair --query 'KeyMaterial' --output text > MyKeyPair.pem
```
5. **Set File Permissions Using PowerShell**:

    - **For Windows**: Open PowerShell and navigate to the directory where MyKeyPair.pem is located. Then, use the following command to set the correct permissions:

      ```powershell
      icacls MyKeyPair.pem /inheritance:r
      icacls MyKeyPair.pem /grant:r "$($env:USERNAME):(R)"
      ```
    - **For Linux**:

      ```
      chmod 400 <MykeyPair.pem>
      ```
### Step 3: Create the Pulumi Program

1. **Install Necessary Python Packages**:
   - Create a `requirements.txt` file and add the following dependencies:
     ```plaintext
     pulumi
     pulumi-aws
     ```
   - Install the dependencies using:
     ```sh
     pip install -r requirements.txt
     ```

2. **Update `__main__.py`**:
   - Open the `__main__.py` file and replace its contents with the following code to set up the VPC, subnets, NAT Gateway, EC2 instances, and security groups:

```python
import pulumi
from pulumi_aws import ec2, get_caller_identity

# Get the current AWS account ID and region
caller_identity = get_caller_identity()

# Create a new VPC
vpc = ec2.Vpc('my-vpc',
    cidr_block='10.0.0.0/16',
    enable_dns_support=True,
    enable_dns_hostnames=True,
    tags={'Name': 'my-vpc'}
)

# Create an Internet Gateway
igw = ec2.InternetGateway('vpc-igw',
    vpc_id=vpc.id,
    tags={'Name': 'my-vpc-igw'}
)

# Create a public subnet
public_subnet = ec2.Subnet('public-subnet-1',
    vpc_id=vpc.id,
    cidr_block='10.0.1.0/24',
    map_public_ip_on_launch=True,
    availability_zone='us-east-1a',
    tags={'Name': 'public-subnet-1'}
)

# Create a private subnet
private_subnet = ec2.Subnet('private-subnet-3',
    vpc_id=vpc.id,
    cidr_block='10.0.3.0/24',
    availability_zone='us-east-1a',
    tags={'Name': 'private-subnet-3'}
)

# Create an Elastic IP for the NAT Gateway
nat_eip = ec2.Eip('nat-eip',
    vpc=True,
    tags={'Name': 'nat-eip'}
)

# Create the NAT Gateway in the public subnet
nat_gateway = ec2.NatGateway('nat-gateway',
    subnet_id=public_subnet.id,
    allocation_id=nat_eip.id,
    tags={'Name': 'nat-gateway'}
)

# Create a route table and associate it with the public subnet
public_route_table = ec2.RouteTable('public-route-table',
    vpc_id=vpc.id,
    routes=[{
        'cidr_block': '0.0.0.0/0',
        'gateway_id': igw.id,
    }],
    tags={'Name': 'public-route-table'}
)

public_route_table_association = ec2.RouteTableAssociation('public-route-table-association',
    subnet_id=public_subnet.id,
    route_table_id=public_route_table.id
)

# Create a route table for the private subnet
private_route_table = ec2.RouteTable('private-route-table',
    vpc_id=vpc.id,
    routes=[{
        'cidr_block': '0.0.0.0/0',
        'nat_gateway_id': nat_gateway.id,
    }],
    tags={'Name': 'private-route-table'}
)

private_route_table_association = ec2.RouteTableAssociation('private-route-table-association',
    subnet_id=private_subnet.id,
    route_table_id=private_route_table.id
)

# Security Groups
# Nginx Security Group
nginx_sg = ec2.SecurityGroup('nginx-sg',
    vpc_id=vpc.id,
    description='Allow HTTP and SSH traffic',
    ingress=[
        {'protocol': 'tcp', 'from_port': 80, 'to_port': 80, 'cidr_blocks': ['0.0.0.0/0']},
        {'protocol': 'tcp', 'from_port': 22, 'to_port': 22, 'cidr_blocks': ['0.0.0.0/0']},
    ],
    egress=[
        {'protocol': 'tcp', 'from_port': 0, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0']},
    ],
    tags={'Name': 'nginx-sg'}
)

# React Security Group
react_sg = ec2.SecurityGroup('react-sg',
    vpc_id=vpc.id,
    description='Allow traffic from Nginx and SSH traffic',
    ingress=[
        {'protocol': 'tcp', 'from_port': 80, 'to_port': 80, 'security_groups': [nginx_sg.id]},
        {'protocol': 'tcp', 'from_port': 22, 'to_port': 22, 'cidr_blocks': ['0.0.0.0/0']},
    ],
    egress=[
        {'protocol': 'tcp', 'from_port': 0, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0']},
    ],
    tags={'Name': 'react-sg'}
)

# Flask Security Group
flask_sg = ec2.SecurityGroup('flask-sg',
    vpc_id=vpc.id,
    description='Allow traffic from React via Nginx and SSH traffic',
    ingress=[
        {'protocol': 'tcp', 'from_port': 80, 'to_port': 80, 'security_groups': [react_sg.id]},
        {'protocol': 'tcp', 'from_port': 22, 'to_port': 22, 'cidr_blocks': ['0.0.0.0/0']},
    ],
    egress=[
        {'protocol': 'tcp', 'from_port': 0, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0']},
    ],
    tags={'Name': 'flask-sg'}
)

# MySQL Security Group
mysql_sg = ec2.SecurityGroup('mysql-sg',
    vpc_id=vpc.id,
    description='Allow traffic from Flask and SSH traffic',
    ingress=[
        {'protocol': 'tcp', 'from_port': 3306, 'to_port': 3306, 'security_groups': [flask_sg.id]},
        {'protocol': 'tcp', 'from_port': 22, 'to_port': 22, 'cidr_blocks': ['0.0.0.0/0']},
    ],
    egress=[
        {'protocol': 'tcp', 'from_port': 0, 'to_port': 0, 'cidr_blocks': ['0.0.0.0/0']},
    ],
    tags={'Name': 'mysql-sg'}
)

# Specify the key pair name
key_name = 'MyKeyPair'

# EC2 Instances
# Nginx Instance in the Public Subnet
nginx_instance = ec2.Instance('nginx-instance',
    instance_type='t2.micro',
    ami='ami-04b70fa74e45c3917',  # Ubuntu 24.04 LTS AMI for us-east-1
    subnet_id=public_subnet.id,
    vpc_security_group_ids=[nginx_sg.id],
    key_name=key_name,
    tags={'Name': 'nginx-instance'}
)

# React Instance in the Private Subnet
react_instance = ec2.Instance('react-instance',
    instance_type='t2.micro',
    ami='ami-04b70fa74e45c3917',  # Ubuntu 24.04 LTS AMI for us-east-1
    subnet_id=private_subnet.id,
    vpc_security_group_ids=[react_sg.id],
    key_name=key_name,
    tags={'Name': 'react-instance'}
)

# Flask Instance for React in the Private Subnet
flask_instance = ec2.Instance('flask-instance',
    instance_type='t2.micro',
    ami='ami-04b70fa74e45c3917',  # Ubuntu 24.04 LTS AMI for us-east-1
    subnet_id=private_subnet.id,
    vpc_security_group_ids=[flask_sg.id],
    key_name=key_name,
    tags={'Name': 'flask-instance'}
)

# MySQL Instance in the Private Subnet
mysql_instance = ec2.Instance('mysql-instance',
    instance_type='t2.micro',
    ami='ami-04b70fa74e45c3917',  # Ubuntu 24.04 LTS AMI for us-east-1
    subnet_id=private_subnet.id,
    vpc_security_group_ids=[mysql_sg.id],
    key_name=key_name,
    tags={'Name': 'mysql-instance'}
)

# Create Endpoints
endpoints = ec2.VpcEndpoint('my-endpoints',
    vpc_id=vpc.id,
    service_name='com.amazonaws.us-east-1.s3',  # Change to desired AWS service
    vpc_endpoint_type='Interface',
    subnet_ids=[public_subnet.id, private_subnet.id],
    security_group_ids=[nginx_sg.id, react_sg.id, flask_sg.id, mysql_sg.id],
    tags={'Name': 'my-endpoints'}
)

# Export the VPC ID, public subnet ID, private subnet ID, and instances
pulumi.export('vpc_id', vpc.id)
pulumi.export('public_subnet_id', public_subnet.id)
pulumi.export('private_subnet_id', private_subnet.id)
pulumi.export('nginx_instance_id', nginx_instance.id)
pulumi.export('react_instance_id', react_instance.id)
pulumi.export('flask_instance_id', flask_instance.id)
pulumi.export('mysql_instance_id', mysql_instance.id)
pulumi.export('vpc_endpoint_id', endpoints.id)
```

### Step 4: Deploy the Pulumi Stack

1. **Run Pulumi Up**:
   - Deploy the stack using:
     ```sh
     pulumi up
     ```
   - Review the changes and confirm by typing "yes".

### Step 5: Verify the Deployment

1. **Check the Outputs**:
   - After the deployment completes, you should see the exported VPC ID, public subnet ID, private subnet ID, and instance IDs in the output.

2. **Verify in AWS Management Console**:
   - Go to the [AWS Management Console](https://aws.amazon.com/console/) and navigate to the VPC, EC2, Subnet, and NAT Gateway sections to verify that the resources have been created as expected.

### Summary

By following these steps, you will have set up a VPC with one public subnet and one private subnet, including a NAT Gateway, and configured EC2 instances for Nginx, React, Flask, and MySQL with appropriate security groups using Pulumi and AWS CLI on Windows. If you encounter any issues or need further assistance, feel free to ask!