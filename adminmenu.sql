CREATE TABLE IF NOT EXISTS `bannedplayers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `steamid` varchar(50) DEFAULT NULL,
  `discord` varchar(50) DEFAULT NULL,
  `license` varchar(50) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `fivem` varchar(50) DEFAULT 'Invalid',
  `reason` varchar(100) NOT NULL,
  `executioner` varchar(100) DEFAULT 'uNKNown',
  `date` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `discord` (`discord`),
  KEY `license` (`license`),
  KEY `ip` (`ip`),
  KEY `steamid` (`steamid`) USING BTREE,
  KEY `fivem` (`fivem`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;