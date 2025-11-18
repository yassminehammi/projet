<?php
header('Content-Type: application/json');

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pawsome_haven";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit();
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $fullname = trim($_POST['fullname']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validation
    $errors = [];
    
    // Validate full name
    if (strlen($fullname) < 3) {
        $errors[] = "Name must be at least 3 characters";
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    // Validate phone
    if (!preg_match("/^[0-9]{8,}$/", str_replace(' ', '', $phone))) {
        $errors[] = "Invalid phone number";
    }
    
    // Validate password
    if (strlen($password) < 6) {
        $errors[] = "Password must be at least 6 characters";
    }
    
    // Check if passwords match
    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match";
    }
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $errors[] = "Email already registered";
    }
    $stmt->close();
    
    // If there are errors, return them
    if (!empty($errors)) {
        echo json_encode([
            'success' => false,
            'message' => implode(', ', $errors)
        ]);
        exit();
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user into database
    $stmt = $conn->prepare("INSERT INTO users (fullname, email, phone, password, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssss", $fullname, $email, $phone, $hashed_password);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Account created successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error creating account: ' . $stmt->error
        ]);
    }
    
    $stmt->close();
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}

$conn->close();
?>