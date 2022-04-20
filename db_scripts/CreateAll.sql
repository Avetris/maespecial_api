CREATE TABLE `resources` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`type` VARCHAR(20) NOT NULL DEFAULT '' COLLATE 'utf16_general_ci',
	`name` VARCHAR(100) NOT NULL DEFAULT '' COLLATE 'utf16_general_ci',
	`instagram` VARCHAR(100) NULL DEFAULT '' COLLATE 'utf16_general_ci',
	`web` VARCHAR(250) NULL DEFAULT '' COLLATE 'utf16_general_ci',
	`showDate` DATETIME NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=46
;

CREATE TABLE `post` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`title` VARCHAR(255) NOT NULL COLLATE 'utf16_general_ci',
	`description` TEXT NOT NULL COLLATE 'utf16_general_ci',
	`image` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf16_general_ci',
	`content` TEXT NOT NULL COLLATE 'utf16_general_ci',
	`publish_date` DATETIME NOT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb3_general_ci'
ENGINE=InnoDB
;

