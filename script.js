
document.addEventListener("DOMContentLoaded", function () {
    let studentsLink = document.getElementById("students-link");
    let studentsTable = document.getElementById("students-table");
    let addStudentBtn = document.getElementById("add-student-btn");
    let modal = document.getElementById("add-student-modal");
    let closeModal = document.querySelector(".close");
    let cancelBtn = document.getElementById("cancel-btn");
    let createBtn = document.getElementById("create-btn");
    let studentsList = document.getElementById("students-list");

    // Показати таблицю студентів
    studentsLink.addEventListener("click", function (event) {
        event.preventDefault();
        studentsTable.style.display = studentsTable.style.display === "none" ? "block" : "none";
    });

    // Відкрити модальне вікно
    addStudentBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    // Закрити модальне вікно
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    cancelBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Додати студента до таблиці
    createBtn.addEventListener("click", function () {
        let group = document.getElementById("student-group").value;
        let firstName = document.getElementById("student-firstname").value;
        let lastName = document.getElementById("student-lastname").value;
        let gender = document.getElementById("student-gender").value;
        let birthday = document.getElementById("student-birthday").value;

        if (firstName.trim() === "" || lastName.trim() === "" || birthday.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }

        let newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td class="checkbox"><input type="checkbox"></td>
            <td>${group}</td>
            <td>${firstName} ${lastName}</td>
            <td>${gender}</td>
            <td>${birthday}</td>
            <td><p class="status1">s</p></td>
            <td><i class="fa-solid fa-xmark"></i> <i class="fa-solid fa-pencil"></i></td>
        `;

        studentsList.appendChild(newRow);
        modal.style.display = "none";
    });
});