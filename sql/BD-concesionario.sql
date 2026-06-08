-- bASE DE DATOS
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS concesionario_mgb;
USE concesionario_mgb;

CREATE TABLE IF NOT EXISTS T_COCHE (
    identificador INT          PRIMARY KEY,
    marca         VARCHAR(50)  NOT NULL,
    modelo        VARCHAR(50)  NOT NULL,
    cilindrada    INT          NOT NULL,
    CONSTRAINT CHK_CILINDRADA_POSITIVA CHECK (cilindrada > 0)
);

INSERT INTO T_COCHE VALUES (1, 'Renault', 'Megane', 1500);
INSERT INTO T_COCHE VALUES (2, 'Seat',    'León',   1600);
INSERT INTO T_COCHE VALUES (3, 'Suzuki',  'Vitara', 1900);
INSERT INTO T_COCHE VALUES (4, 'Seat',    'Clio',   1400);
INSERT INTO T_COCHE VALUES (5, 'Seat',    'Ibiza',  1400);
INSERT INTO T_COCHE VALUES (6, 'Peugeot', '308',    2000);
INSERT INTO T_COCHE VALUES (7, 'Renault', 'Megane', 1500);
