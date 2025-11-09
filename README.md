# Library Resource Center
Library Resource Center is a small scale custom web-based library management system , build upon mysql database for crud operations .

- Built a interactive neubrutalist ui using html,css and vanilla js.
- Built a node server with multiple defined api's for operations

## Previews

<img width="822" height="649" alt="Image" src="https://github.com/user-attachments/assets/31c05397-e6cf-41fc-ba33-900de638bbae" />

<img width="1783" height="693" alt="Image" src="https://github.com/user-attachments/assets/6250e17c-3d98-475c-9729-d5d3eabe1501" />


## Api's

- `/books` — fetch all books
- `/books/search` — search books by column

- `/login/student` — student login
- `/login/staff` — staff login

- `/student/search` — search students
- `/staff/search` — search staff
- `/issue_history/search` — search issue history

- `/info/student` — fetch single student info
- `/info/students` — fetch all students
- `/info/staff` — fetch single staff info
- `/info/staffs` — fetch all staff
- `/info/student/issue_history` — fetch a student’s issue history
- `/info/issue_history` — fetch complete issue history

- `/add/student` — add student (with image)
- `/add/staff` — add staff (with image)
- `/add/book`— add new book or update existing quantity

- `/delete/student` — delete student
- `/delete/staff`— delete staff
- `/delete/book` — delete book

- `/issue` — issue a book to a student
- `/return` — return a book from a student


## File structure
```
.
├── public
│   └── images
│       ├── staff
│       │   ├── 101.jpg
│       │   ├── 102.jpg
│       │   └── 103.jpg
│       └── students
│           ├── 2023001.jpg
│           ├── 2023002.jpg
│           ├── 2023003.jpg
│           └── 2023004.jpg
├── README.md
└── src
    ├── server
    │   ├── db.js
    │   ├── package.json
    │   └── package-lock.json
    └── style
        ├── css
        │   ├── add-book-modal.css
        │   ├── add-staff-modal.css
        │   ├── add-student-modal.css
        │   ├── custom-alert.css
        │   ├── delete-confirm-modal.css
        │   ├── issue-book-modal.css
        │   ├── return-book-modal.css
        │   ├── staff.css
        │   ├── staff_work_style.css
        │   ├── student.css
        │   ├── style.css
        │   ├── style-profile.css
        │   ├── style_staff.css
        │   └── style_student.css
        ├── index.html
        ├── issue_successfull.html
        ├── js
        │   └── custom-alert.js
        ├── profile_and_dashboard_logic
        │   ├── staff.js
        │   ├── staff_profile.js
        │   ├── student.js
        │   └── student_profile.js
        ├── sign_in_logic
        │   ├── staffsigninjs.js
        │   └── studentsigninjs.js
        ├── staff.html
        ├── staff_issue.html
        ├── staff_manage_book.html
        ├── staff_manage_issue.html
        ├── staff_manage_staff.html
        ├── staff_manage_student.html
        ├── staff_profile.html
        ├── staff-signin.html
        ├── staff_work_logic
        │   ├── staff_manage_book.js
        │   ├── staff_manage_issue.js
        │   ├── staff_manage_return.js
        │   ├── staff_manage_staff.js
        │   └── staff_manage_student.js
        ├── student.html
        ├── student_profile.html
        └── student-signin.html
```

## Usage

1. Make sure to have mysql workbench installed .
2. Start the workbench using :
( for linux )
  ```bash
  sudo systemctl start mysql
  ```
3. Create and open database named testdb using :
```sql
CREATE DATABASE testdb;
USE testdb;
```
4. Run the following sql file inside the workbench
- [SQL File](./run.sql)
- [Dummy Data](./dummy.sql)
5. Clone the project
```bash
git clone https://github.com/vansh-garg8923/Library-Management-System.git
```
6. Get into the server
```bash
cd Library-Management-System/src/server
```
7. Make sure to set your mysql password in the `db.js` file
```js
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Your Password comes here",  // <-->
  database: "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```
8. Finally start the project
```bash
npm i
npm run start
```
9. You can view the project on `localhost:3001`

