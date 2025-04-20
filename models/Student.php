<?php
require_once __DIR__ . '/../config/database.php';

class Student {
    public static function getAll() {
        return Database::getStudents();
    }

    public static function findById($id) {
        $students = Database::getStudents();
        foreach ($students as $student) {
            if ($student['id'] == $id) {
                return $student;
            }
        }
        return null;
    }

    public static function validate($data) {
        $errors = [];

        // Валідація групи
        if (empty($data['group']) || !in_array($data['group'], ['PZ-24', 'PZ-25'])) {
            $errors['group'] = 'Please select a valid group.';
        }

        // Валідація імені
        if (empty($data['firstName']) || !preg_match("/^[A-ZА-ЯІЇЄҐ][\p{L}'\s-]{1,}$/u", $data['firstName'])) {
            $errors['firstName'] = 'First name must start with a capital letter and contain valid characters.';
        }
        if (preg_match("/^[^\s@]+@[^\s@]+\.[^\s@]+$/", $data['firstName'])) {
            $errors['firstName'] = 'First name cannot be an email address.';
        }
        if (strtolower($data['firstName']) === 'select') {
            $errors['firstName'] = 'First name cannot be "select".';
        }

        // Валідація прізвища
        if (empty($data['lastName']) || !preg_match("/^[A-ZА-ЯІЇЄҐ][\p{L}'\s-]{1,}$/u", $data['lastName'])) {
            $errors['lastName'] = 'Last name must start with a capital letter and contain valid characters.';
        }
        if (preg_match("/^[^\s@]+@[^\s@]+\.[^\s@]+$/", $data['lastName'])) {
            $errors['lastName'] = 'Last name cannot be an email address.';
        }
        if (strtolower($data['lastName']) === 'select') {
            $errors['lastName'] = 'Last name cannot be "select".';
        }

        // Перевірка на дублювання
        $students = Database::getStudents();
        foreach ($students as $student) {
            if (isset($data['id']) && $student['id'] == $data['id']) {
                continue; // Пропускаємо поточного студента при редагуванні
            }
            if (strtolower($student['firstName']) === strtolower($data['firstName']) &&
                strtolower($student['lastName']) === strtolower($data['lastName'])) {
                $errors['duplicate'] = 'A student with this name already exists.';
            }
        }

        // Валідація статі
        if (empty($data['gender']) || !in_array($data['gender'], ['Male', 'Female', 'Non-binary'])) {
            $errors['gender'] = 'Please select a valid gender.';
        }

        // Валідація дати народження
        if (empty($data['birthday'])) {
            $errors['birthday'] = 'Birthday is required.';
        } else {
            $birthDate = DateTime::createFromFormat('Y-m-d', $data['birthday']);
            $currentDate = new DateTime('2025-01-01');
            if (!$birthDate || $birthDate > $currentDate) {
                $errors['birthday'] = 'Invalid birthday.';
            } else {
                $age = $currentDate->diff($birthDate)->y;
                if ($age < 15 || $age > 80) {
                    $errors['birthday'] = 'Age must be between 15 and 80 years.';
                }
            }
        }

        // Валідація статусу
        if (empty($data['status']) || !in_array($data['status'], ['Online', 'Offline'])) {
            $errors['status'] = 'Please select a valid status.';
        }

        return $errors;
    }

    public static function create($data) {
        $students = Database::getStudents();
        $data['id'] = count($students) + 1;
        $students[] = $data;
        Database::saveStudents($students);
        return $data;
    }

    public static function update($id, $data) {
        $students = Database::getStudents();
        foreach ($students as &$student) {
            if ($student['id'] == $id) {
                $student = array_merge($student, $data);
                Database::saveStudents($students);
                return $student;
            }
        }
        return null;
    }

    public static function delete($ids) {
        $students = Database::getStudents();
        $newStudents = array_filter($students, function($student) use ($ids) {
            return !in_array($student['id'], $ids);
        });
        if (count($newStudents) < count($students)) {
            Database::saveStudents(array_values($newStudents));
            return true;
        }
        return false;
    }
}