
CREATE TABLE sanda_categoria (
                id uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
                edad_min INT NOT NULL,
                edad_max INT NOT NULL,
                descripcion VARCHAR NOT NULL,
                CONSTRAINT sanda_categoria_pk PRIMARY KEY (id)
);

CREATE TABLE sanda_peso (
                id uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
                peso_min REAL NOT NULL,
                peso_max REAL NOT NULL,
                categoria_id uniqueidentifier NOT NULL,
                descripcion VARCHAR(50) NOT NULL,
                CONSTRAINT sanda_peso_pk PRIMARY KEY (id)
);

CREATE TABLE evento (
                id uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
                nombre VARCHAR(50) NOT NULL,
                fecha_fin_inscripcion VARCHAR NOT NULL,
                estado INT NOT NULL,
                fecha_ini_evento DATETIME NOT NULL,
                fecha_fin_evento DATETIME NOT NULL,
                fecha_ini_increpcion DATETIME NOT NULL,
                CONSTRAINT evento_pk PRIMARY KEY (id)
);

CREATE TABLE tipo_usuario (
                id uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
                descripcion VARCHAR(50) NOT NULL,
                CONSTRAINT tipo_usuario_pk PRIMARY KEY (id)
);

CREATE TABLE tipo_club (
                id uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
                descripcion VARCHAR(50) NOT NULL,
                CONSTRAINT tipo_club_pk PRIMARY KEY (id)
);

CREATE TABLE persona (
                ci_ruc VARCHAR(50) NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                fecha_nacimiento DATETIME NOT NULL,
                CONSTRAINT persona_pk PRIMARY KEY (ci_ruc)
);

CREATE TABLE usuario_wushu (
                usuario_id VARCHAR(50) NOT NULL,
                nombre VARCHAR(50) NOT NULL,
                clave VARCHAR(50) NOT NULL,
                estado INT NOT NULL,
                CONSTRAINT usuario_wushu_pk PRIMARY KEY (usuario_id)
);

CREATE TABLE club (
                id uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID(),
                tipo_club_id uniqueidentifier NOT NULL,
                nombre VARCHAR(50) NOT NULL,
                representante VARCHAR(50) NOT NULL,
                CONSTRAINT club_pk PRIMARY KEY (id)
);

CREATE TABLE sanda_inscripcion (
                club_id uniqueidentifier NOT NULL,
                usuario_id VARCHAR(50) NOT NULL,
                evento_id uniqueidentifier NOT NULL,
                peso_id uniqueidentifier NOT NULL,
                CONSTRAINT sanda_inscripcion_pk PRIMARY KEY (club_id, usuario_id, evento_id)
);

CREATE TABLE alumno (
                club_id uniqueidentifier NOT NULL,
                alumno VARCHAR(50) NOT NULL,
                estado INT NOT NULL,
                CONSTRAINT alumno_pk PRIMARY KEY (club_id, alumno)
);

CREATE TABLE rol_usuario_wushu (
                tipo_usuario_id uniqueidentifier NOT NULL,
                usuario_id VARCHAR(50) NOT NULL,
                estado INT NOT NULL DEFAULT 1,
                CONSTRAINT rol_usuario_wushu_pk PRIMARY KEY (tipo_usuario_id, usuario_id)
);

ALTER TABLE rol_usuario_wushu ADD CONSTRAINT rol_usuario_wushu_tipo_usuario_fk
FOREIGN KEY (tipo_usuario_id)
REFERENCES tipo_usuario (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE rol_usuario_wushu ADD CONSTRAINT rol_usuario_wushu_usuario_wushu_fk
FOREIGN KEY (usuario_id)
REFERENCES usuario_wushu (usuario_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE sanda_peso ADD CONSTRAINT sanda_categoria_sanda_peso_fk
FOREIGN KEY (categoria_id)
REFERENCES sanda_categoria (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE sanda_inscripcion ADD CONSTRAINT sanda_peso_inscripcion_fk
FOREIGN KEY (peso_id)
REFERENCES sanda_peso (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE sanda_inscripcion ADD CONSTRAINT evento__sanda_inscripcion_fk
FOREIGN KEY (evento_id)
REFERENCES evento (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE club ADD CONSTRAINT tipo_club_club_fk
FOREIGN KEY (tipo_club_id)
REFERENCES tipo_club (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE club ADD CONSTRAINT persona_club_fk
FOREIGN KEY (representante)
REFERENCES persona (ci_ruc)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE alumno ADD CONSTRAINT persona_alumno_fk
FOREIGN KEY (alumno)
REFERENCES persona (ci_ruc)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE usuario_wushu ADD CONSTRAINT persona_usuario_fk
FOREIGN KEY (usuario_id)
REFERENCES persona (ci_ruc)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE sanda_inscripcion ADD CONSTRAINT usuario_inscripcion_fk
FOREIGN KEY (usuario_id)
REFERENCES usuario_wushu (usuario_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE alumno ADD CONSTRAINT club_alumno_fk
FOREIGN KEY (club_id)
REFERENCES club (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE sanda_inscripcion ADD CONSTRAINT club_inscripcion_fk
FOREIGN KEY (club_id)
REFERENCES club (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;