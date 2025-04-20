document.addEventListener("DOMContentLoaded", function () {
    const studentsTable = document.getElementById("students-table"); // Add this line
    const studentsList = document.getElementById("students-list");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const pageNumbersContainer = document.getElementById("page-numbers");
    // const emptyMessage = document.getElementById("empty-message");

    const studentsPerPage = 4; // Скільки студентів на сторінці
    let currentPage = 1;

    function getStudents() {
        return Array.from(studentsList ? studentsList.children : []);
    }

    function showPage(page) {
        if (!studentsTable || !studentsList || !prevPageBtn || !nextPageBtn || !pageNumbersContainer) {
            console.warn("Required DOM elements for pagination are missing.");
            return;
        }

        if (studentsTable.style.display === "none") {
            console.log('Students table is hidden, skipping pagination.');
            return;
        }

        console.log(`Showing page ${page}...`);
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
            // emptyMessage.style.display = "block";
            prevPageBtn.style.display = "none";
            nextPageBtn.style.display = "none";
            pageNumbersContainer.innerHTML = "";
        } else {
            // emptyMessage.style.display = "none";
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
            currentPage = totalPages || 1; // Ensure at least page 1 if no students
        }
        showPage(currentPage);
    };

    if (prevPageBtn) {
        prevPageBtn.addEventListener("click", () => showPage(currentPage - 1));
    }
    if (nextPageBtn) {
        nextPageBtn.addEventListener("click", () => showPage(currentPage + 1));
    }

    // Do not call showPage immediately; wait for script.js to trigger refreshPagination
});