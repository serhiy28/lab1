<?php
require_once __DIR__ . '/../config/database.php';

class User {
    public static function authenticate($username, $password) {
        $students = Database::getStudents();
        foreach ($students as $student) {
            // Логін: firstName.lastName, пароль: birthday (YYYY-MM-DD)
            $expectedUsername = strtolower($student['firstName'] . '.' . $student['lastName']);
            if ($username === $expectedUsername && $password === $student['birthday']) {
                return [
                    'id' => $student['id'],
                    'username' => $username,
                    'firstName' => $student['firstName'],
                    'lastName' => $student['lastName']
                ];
            }
        }
        return null;
    }
}