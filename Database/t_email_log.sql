-- Log of emails sent from Coordinator Input (Email icon)

CREATE TABLE IF NOT EXISTS `t_email_log` (
  `AutoId` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL COMMENT 'User who sent the email',
  `LogDate` datetime NOT NULL DEFAULT current_timestamp(),
  `TransactionId` int(11) DEFAULT NULL,
  `EmailAddress` text COMMENT 'To and CC addresses',
  `EmailSubject` varchar(500) DEFAULT NULL,
  `EmailBody` mediumtext,
  `SendStatus` varchar(20) NOT NULL COMMENT 'Success or Fail',
  `ErrorMessage` text DEFAULT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`AutoId`),
  KEY `IDX_t_email_log_TransactionId` (`TransactionId`),
  KEY `IDX_t_email_log_UserId` (`UserId`),
  KEY `IDX_t_email_log_LogDate` (`LogDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
