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

    // Елементи для модальних вікон видалення
    let deleteConfirmModal = document.getElementById("delete-confirm-modal");
    let deleteConfirmMessage = document.getElementById("delete-confirm-message");
    let closeDeleteConfirm = document.querySelector(".close-delete-confirm");
    let cancelDeleteBtn = document.getElementById("cancel-delete-btn");
    let confirmDeleteBtn = document.getElementById("confirm-delete-btn");

    let checkboxWarningModal = document.getElementById("checkbox-warning-modal");
    let closeCheckboxWarning = document.querySelector(".close-checkbox-warning");
    let closeWarningBtn = document.getElementById("close-warning-btn");

    // Чекбокс у заголовку
    let selectAllCheckbox = document.getElementById("select-all-checkbox");

    let editingRow = null;

    const initialStudents = [
        { group: "PZ-24", firstName: "Serhiy", lastName: "Matrokhin", gender: "Non-binary", birthday: "2006-08-03", status: "Offline" },
        { group: "PZ-25", firstName: "Anna", lastName: "Kovalenko", gender: "Female", birthday: "2005-04-15", status: "Online" },
        { group: "PZ-24", firstName: "Ivan", lastName: "Petrenko", gender: "Male", birthday: "2006-11-22", status: "Offline" },
        { group: "PZ-24", firstName: "Ivan", lastName: "Petrenko", gender: "Male", birthday: "2006-11-22", status: "Offline" }
    ];
    let i = 0;
    function createStudentRow(student) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="checkbox"><input type="checkbox" id="select-all-checkbox${i}"><label for="select-all-checkbox${i}" style="visibility: hidden;">fd</label></td>
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
        i++;
        return tr;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function initializeStudents() {
        studentsList.innerHTML = "";
        initialStudents.forEach(student => {
            const row = createStudentRow(student);
            studentsList.appendChild(row);
        });
    }

    studentsLink.addEventListener("click", function (event) {
        event.preventDefault();
        studentsTable.style.display = studentsTable.style.display === "none" ? "block" : "none";
    });

    addStudentBtn.addEventListener("click", function () {
        modal.style.display = "flex";
        editingRow = null;
        clearModalFields();
    });

    closeModal.addEventListener("click", closeModalFunc);
    cancelBtn.addEventListener("click", closeModalFunc);

    function closeModalFunc() {
        modal.style.display = "none";
        editingRow = null;
    }

    function clearModalFields() {
        studentGroup.value = "PZ-24";
        studentFirstName.value = "";
        studentLastName.value = "";
        studentGender.value = "Male";
        studentBirthday.value = "";
        studentStatus.value = "Offline";
    }

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
            let newRow = createStudentRow({ group, firstName, lastName, gender, birthday, status });
            studentsList.appendChild(newRow);
        }

        modal.style.display = "none";
        editingRow = null;
        window.refreshPagination();
    });

    studentsList.addEventListener("click", function (event) {
        let target = event.target;

        if (target.classList.contains("delete-student")) {
            let row = target.closest("tr");
            let checkbox = row.querySelector("input[type='checkbox']");

            // Якщо чекбокс у цьому рядку неактивний, показуємо попередження
            if (!checkbox.checked) {
                checkboxWarningModal.style.display = "flex";
                return;
            }

            // Отримуємо всі рядки з активними чекбоксами
            let checkedRows = Array.from(studentsList.querySelectorAll("tr"))
                .filter(row => row.querySelector("input[type='checkbox']").checked);

            if (checkedRows.length > 0) {
                // Формуємо список імен студентів
                let studentNames = checkedRows.map(row => row.cells[2].textContent);

                // Формуємо повідомлення залежно від кількості студентів
                if (studentNames.length === 1) {
                    deleteConfirmMessage.textContent = `Are you sure you want to delete student ${studentNames[0]}?`;
                } else {
                    let namesList = studentNames.join(", ");
                    deleteConfirmMessage.textContent = `Are you sure you want to delete the following students: ${namesList}?`;
                }

                deleteConfirmModal.style.display = "flex";
            }
        }

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

    // Обробник для чекбокса у заголовку
    selectAllCheckbox.addEventListener("change", function () {
        let isChecked = selectAllCheckbox.checked;
        let allCheckboxes = studentsList.querySelectorAll("input[type='checkbox']");

        allCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });

    // Закриття модального вікна підтвердження
    closeDeleteConfirm.addEventListener("click", function () {
        deleteConfirmModal.style.display = "none";
    });
    cancelDeleteBtn.addEventListener("click", function () {
        deleteConfirmModal.style.display = "none";
    });

    // Підтвердження видалення всіх студентів із активними чекбоксами
    confirmDeleteBtn.addEventListener("click", function () {
        let checkedRows = Array.from(studentsList.querySelectorAll("tr"))
            .filter(row => row.querySelector("input[type='checkbox']").checked);

        checkedRows.forEach(row => row.remove());
        deleteConfirmModal.style.display = "none";
        window.refreshPagination();
    });

    // Закриття модального вікна попередження
    closeCheckboxWarning.addEventListener("click", function () {
        checkboxWarningModal.style.display = "none";
    });
    closeWarningBtn.addEventListener("click", function () {
        checkboxWarningModal.style.display = "none";
    });

    initializeStudents();
});