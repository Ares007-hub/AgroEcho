<?php
// auth.php - Sistema de Autenticação
require_once 'config.php';

session_start();

class Auth {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    // Login do usuário
    public function login($email, $password) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE email = ? AND status = 'active'");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['senha_hash'])) {
                // Atualizar último login
                $updateStmt = $this->db->prepare("UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?");
                $updateStmt->execute([$user['id']]);
                
                // Criar sessão
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['nome'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_role'] = $user['role'];
                
                // Registrar log
                $this->logActivity($user['id'], 'login', 'Login realizado com sucesso');
                
                return [
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['nome'],
                        'email' => $user['email'],
                        'role' => $user['role']
                    ]
                ];
            }
            
            return ['success' => false, 'message' => 'Email ou senha inválidos'];
            
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erro no servidor: ' . $e->getMessage()];
        }
    }
    
    // Criar novo usuário (apenas admin)
    public function createUser($data, $adminId) {
        // Verificar se é admin
        if (!$this->isAdmin($adminId)) {
            return ['success' => false, 'message' => 'Acesso negado. Apenas administradores podem criar usuários.'];
        }
        
        try {
            // Verificar se email já existe
            $stmt = $this->db->prepare("SELECT id FROM usuarios WHERE email = ?");
            $stmt->execute([$data['email']]);
            
            if ($stmt->fetch()) {
                return ['success' => false, 'message' => 'Email já cadastrado'];
            }
            
            // Hash da senha
            $senhaHash = password_hash($data['password'], PASSWORD_DEFAULT);
            
            // Inserir usuário
            $stmt = $this->db->prepare("
                INSERT INTO usuarios (nome, email, senha_hash, role, telefone) 
                VALUES (?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $data['name'],
                $data['email'],
                $senhaHash,
                $data['role'] ?? 'user',
                $data['phone'] ?? null
            ]);
            
            $userId = $this->db->lastInsertId();
            
            // Registrar log
            $this->logActivity($adminId, 'create_user', "Usuário criado: {$data['name']} (ID: $userId)");
            
            return ['success' => true, 'message' => 'Usuário criado com sucesso', 'user_id' => $userId];
            
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erro ao criar usuário: ' . $e->getMessage()];
        }
    }
    
    // Verificar se é admin
    public function isAdmin($userId = null) {
        if ($userId === null) {
            return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
        }
        
        $stmt = $this->db->prepare("SELECT role FROM usuarios WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        return $user && $user['role'] === 'admin';
    }
    
    // Verificar se está logado
    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }
    
    // Logout
    public function logout() {
        if (isset($_SESSION['user_id'])) {
            $this->logActivity($_SESSION['user_id'], 'logout', 'Logout realizado');
        }
        
        session_destroy();
        return ['success' => true, 'message' => 'Logout realizado com sucesso'];
    }
    
    // Registrar log de atividade
    private function logActivity($userId, $action, $description) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO logs_sistema (usuario_id, acao, descricao, ip_address) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$userId, $action, $description, $_SERVER['REMOTE_ADDR'] ?? null]);
        } catch (PDOException $e) {
            // Falha silenciosa para não interromper o fluxo principal
        }
    }
    
    // Obter dashboard do usuário
    public function getUserDashboard() {
        if (!$this->isLoggedIn()) {
            return ['success' => false, 'message' => 'Não autenticado'];
        }
        
        $userId = $_SESSION['user_id'];
        $isAdmin = $_SESSION['user_role'] === 'admin';
        
        try {
            // Se for admin, retorna todos os dispositivos
            if ($isAdmin) {
                $stmt = $this->db->prepare("
                    SELECT d.*, td.nome as tipo_nome, td.modelo, s.nome as setor_nome,
                           f.nome as fazenda_nome
                    FROM dispositivos d
                    LEFT JOIN tipos_dispositivos td ON d.tipo_id = td.id
                    LEFT JOIN setores s ON d.setor_id = s.id
                    LEFT JOIN fazendas f ON d.fazenda_id = f.id
                    ORDER BY d.status, d.nome
                ");
                $stmt->execute();
            } else {
                // Se for usuário comum, retorna apenas dispositivos de suas fazendas
                $stmt = $this->db->prepare("
                    SELECT d.*, td.nome as tipo_nome, td.modelo, s.nome as setor_nome,
                           f.nome as fazenda_nome
                    FROM dispositivos d
                    LEFT JOIN tipos_dispositivos td ON d.tipo_id = td.id
                    LEFT JOIN setores s ON d.setor_id = s.id
                    LEFT JOIN fazendas f ON d.fazenda_id = f.id
                    WHERE f.usuario_id = ?
                    ORDER BY d.status, d.nome
                ");
                $stmt->execute([$userId]);
            }
            
            $devices = $stmt->fetchAll();
            
            // Estatísticas
            $statsQuery = "
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as ativos,
                    SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inativos,
                    SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as manutencao,
                    AVG(bateria) as bateria_media,
                    AVG(sinal_dbm) as sinal_medio
                FROM dispositivos
            ";
            
            if (!$isAdmin) {
                $statsQuery .= " WHERE fazenda_id IN (SELECT id FROM fazendas WHERE usuario_id = ?)";
                $statsStmt = $this->db->prepare($statsQuery);
                $statsStmt->execute([$userId]);
            } else {
                $statsStmt = $this->db->prepare($statsQuery);
                $statsStmt->execute();
            }
            
            $stats = $statsStmt->fetch();
            
            // Últimas leituras
            $readingsStmt = $this->db->prepare("
                SELECT ls.*, d.nome as dispositivo_nome
                FROM leituras_sensores ls
                JOIN dispositivos d ON ls.dispositivo_id = d.id
                WHERE ls.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                ORDER BY ls.timestamp DESC
                LIMIT 50
            ");
            $readingsStmt->execute();
            $readings = $readingsStmt->fetchAll();
            
            return [
                'success' => true,
                'is_admin' => $isAdmin,
                'devices' => $devices,
                'stats' => $stats,
                'readings' => $readings,
                'user' => [
                    'id' => $userId,
                    'name' => $_SESSION['user_name'],
                    'email' => $_SESSION['user_email'],
                    'role' => $_SESSION['user_role']
                ]
            ];
            
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Erro ao carregar dashboard: ' . $e->getMessage()];
        }
    }
}

// API Endpoint Handler
header('Content-Type: application/json');

$auth = new Auth();
$action = $_POST['action'] ?? $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        echo json_encode($auth->login($email, $password));
        break;
        
    case 'logout':
        echo json_encode($auth->logout());
        break;
        
    case 'create_user':
        $data = [
            'name' => $_POST['name'] ?? '',
            'email' => $_POST['email'] ?? '',
            'password' => $_POST['password'] ?? '',
            'role' => $_POST['role'] ?? 'user',
            'phone' => $_POST['phone'] ?? ''
        ];
        $adminId = $_SESSION['user_id'] ?? 0;
        echo json_encode($auth->createUser($data, $adminId));
        break;
        
    case 'dashboard':
        echo json_encode($auth->getUserDashboard());
        break;
        
    case 'check_auth':
        echo json_encode([
            'authenticated' => $auth->isLoggedIn(),
            'is_admin' => $auth->isAdmin()
        ]);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Ação não especificada']);
}
?>