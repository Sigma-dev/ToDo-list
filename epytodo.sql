DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS user (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    name VARCHAR(30)  NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    created_at date DEFAULT NOW(),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS `todo`;
CREATE TABLE IF NOT EXISTS todo (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    description VARCHAR(100) NOT NULL,
    created_at date DEFAULT NOW(),
    due_time date NOT NULL,
    status VARCHAR(11) DEFAULT 'not started',
    user_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
);
