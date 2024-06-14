## Lab 1: VPC, Public Subnet, Public Route Table, IGW

### Introduction

In this lab, you will learn how to set up a basic network infrastructure on AWS using a Virtual Private Cloud (VPC). Specifically, you will:

1. **Configure AWS CLI and Install Pulumi**: Set up the necessary tools to manage your AWS resources programmatically.
2. **Create a VPC**: A virtual network dedicated to your AWS account where you can launch AWS resources.
3. **Create a Public Subnet**: A subnet that can route traffic to and from the Internet via an Internet Gateway.
4. **Create an Internet Gateway (IGW)**: A gateway that allows instances in your VPC to communicate with the Internet.
5. **Create a Public Route Table**: A route table that routes traffic destined for the Internet to the Internet Gateway and associate it with the public subnet.

By the end of this lab, you will have a VPC with one public subnet that can communicate with the Internet. This setup forms the foundation for more complex network architectures and is essential for running public-facing applications on AWS.

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

### Step 3: Set Up a Pulumi Project

1. **Set Up a Pulumi Project**:
   - Create a new directory for your project and navigate into it:
     ```sh
     mkdir my-vpc-project
     cd my-vpc-project
     ```

2. **Initialize a New Pulumi Project**:
   - Run the following command to create a new Pulumi project:
     ```sh
     pulumi new aws-python
     ```
   - Follow the prompts to set up your project.

### Step 4: Create the Pulumi Program

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

4. **Create the Internet Gateway**:
   - An Internet Gateway (IGW) allows communication between instances in your VPC and the Internet.
   ```python
   # Create an Internet Gateway
   igw = aws.ec2.InternetGateway("internet-gateway",
       vpc_id=vpc.id
   )

   pulumi.export("igw_id", igw.id)
   ```

5. **Create the Route Table and Associate with Public Subnet**:
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

### Step 5: Deploy the Pulumi Stack

1. **Run Pulumi Up**:
   - Deploy the stack using:
     ```sh
     pulumi up
     ```
   - Review the changes and confirm by typing "yes".

### Step 6: Verify the Deployment

1. **Check the Outputs**:
   - After the deployment completes, you should see the exported VPC ID, public subnet ID, and route table ID in the output.

2. **Verify in AWS Management Console**:
   - Go to the [AWS Management Console](https://aws.amazon.com/console/) and navigate to the VPC, Subnet, and Internet Gateway sections to verify that the resources have been created as expected.

### Summary

By following these steps, you will have set up a VPC with one public subnet, a public route table, and an Internet Gateway using Pulumi and AWS CLI on Windows. If you encounter any issues or need further assistance, feel free to ask!