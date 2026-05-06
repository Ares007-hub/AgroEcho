-- ============================================
-- DADOS DE EXEMPLO - AGROFLOW
-- ============================================
USE agroflow_db;

-- Inserir usuários (senha: admin123, joao123, maria123)
-- Em produção, usar bcrypt para hash das senhas
INSERT INTO usuarios (nome, email, senha_hash, role, telefone) VALUES
('Administrador', 'admin@agroflow.com.br', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '(11) 99999-9999'),
('João Silva', 'joao@fazenda.com.br', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '(11) 98888-8888'),
('Maria Santos', 'maria@fazenda.com.br', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '(11) 97777-7777');

-- Inserir fazendas
INSERT INTO fazendas (usuario_id, nome, localizacao, latitude, longitude, area_total, cultura_principal) VALUES
(1, 'Fazenda AgroTech', 'Rodovia SP-340, Km 150', -23.5505, -46.6333, 150.50, 'Soja'),
(2, 'Sítio São João', 'Estrada Rural, Km 12', -23.5510, -46.6340, 25.00, 'Hortaliças'),
(3, 'Chácara Santo Antônio', 'Zona Rural, Lote 45', -23.5520, -46.6350, 10.00, 'Frutas');

-- Inserir setores
INSERT INTO setores (fazenda_id, nome, area, tipo_solo, cultura, umidade_ideal_min, umidade_ideal_max) VALUES
(1, 'Setor Norte', 50.00, 'Argiloso', 'Soja', 30.00, 70.00),
(1, 'Setor Sul', 50.00, 'Arenoso', 'Milho', 25.00, 65.00),
(1, 'Setor Central', 50.50, 'Misto', 'Trigo', 35.00, 75.00),
(2, 'Horta Principal', 15.00, 'Orgânico', 'Hortaliças', 40.00, 80.00),
(3, 'Pomar', 10.00, 'Argiloso', 'Frutas Cítricas', 30.00, 70.00);

-- Inserir tipos de dispositivos
INSERT INTO tipos_dispositivos (nome, modelo, fabricante, descricao, tipo_comunicacao, intervalo_leitura) VALUES
('Sensor de Umidade do Solo', 'Capacitivo v1.2', 'Generic', 'Sensor capacitivo resistente à corrosão', 'LoRa', 300),
('Pluviômetro', 'Báscula', 'Davis Instruments', 'Mede precipitação em mm', 'LoRa', 600),
('Sensor de Fluxo de Água', 'YF-S201', 'YF', 'Mede vazão de água em L/min', 'LoRa', 60),
('Sensor de Temperatura', 'DS18B20', 'Maxim', 'Sensor de temperatura à prova d\'água', 'LoRa', 300),
('Sensor de Radiação Solar', 'BH1750', 'ROHM', 'Mede luminosidade em lux', 'LoRa', 300);

-- Inserir dispositivos
INSERT INTO dispositivos (id, setor_id, fazenda_id, tipo_id, nome, firmware_version, status, bateria, sinal_dbm, ultima_comunicacao, data_instalacao) VALUES
('ESP32-SOIL-001', 1, 1, 1, 'Sensor Umidade Solo - Setor Norte', '1.2.0', 'active', 87.00, -85.00, NOW(), '2024-01-15'),
('ESP32-RAIN-002', 3, 1, 2, 'Pluviômetro - Setor Central', '1.1.0', 'active', 92.00, -78.00, NOW(), '2024-01-15'),
('ESP32-FLOW-003', NULL, 1, 3, 'Sensor de Fluxo - Bomba Principal', '1.0.5', 'active', 95.00, -72.00, NOW(), '2024-01-15'),
('ESP32-TEMP-004', 2, 1, 4, 'Sensor Temperatura - Setor Sul', '1.2.0', 'inactive', 12.00, -95.00, DATE_SUB(NOW(), INTERVAL 3 HOUR), '2024-01-15'),
('ESP32-LUX-005', NULL, 1, 5, 'Sensor Radiação Solar - Central', '1.1.0', 'active', 88.00, -76.00, NOW(), '2024-01-15'),
('ESP32-SOIL-006', 4, 2, 1, 'Sensor Umidade - Horta', '1.2.0', 'active', 90.00, -82.00, NOW(), '2024-02-20'),
('ESP32-SOIL-007', 5, 3, 1, 'Sensor Umidade - Pomar', '1.2.0', 'active', 85.00, -88.00, NOW(), '2024-03-10');

-- Inserir leituras de exemplo (últimas 24 horas)
INSERT INTO leituras_sensores (dispositivo_id, tipo_leitura, valor, unidade, timestamp) VALUES
('ESP32-SOIL-001', 'umidade', 869.000, 'kPa', NOW()),
('ESP32-SOIL-001', 'umidade', 850.000, 'kPa', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('ESP32-SOIL-001', 'umidade', 830.000, 'kPa', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('ESP32-RAIN-002', 'pluviometria', 2.500, 'mm', NOW()),
('ESP32-FLOW-003', 'fluxo_agua', 12.300, 'L/min', NOW()),
('ESP32-TEMP-004', 'temperatura', 28.500, '°C', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
('ESP32-LUX-005', 'radiacao_solar', 624.000, 'lux', NOW());

-- Inserir irrigações de exemplo
INSERT INTO irrigacoes (setor_id, dispositivo_id, data_hora_inicio, data_hora_fim, volume_agua, vazao_media, duracao_minutos, motivo, status, custo_energia, tarifa_tipo) VALUES
(1, 'ESP32-FLOW-003', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR), 5000.00, 12.50, 60, 'programada', 'concluida', 25.50, 'normal'),
(2, 'ESP32-FLOW-003', DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, 2500.00, 10.00, 30, 'umidade_baixa', 'em_andamento', 5.20, 'fora_ponta');

-- Inserir tarifas de energia
INSERT INTO tarifas_energia (fazenda_id, tipo_tarifa, hora_inicio, hora_fim, valor_kwh) VALUES
(1, 'normal', '00:00:00', '17:59:59', 0.45),
(1, 'ponta', '18:00:00', '20:59:59', 4.50),
(1, 'fora_ponta', '21:00:00', '23:59:59', 0.35),
(2, 'normal', '00:00:00', '17:59:59', 0.42),
(2, 'ponta', '18:00:00', '20:59:59', 4.20);

-- Inserir alertas
INSERT INTO alertas (usuario_id, dispositivo_id, tipo, nivel, titulo, mensagem) VALUES
(1, 'ESP32-TEMP-004', 'bateria_baixa', 'critical', 'Bateria Crítica', 'Dispositivo ESP32-TEMP-004 está com 12% de bateria'),
(1, 'ESP32-FLOW-003', 'info', 'info', 'Irrigação Concluída', 'Setor Norte concluiu irrigação programada');

-- Inserir configurações do sistema
INSERT INTO configuracoes_sistema (chave, valor, descricao) VALUES
('versao_sistema', '1.0.0', 'Versão atual do sistema AgroFlow'),
('limite_bateria_alerta', '20', 'Porcentagem mínima de bateria para alerta'),
('intervalo_leitura_padrao', '300', 'Intervalo padrão entre leituras em segundos'),
('tempo_offline_alerta', '3600', 'Tempo em segundos para considerar dispositivo offline'),
('email_admin', 'admin@agroflow.com.br', 'Email do administrador do sistema');