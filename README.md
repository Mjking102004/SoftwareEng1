# SoftwareEng1

---

## Prerequisites

Install the following tools before setting up the repository:

- **Git**: [Download Git](https://github.com/git-guides/install-git)
- **Docker Desktop**: [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)
  > **Note for Docker:** Ensure hardware virtualization, you will find out when you install docker
- **pgAdmin 4**: [Download pgAdmin](https://www.pgadmin.org/download/) (install the native desktop application for your operating system, not the container image).

---

## Getting Started

### 1. Clone & Branch

1. Clone the repository to your local machine:
   ```bash
   git clone <REPO_URL>
   cd SoftwareEng1
   ```
2. Create and switch to a new branch named after yourself:
   ```bash
   git checkout -b your-name
   ```

---

### 2. Configure pgAdmin 4

Connect pgAdmin to the local PostgreSQL container:

1. Open **pgAdmin 4**.
2. Right-click **Servers** in the Object Explorer on the left and select **Register > Server...**
3. On the **General** tab, set **Name** to `Local Docker` (or any preferred name).
4. Switch to the **Connection** tab and enter the following settings:
   - **Host name/address:** `localhost`
   - **Port:** `5432`
   - **Maintenance database:** `postgres`
   - **Username:** `postgres`
   - **Password:** `postgrespassword`
   - Check the box for **Save password?**
5. Click **Save**.

---

### 3. Run the Application

Start the containers using Docker Compose:

```bash
docker compose up --build -d
```

- **Frontend UI:** Open [http://localhost](http://localhost) in any browser.
- **Rebuilding:** Run `docker compose up --build -d` whenever backend, frontend, or configuration files are modified.
- **Hard Reset:** If you run into persistent errors or need to clear the database volume completely, run:
  ```bash
  docker compose down -v
  docker compose up --build -d
  ```

---

## Verifying the Setup

### End-to-End Test

1. Open [http://localhost](http://localhost) in your browser.
2. Enter text into the input field and click the submit button. The text will appear in the list below.
3. Stop the containers:
   ```bash
   docker compose down
   ```
4. Refresh the webpage; the browser will show a connection error.
5. Bring the containers back up without clearing volumes:
   ```bash
   docker compose up -d
   ```
6. Refresh [http://localhost](http://localhost); the previous text will still be present, confirming persistent database storage.

---

### Inspecting Database Records in pgAdmin

1. Open pgAdmin 4.
2. Right-click **Servers** in the Object Explorer and select **Refresh**.
3. Navigate the hierarchy:
   ```text
   Servers
   └── Local Docker
       └── Databases
           └── database
               └── Schemas
                   └── public
                       └── Tables
                           └── temp
   ```
4. Click to highlight the **`temp`** table NOT to dropdown futher.
5. In the top-right toolbar, click the middle icon (the table grid icon) labeled **All Rows**.
6. The entries you made earlier should not pop-up.

---

### When Commiting Code

```bash
   git add .
   git commit -m "Your message of the changes you made"
   git push
   ```
The first time you push to your brance it will give you a command to upstream to your branch, just copy and paste it into your terminal and going forward you can use "git push".
