# Employee Reimbursement System (ERS)

## Project Overview  
The **Employee Reimbursement System (ERS)** is a Java Full Stack application that allows employees to submit reimbursement requests and managers to review and resolve them. The system ensures secure user access and proper role-based functionalities.  

---

## Features  

### Employee Functionality  
- Create an account (default role: Employee).  
- Log in to the system.  
- Submit a new reimbursement request.  
- View all their own reimbursement requests.  
- Filter to see only **pending** reimbursement requests.  
- *(Optional)* Update the description of a pending reimbursement.  

### Manager Functionality  
- View all reimbursement requests.  
- Filter to see only **pending** reimbursements.  
- Update reimbursement status to **APPROVED** or **DENIED**.  
- View all users in the system.  
- Delete a user (deletes associated reimbursements as well).  
- *(Optional)* Update an employee’s role to **Manager**.  

### General  
- Secure user login.  
- Unauthorized users can only:  
   - Register a new account.  
   - Attempt to log in.  

---

## Technology Stack  
- **Frontend**: React.js  
- **Backend**: Spring Boot  
- **Database**: PostgreSQL (local or cloud-based)  
- **Logging**: Logback *(Optional)*  
- **Testing**: JUnit *(Optional)*  

---

## Database Schema  
- **User Table**: Stores user details (ID, first name, last name, username, password, role).  
- **Reimbursement Table**: Tracks reimbursement submissions (ID, description, amount, status, associated user ID).  

---

## Optional Features  
- Logback logging for the service layer.  
- JUnit test suite for the service layer.  
- User logout functionality.  

---

## Getting Started  
1. Clone the repository.  
2. Set up the PostgreSQL database and update connection details.  
3. Run the Spring Boot backend.  
4. Launch the React frontend.  

---

## Author
Adam Abdulkadir  

