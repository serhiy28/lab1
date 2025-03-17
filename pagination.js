document.addEventListener("DOMContentLoaded", function () {
    const studentsList = document.getElementById("students-list");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageNumbersContainer = document.getElementById("page-numbers");
    const emptyMessage = document.getElementById("empty-message");

    const studentsPerPage = 4; // Скільки студентів на сторінці
    let currentPage = 1;

    function getStudents() {
        return Array.from(studentsList.children);
    }

    function showPage(page) {
        let students = getStudents();
        let totalPages = Math.ceil(students.length / studentsPerPage);
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
    
        students.forEach((student, index) => {
            student.style.display =
                index >= (page - 1) * studentsPerPage && index < page * studentsPerPage
                    ? "table-row"
                    : "none";
        });
    
        currentPage = page;
        updatePagination();
    }

    function updatePagination() {
        let students = getStudents();
        let totalPages = Math.ceil(students.length / studentsPerPage);
        let currentButtons = pageNumbersContainer.children.length;
    
        if (students.length === 0) {
            emptyMessage.style.display = "block";
            prevPageBtn.style.display = "none";
            nextPageBtn.style.display = "none";
            pageNumbersContainer.innerHTML = "";
        } else {
            emptyMessage.style.display = "none";
            prevPageBtn.style.display = "inline-block";
            nextPageBtn.style.display = "inline-block";
    
            // Оновлюємо кнопки лише якщо кількість сторінок змінилася
            if (currentButtons !== totalPages) {
                pageNumbersContainer.innerHTML = ""; // Очищаємо лише при зміні кількості сторінок
                for (let i = 1; i <= totalPages; i++) {
                    let pageBtn = document.createElement("button");
                    pageBtn.textContent = i;
                    pageBtn.classList.add("page-btn");
                    if (i === currentPage) pageBtn.classList.add("active");
                    pageBtn.addEventListener("click", () => showPage(i));
                    pageNumbersContainer.appendChild(pageBtn);
                }
            } else {
                // Оновлюємо лише активний стан кнопок
                Array.from(pageNumbersContainer.children).forEach((btn, index) => {
                    btn.classList.toggle("active", index + 1 === currentPage);
                });
            }
    
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        }
    }

    window.refreshPagination = function() {
        let students = getStudents();
        let totalPages = Math.ceil(students.length / studentsPerPage);
    
        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        showPage(currentPage); // Виклик без затримки
    }

    // Оновлення пагінації після додавання студента
    // document.getElementById("add-student-btn").addEventListener("click", function () {
    //     setTimeout(refreshPagination, 10); // Невелика затримка, щоб DOM оновився
    // });

    // // Оновлення пагінації після видалення студента
    // studentsList.addEventListener("click", function (event) {
    //     if (event.target.classList.contains("delete-btn")) {
    //         setTimeout(refreshPagination, 10);
    //     }
    // });

    prevPageBtn.addEventListener("click", () => showPage(currentPage - 1));
    nextPageBtn.addEventListener("click", () => showPage(currentPage + 1));

    showPage(1);
});
