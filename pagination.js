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
            student.classList.add("hidden"); // Спочатку зникають
            setTimeout(() => {
                student.style.display =
                    index >= (page - 1) * studentsPerPage && index < page * studentsPerPage
                        ? "table-row"
                        : "none";
                student.classList.remove("hidden"); // Потім плавно з’являються
            }, 200);
        });

        currentPage = page;
        updatePagination();
    }

    function updatePagination() {
        let students = getStudents();
        let totalPages = Math.ceil(students.length / studentsPerPage);

        pageNumbersContainer.innerHTML = ""; // Очищуємо номери сторінок

        if (students.length === 0) {
            emptyMessage.style.display = "block";
            prevPageBtn.style.display = "none";
            nextPageBtn.style.display = "none";
        } else {
            emptyMessage.style.display = "none";
            prevPageBtn.style.display = "inline-block";
            nextPageBtn.style.display = "inline-block";

            for (let i = 1; i <= totalPages; i++) {
                let pageBtn = document.createElement("button");
                pageBtn.textContent = i;
                pageBtn.classList.add("page-btn");
                if (i === currentPage) pageBtn.classList.add("active");

                pageBtn.addEventListener("click", () => showPage(i));
                pageNumbersContainer.appendChild(pageBtn);
            }

            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        }
    }

    function refreshPagination() {
        let students = getStudents();
        let totalPages = Math.ceil(students.length / studentsPerPage);

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }
        showPage(currentPage);
    }

    // Оновлення пагінації після додавання студента
    document.getElementById("add-student-btn").addEventListener("click", function () {
        setTimeout(refreshPagination, 100); // Невелика затримка, щоб DOM оновився
    });

    // Оновлення пагінації після видалення студента
    studentsList.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            setTimeout(refreshPagination, 100);
        }
    });

    prevPageBtn.addEventListener("click", () => showPage(currentPage - 1));
    nextPageBtn.addEventListener("click", () => showPage(currentPage + 1));

    showPage(1);
});
