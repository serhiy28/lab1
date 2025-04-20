$(document).ready(function () {
    let studentsTable = $("#students-table");
    let addStudentBtn = $("#add-student-btn");
    let modal = $("#add-student-modal");
    let loginModal = $("#login-modal");
    let closeModal = $(".close");
    let cancelBtn = $("#cancel-btn");
    let saveBtn = $("#save-btn");
    let studentsList = $("#students-list");
    let studentForm = $("#student-form");
    let modalTitle = $("#modal-title");
    let loginForm = $("#login-form");
    let loginBtn = $("#login-btn");
    let logoutBtn = $("#logout-btn");
    let userName = $("#user-name");
    let bellIcon = $(".bell");
    let userIcon = $(".icon1");

    let deleteConfirmModal = $("#delete-confirm-modal");
    let deleteConfirmMessage = $("#delete-confirm-message");
    let closeDeleteConfirm = $(".close-delete-confirm");
    let cancelDeleteBtn = $("#cancel-delete-btn");
    let confirmDeleteBtn = $("#confirm-delete-btn");

    let checkboxWarningModal = $("#checkbox-warning-modal");
    let closeCheckboxWarning = $(".close-checkbox-warning");
    let closeWarningBtn = $("#close-warning-btn");

    let selectAllCheckbox = $("#select-all-checkbox");

    let editingRow = null;

    function checkAuth() {
        $.ajax({
            url: '/lab2/public/api/user',
            method: 'GET',
            success: function (response) {
                if (response.success) {
                    loginBtn.hide();
                    logoutBtn.show();
                    userName.text(`${response.user.firstName} ${response.user.lastName}`).show();
                    bellIcon.show();
                    userIcon.show();
                    addStudentBtn.show();
                    $(".delete-student, .edit-student").show();
                    $("#students-link, a[href='/tasks.html']").css('pointer-events', 'auto');
                    loadStudents();
                } else {
                    loginBtn.show();
                    logoutBtn.hide();
                    userName.hide();
                    bellIcon.hide();
                    userIcon.hide();
                    addStudentBtn.hide();
                    $(".delete-student, .edit-student").hide();
                    $("#students-link, a[href='/tasks.html']").css('pointer-events', 'none');
                    studentsList.empty();
                    studentsTable.hide();
                }
            },
            error: function (xhr, status, error) {
                console.error('checkAuth error:', error);
                loginBtn.show();
                logoutBtn.hide();
                userName.hide();
                bellIcon.hide();
                userIcon.hide();
                addStudentBtn.hide();
                $(".delete-student, .edit-student").hide();
                $("#students-link, a[href='/tasks.html']").css('pointer-events', 'none');
                studentsList.empty();
                studentsTable.hide();
            }
        });
    }

    function loadStudents() {
        $.ajax({
            url: '/lab2/public/api/students',
            method: 'GET',
            success: function (students) {
                studentsList.empty();
                students.forEach(student => {
                    const row = createStudentRow(student);
                    studentsList.append(row);
                });
                window.refreshPagination();
            },
            error: function (xhr, status, error) {
                console.error('loadStudents error:', error);
                studentsList.empty();
                studentsTable.hide();
            }
        });
    }

    function createStudentRow(student) {
        const tr = $(`<tr data-id="${student.id}"></tr>`);
        tr.html(`
            <td class="checkbox"><input type="checkbox" id="checkbox-${student.id}"><label for="checkbox-${student.id}" style="visibility: hidden;">fd</label></td>
            <td>${student.group}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.gender}</td>
            <td>${formatDate(student.birthday)}</td>
            <td><span class="status1" data-status="${student.status}"></span></td>
            <td>
                <i class="fa-solid fa-xmark delete-student"></i>
                <i class="fa-solid fa-pencil edit-student"></i>
            </td>
        `);
        return tr;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    loginBtn.on("click", function () {
        loginModal.css("display", "flex");
        $("#username-error, #password-error").hide();
    });

    loginForm.on("submit", function (event) {
        event.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();

        $.ajax({
            url: '/lab2/public/api/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function (response) {
                if (response.success) {
                    loginModal.css("display", "none");
                    checkAuth();
                } else {
                    $("#username-error").text(response.error).show();
                }
            },
            error: function (xhr, status, error) {
                console.error('Login error:', error);
                $("#username-error").text("Server error. Please try again.").show();
            }
        });
    });

    logoutBtn.on("click", function () {
        $.ajax({
            url: '/lab2/public/api/logout',
            method: 'POST',
            success: function () {
                checkAuth();
            },
            error: function (xhr, status, error) {
                console.error('Logout error:', error);
            }
        });
    });

    $("#students-link").on("click", function (event) {
        event.preventDefault();
        studentsTable.toggle();
        if (studentsTable.is(":visible")) {
            window.refreshPagination();
        }
    });

    addStudentBtn.on("click", function () {
        modalTitle.text("Add Student");
        studentForm[0].reset();
        $("#student-id").val("");
        modal.css("display", "flex");
        resetValidation();
        editingRow = null;
    });

    closeModal.on("click", closeModalFunc);
    cancelBtn.on("click", closeModalFunc);

    function closeModalFunc() {
        modal.css("display", "none");
        loginModal.css("display", "none");
        resetValidation();
        editingRow = null;
    }

    function resetValidation() {
        $("#student-form input, #student-form select").removeClass("invalid valid");
        $(".error-message").hide();
    }

    function validateGroup(group) {
        return group !== "";
    }

    function validateName(name) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(name);
        const isSelect = /^select$/i.test(name);
        const nameRegex = /^[A-ZА-ЯІЇЄҐ][\p{L}'\s-]{1,}$/u;
        const isValidName = nameRegex.test(name);
        const startsWithCapital = /^[A-ZА-ЯІЇЄҐ]/.test(name);

        let isValid = false;
        let errorType = '';

        if (isEmail) {
            errorType = 'email';
        } else if (isSelect) {
            errorType = 'select';
        } else if (!startsWithCapital) {
            errorType = 'capital';
        } else if (!isValidName) {
            errorType = 'format';
        } else {
            isValid = true;
        }

        return { isValid, errorType };
    }

    function validateGender(gender) {
        return gender !== "";
    }

    function validateBirthday(birthday) {
        if (!birthday) return false;
        let birthDate = new Date(birthday);
        if (isNaN(birthDate.getTime())) return false;
        const currentDate = new Date("2025-01-01");
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();
        const dayDiff = currentDate.getDate() - birthDate.getDate();
        const adjustedAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
        return adjustedAge >= 15 && adjustedAge <= 80;
    }

    function validateStatus(status) {
        return status !== "";
    }

    function validateField(fieldId, validateFunc, errorIdBase) {
        const $field = $(fieldId);
        const value = $field.val();
        const result = validateFunc(value);
        const isValid = typeof result === "object" ? result.isValid : result;
        const errorType = typeof result === "object" ? result.errorType : '';

        $field.toggleClass("invalid", !isValid).toggleClass("valid", isValid);
        $(`${errorIdBase}-capital`).hide();
        $(`${errorIdBase}-email`).hide();
        $(`${errorIdBase}-format`).hide();
        $(`${errorIdBase}-select`).hide();
        $(`${errorIdBase}`).hide();

        if (!isValid) {
            if (errorType) {
                $(`${errorIdBase}-${errorType}`).show();
            } else {
                $(`${errorIdBase}`).show();
            }
        }

        return isValid;
    }

    $("#student-group").on("change", function () {
        validateField("#student-group", validateGroup, "#group-error");
    });

    $("#student-firstname").on("input", function () {
        validateField("#student-firstname", validateName, "#firstname-error");
    });

    $("#student-lastname").on("input", function () {
        validateField("#student-lastname", validateName, "#lastname-error");
    });

    $("#student-gender").on("change", function () {
        validateField("#student-gender", validateGender, "#gender-error");
    });

    $("#student-birthday").on("change", function () {
        validateField("#student-birthday", validateBirthday, "#birthday-error");
    });

    $("#student-status").on("change", function () {
        validateField("#student-status", validateStatus, "#status-error");
    });

    studentForm.on("submit", function (event) {
        event.preventDefault();
        const isGroupValid = validateField("#student-group", validateGroup, "#group-error");
        const isFirstNameValid = validateField("#student-firstname", validateName, "#firstname-error");
        const isLastNameValid = validateField("#student-lastname", validateName, "#lastname-error");
        const isGenderValid = validateField("#student-gender", validateGender, "#gender-error");
        const isBirthdayValid = validateField("#student-birthday", validateBirthday, "#birthday-error");
        const isStatusValid = validateField("#student-status", validateStatus, "#status-error");

        if (isGroupValid && isFirstNameValid && isLastNameValid && isGenderValid && isBirthdayValid && isStatusValid) {
            let studentData = serializeFormData();
            const url = editingRow ? `/lab2/public/api/students/${studentData.id}` : '/lab2/public/api/students';
            const method = editingRow ? 'PUT' : 'POST';

            $.ajax({
                url: url,
                method: method,
                contentType: 'application/json',
                data: JSON.stringify(studentData),
                success: function (response) {
                    if (response.success) {
                        loadStudents();
                        modal.css("display", "none");
                        editingRow = null;
                    } else {
                        for (let field in response.errors) {
                            $(`#${field}-error`).text(response.errors[field]).show();
                        }
                    }
                }
            });
        }
    });

    function serializeFormData() {
        let formData = studentForm.serializeArray();
        let studentData = {};
        formData.forEach(item => {
            studentData[item.name] = item.value;
        });
        return studentData;
    }

    studentsList.on("click", ".delete-student", function () {
        let row = $(this).closest("tr");
        let checkbox = row.find("input[type='checkbox']");

        if (!checkbox.prop("checked")) {
            checkboxWarningModal.css("display", "flex");
            return;
        }

        let checkedRows = studentsList.find("tr").filter(function () {
            return $(this).find("input[type='checkbox']").prop("checked");
        });

        if (checkedRows.length > 0) {
            let studentNames = checkedRows.map(function () {
                return $(this).find("td").eq(2).text();
            }).get();

            if (studentNames.length === 1) {
                deleteConfirmMessage.text(`Are you sure you want to delete student ${studentNames[0]}?`);
            } else {
                let namesList = studentNames.join(", ");
                deleteConfirmMessage.text(`Are you sure you want to delete the following students: ${namesList}?`);
            }

            deleteConfirmModal.css("display", "flex");
        }
    });

    studentsList.on("click", ".edit-student", function () {
        editingRow = $(this).closest("tr");
        let studentId = editingRow.attr("data-id");

        $.ajax({
            url: `/lab2/public/api/students`,
            method: 'GET',
            success: function (students) {
                let student = students.find(s => s.id == studentId);
                if (student) {
                    $("#student-id").val(student.id);
                    $("#student-group").val(student.group);
                    $("#student-firstname").val(student.firstName);
                    $("#student-lastname").val(student.lastName);
                    $("#student-gender").val(student.gender);
                    $("#student-birthday").val(student.birthday);
                    $("#student-status").val(student.status);

                    modalTitle.text("Edit Student");
                    modal.css("display", "flex");
                    resetValidation();
                    $("#student-form input, #student-form select").each(function () {
                        $(this).trigger($(this).is("input[type='text']") ? "input" : "change");
                    });
                }
            }
        });
    });

    selectAllCheckbox.on("change", function () {
        let isChecked = selectAllCheckbox.prop("checked");
        studentsList.find("input[type='checkbox']").prop("checked", isChecked);
    });

    closeDeleteConfirm.on("click", function () {
        deleteConfirmModal.css("display", "none");
    });
    cancelDeleteBtn.on("click", function () {
        deleteConfirmModal.css("display", "none");
    });

    confirmDeleteBtn.on("click", function () {
        let checkedRows = studentsList.find("tr").filter(function () {
            return $(this).find("input[type='checkbox']").prop("checked");
        });

        let ids = checkedRows.map(function () {
            return $(this).attr("data-id");
        }).get();

        $.ajax({
            url: '/lab2/public/api/students',
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ ids }),
            success: function (response) {
                if (response.success) {
                    loadStudents();
                    deleteConfirmModal.css("display", "none");
                } else {
                    alert(response.error);
                }
            }
        });
    });

    closeCheckboxWarning.on("click", function () {
        checkboxWarningModal.css("display", "none");
    });
    closeWarningBtn.on("click", function () {
        checkboxWarningModal.css("display", "none");
    });

    checkAuth();
});