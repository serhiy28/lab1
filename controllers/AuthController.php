<?php
// require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/User.php';

class AuthController {
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';

            $user = User::authenticate($username, $password);
            if ($user) {
                session_start();
                $_SESSION['user'] = $user;
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
            }
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        echo json_encode(['success' => true]);
    }
                                                
    public function getUser() {
        session_start();
        if (isset($_SESSION['user'])) {
            echo json_encode(['success' => true, 'user' => $_SESSION['user']]);
        } else {
            echo json_encode(['success' => false]);
        }
    }
}