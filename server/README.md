# How to run this project ?
## 1. Clone this project
	Copy file .env.example -> create a .env file at the root folder -> fill all app variables in the .evn file
    	PORT: server port
        HOST_NAME: The hostname or IP address of the server (e.g., localhost or a remote IP)

        user: The username to connect to the Oracle database
        password: The password for the Oracle database user
        connectString: The connection string used to identify the Oracle database (format: hostname/service_name, e.g., localhost/orcl).
        privilege: The privilege level for the Oracle connection, such as SYSDBA for administrative access.
	Run the "npm install" to test project at the localhost
## 2. Start project
	npm start (runs the Node.js server using the server file with the default Node.js runtime).
    npm run dev (runs the server using nodemon, which automatically restarts the server when files change).
