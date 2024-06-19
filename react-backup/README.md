### Setting Up DNS Entries on a Local Machine

To set up DNS entries on your local machine, you need to edit the `/etc/hosts` file. This file is used to map IP addresses to hostnames locally, allowing you to access services using custom domain names without needing an external DNS server.

#### Steps to Set Up DNS Entries:

1. **Open the `/etc/hosts` File**:
   - Use a text editor to open the `/etc/hosts` file. You will need superuser (root) permissions to edit this file.
   - Example using `nano`:
     ```sh
     sudo nano /etc/hosts
     ```

2. **Add Your DNS Entries**:
   - Add the desired IP addresses and their corresponding hostnames to the file. Each entry should be on a new line and should follow the format: `IP_address  hostname`.
   - Here is an example based on your setup:
     ```sh
     <nginx-instance-public-ip> bus.students.poridhi.io
     <nginx-instance-public-ip> bus-api.students.poridhi.io
     <nginx-instance-public-ip> payment.students.poridhi.io
     <nginx-instance-public-ip> payment-api.students.poridhi.io
     ```

     ![](../images/dns-local.png)

3. **Save and Exit**:
   - If using `nano`, save the file by pressing `Ctrl + O`, then exit by pressing `Ctrl + X`.
   - If using `vi` or `vim`, save and exit by pressing `Esc`, then typing `:wq` and hitting `Enter`.

4. **Verify the Changes**:
   - You can verify the changes by pinging the hostnames you added to see if they resolve to the correct IP addresses.
   - Example:
     ```sh
     ping bus.students.poridhi.io
     ping bus-api.students.poridhi.io
     ping payment.students.poridhi.io
     ping payment-api.students.poridhi.io
     ```
     
By following these steps, you can set up custom DNS entries on your local machine, allowing you to use easy-to-remember domain names to access your local services.

