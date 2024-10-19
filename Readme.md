

**Prerequisites:**

*   Node.js (version 14.18+ or 16+) installed on your system. You can verify by running node -v in your terminal.
    
*   A code editor or IDE of your choice (e.g., Visual Studio Code, Sublime Text)
    

**Steps:**

1.  **Clone the Project Repository (if applicable):**
    
    *   If the project code is hosted on a platform like GitHub, clone the repository using Git (git clone https://github.com/username/job-posting-project.git).
        
2.  **Set Up the Backend (Node.js):**
    
    *   Navigate to the backend folder within the project directory.
        
    *   Edit the .env file according to your needs:
        
        *   Replace YOUR\_EMAIL with your actual email address for Nodemailer functionality (e.g., sending application notifications).
            
        *   Update password-related values (e.g., database connection password) if necessary.
            
3.  **Install Backend Dependencies:**
    
    *   Open a terminal in the backend folder.
        
    *   Run npm install to install the required Node.js packages.
        
4.  **Start the Backend Server:**
    
    *   Run node server.js in the terminal. This will start the backend server on port localhost:5002.
        
5.  **Set Up the Frontend (Vite):**
    
    *   Navigate to the frontend folder within the project directory.
        
6.  **Install Frontend Dependencies:**
    
    *   Open a terminal in the frontend folder.
        
    *   Run npm install to install the necessary Vite and React dependencies.
        
7.  **Start the Development Server (if the port hasn't been changed):**
    
    *   npm run dev
        
    *   This will start the frontend development server on localhost:5173 by default. You should see your job-posting application running in the browser.
        

**Additional Notes:**

*   If the port values in the frontend's .env file have been changed, you'll need to adjust the npm run dev command accordingly (e.g., npm run dev PORT=3000).
    
*   When making changes to the codebase, be sure to restart the development servers (npm run dev in the frontend folder, node server.js in the backend folder) to see the updated behavior.
    
*   Remember to update the .env file with your own email address and password details for Nodemailer to function correctly.
    

**Live Link:**

*   The live link you provided (https://job-posting-frontend-three.vercel.app/) points to the deployed version of the frontend. You'll need to follow these instructions to run the project locally on your machine.
    

I hope this comprehensive guide helps you get started with the job-posting project! If you encounter any issues, feel free to ask for further assistance.
