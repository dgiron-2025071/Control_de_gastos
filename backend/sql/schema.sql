-- Control-Gastos: schema inicial (solo autenticación)
-- Ejecutar contra la base de datos control_gastos

CREATE TABLE IF NOT EXISTS users (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(150) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    role           VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Evita duplicados de correo sin importar mayúsculas/minúsculas
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));
