document.addEventListener("DOMContentLoaded", function () {
    let studentsLink = document.getElementById("students-link");
    let studentsTable = document.getElementById("students-table");
    let addStudentBtn = document.getElementById("add-student-btn");
    let modal = document.getElementById("add-student-modal");
    let closeModal = document.querySelector(".close");
    let cancelBtn = document.getElementById("cancel-btn");
    let createBtn = document.getElementById("create-btn");
    let studentsList = document.getElementById("students-list");
    let studentGroup = document.getElementById("student-group");
    let studentFirstName = document.getElementById("student-firstname");
    let studentLastName = document.getElementById("student-lastname");
    let studentGender = document.getElementById("student-gender");
    let studentBirthday = document.getElementById("student-birthday");
    let studentStatus = document.getElementById("student-status");

    let editingRow = null;

    // Initial students array
    const initialStudents = [
        {
            group: "PZ-24",
            firstName: "Serhiy",
            lastName: "Matrokhin",
            gender: "Non-binary",
            birthday: "2006-08-03", // Using ISO format (YYYY-MM-DD) for consistency
            status: "Offline"
        },
        {
            group: "PZ-25",
            firstName: "Anna",
            lastName: "Kovalenko",
            gender: "Female",
            birthday: "2005-04-15",
            status: "Online"
        },
        {
            group: "PZ-24",
            firstName: "Ivan",
            lastName: "Petrenko",
            gender: "Male",
            birthday: "2006-11-22",
            status: "Offline"
        },
        {
            group: "PZ-24",
            firstName: "Ivan",
            lastName: "Petrenko",
            gender: "Male",
            birthday: "2006-11-22",
            status: "Offline"
        }
    ];

    // Function to create a table row from student data
    function createStudentRow(student) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="checkbox"><input type="checkbox"></td>
            <td>${student.group}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.gender}</td>
            <td>${formatDate(student.birthday)}</td>
            <td><span class="status1" data-status="${student.status}"></span></td>
            <td>
                <i class="fa-solid fa-xmark delete-student"></i>
                <i class="fa-solid fa-pencil edit-student"></i>
            </td>
        `;
        return tr;
    }

    // Function to format date from YYYY-MM-DD to DD.MM.YYYY
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    // Initialize table with students
    function initializeStudents() {
        studentsList.innerHTML = ""; // Clear any existing content
        initialStudents.forEach(student => {
            const row = createStudentRow(student);
            studentsList.appendChild(row);
        });
    }

    // Показати/сховати таблицю студентів
    studentsLink.addEventListener("click", function (event) {
        event.preventDefault();
        studentsTable.style.display = studentsTable.style.display === "none" ? "block" : "none";
    });

    // Відкрити модальне вікно для додавання нового студента
    addStudentBtn.addEventListener("click", function () {
        modal.style.display = "flex";
        editingRow = null;
        clearModalFields();
    });

    // Закрити модальне вікно
    closeModal.addEventListener("click", closeModalFunc);
    cancelBtn.addEventListener("click", closeModalFunc);

    function closeModalFunc() {
        modal.style.display = "none";
        editingRow = null;
    }

    // Очистити поля форми
    function clearModalFields() {
        studentGroup.value = "PZ-24";
        studentFirstName.value = "";
        studentLastName.value = "";
        studentGender.value = "Male";
        studentBirthday.value = "";
        studentStatus.value = "Offline";
    }

    // Додати або оновити студента
    createBtn.addEventListener("click", function () {
        let group = studentGroup.value;
        let firstName = studentFirstName.value.trim();
        let lastName = studentLastName.value.trim();
        let gender = studentGender.value;
        let birthday = studentBirthday.value;
        let status = studentStatus.value;
    
        if (firstName === "" || lastName === "" || birthday === "") {
            alert("Будь ласка, заповніть усі поля.");
            return;
        }
    
        if (editingRow) {
            editingRow.cells[1].textContent = group;
            editingRow.cells[2].textContent = `${firstName} ${lastName}`;
            editingRow.cells[3].textContent = gender;
            editingRow.cells[4].textContent = formatDate(birthday);
            editingRow.cells[5].innerHTML = `<span class="status1" data-status="${status}"></span>`;
        } else {
            let newRow = createStudentRow({
                group,
                firstName,
                lastName,
                gender,
                birthday,
                status
            });
            studentsList.appendChild(newRow);
        }
    
        modal.style.display = "none";
        editingRow = null;
        window.refreshPagination();
    });

    // Обробка натискань на іконки видалення та редагування
    studentsList.addEventListener("click", function (event) {
        let target = event.target;

        // Видалення студента
        if (target.classList.contains("delete-student")) {
            target.closest("tr").remove();
            window.refreshPagination();
        }

        // Редагування студента
        if (target.classList.contains("edit-student")) {
            let row = target.closest("tr");
            editingRow = row;
        
            studentGroup.value = row.cells[1].textContent;
            let fullName = row.cells[2].textContent.split(" ");
            studentFirstName.value = fullName[0];
            studentLastName.value = fullName[1] || "";
            studentGender.value = row.cells[3].textContent;
            let birthdayText = row.cells[4].textContent;
            let statusElement = row.cells[5].querySelector(".status1");
            studentStatus.value = statusElement.getAttribute("data-status") || "Offline";
        
            if (birthdayText.includes(".")) {
                let birthParts = birthdayText.split(".");
                studentBirthday.value = `${birthParts[2]}-${birthParts[1]}-${birthParts[0]}`;
            } else {
                studentBirthday.value = birthdayText;
            }
        
            modal.style.display = "flex";
        }
    });

    // Initialize the table with initial students
    initializeStudents();
});