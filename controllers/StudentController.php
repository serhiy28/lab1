<?php
// require_once __DIR__ . '/../models/Student.php';
require_once __DIR__ . '/../models/Student.php';

class StudentController {
    public function index() {
        $students = Student::getAll();
        echo json_encode($students);
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $errors = Student::validate($data);

            if (empty($errors)) {
                $student = Student::create($data);
                echo json_encode(['success' => true, 'student' => $student]);
            } else {
                echo json_encode(['success' => false, 'errors' => $errors]);
            }
        }
    }

    public function update($id) {
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $data = json_decode(file_get_contents('php://input'), true);
            $data['id'] = $id;
            $errors = Student::validate($data);

            if (empty($errors)) {
                $student = Student::update($id, $data);
                if ($student) {
                    echo json_encode(['success' => true, 'student' => $student]);
                } else {
                    echo json_encode(['success' => false, 'error' => 'Student not found']);
                }
            } else {
                echo json_encode(['success' => false, 'errors' => $errors]);
            }
        }
    }

    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $data = json_decode(file_get_contents('php://input'), true);
            $ids = $data['ids'] ?? [];
            if (Student::delete($ids)) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Failed to delete students']);
            }
        }
    }
}