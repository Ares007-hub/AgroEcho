-- ============================================
-- BANCO DE DADOS AGROFLOW
-- Sistema de Irrigação Inteligente
-- ============================================

CREATE DATABASE IF NOT EXISTS agroflow_db;
USE agroflow_db;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    telefone VARCHAR(20),
    avatar VARCHAR(255) DEFAULT 'default.png',
    ultimo_login DATETIME,
    status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Tabela de dispositivos
CREATE TABLE dispositivos (
    id VARCHAR(50) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tipo VARCHAR(100),
    modelo VARCHAR(100),
    status ENUM('active', 'inactive', 'maintenance', 'error') DEFAULT 'active',
    bateria DECIMAL(5,2),
    sinal_dbm DECIMAL(5,2),
    ultima_comunicacao DATETIME,
    localizacao VARCHAR(255),
    firmware_version VARCHAR(20),
    data_instalacao DATE,
    usuario_id INT,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_usuario (usuario_id)
);

-- Tabela de leituras dos sensores
CREATE TABLE leituras_sensores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dispositivo_id VARCHAR(50) NOT NULL,
    tipo_leitura ENUM('umidade', 'temperatura', 'radiacao_solar', 'fluxo_agua', 
                       'pluviometria', 'bateria', 'sinal') NOT NULL,
    valor DECIMAL(10,3) NOT NULL,
    unidade VARCHAR(20) NOT NULL,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id) ON DELETE CASCADE,
    INDEX idx_dispositivo_tempo (dispositivo_id, timestamp),
    INDEX idx_timestamp (timestamp)
);

-- Tabela de logs do sistema
CREATE TABLE logs_sistema (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    acao VARCHAR(100) NOT NULL,
    descricao TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Inserir usuários padrão
INSERT INTO usuarios (nome, email, senha_hash, role, telefone) VALUES
('Administrador', 'admin@agroflow.com.br', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '(11) 99999-9999'),
('João Silva', 'joao@fazenda.com.br', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '(11) 98888-8888'),
('Maria Santos', 'maria@fazenda.com.br', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '(11) 97777-7777');

-- Inserir dispositivos de exemplo
INSERT INTO dispositivos (id, nome, tipo, modelo, status, bateria, sinal_dbm, ultima_comunicacao, localizacao, usuario_id) VALUES
('ESP32-SOIL-001', 'Sensor Umidade Solo - Setor Norte', 'Sensor Capacitivo v1.2', 'v1.2', 'active', 87.00, -85.00, NOW(), 'Setor Norte - Fazenda 1', 2),
('ESP32-RAIN-002', 'Pluviômetro - Setor Central', 'Pluviômetro de Báscula', 'v2.0', 'active', 92.00, -78.00, NOW(), 'Setor Central - Fazenda 1', 2),
('ESP32-FLOW-003', 'Sensor de Fluxo - Bomba Principal', 'YF-S201', 'v1.0', 'active', 95.00, -72.00, NOW(), 'Casa de Bombas', 2),
('ESP32-TEMP-004', 'Sensor Temperatura - Estufa', 'DS18B20', 'v1.5', 'inactive', 12.00, -95.00, NOW(), 'Estufa 1 - Fazenda 1', 2),
('ESP32-LUX-005', 'Sensor Radiação Solar', 'BH1750', 'v1.0', 'active', 88.00, -76.00, NOW(), 'Área Central', 3),
('ESP32-SOIL-006', 'Sensor Umidade - Horta', 'Sensor Capacitivo v1.2', 'v1.2', 'active', 90.00, -82.00, NOW(), 'Horta Principal', 3);

-- Inserir leituras de exemplo
INSERT INTO leituras_sensores (dispositivo_id, tipo_leitura, valor, unidade, timestamp) VALUES
('ESP32-SOIL-001', 'umidade', 869.000, 'kPa', NOW()),
('ESP32-RAIN-002', 'pluviometria', 2.500, 'mm', NOW()),
('ESP32-FLOW-003', 'fluxo_agua', 12.300, 'L/min', NOW()),
('ESP32-TEMP-004', 'temperatura', 28.500, '°C', NOW()),
('ESP32-LUX-005', 'radiacao_solar', 624.000, 'lux', NOW()),
('ESP32-SOIL-006', 'umidade', 750.000, 'kPa', NOW());