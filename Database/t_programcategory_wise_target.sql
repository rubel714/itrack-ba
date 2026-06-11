-- =====================================================
-- SQL Script for "Assign Program Category wise Target" feature
-- =====================================================

-- 1. Create table structure for `t_programcategory_wise_target`
-- =====================================================

CREATE TABLE `t_programcategory_wise_target` (
  `ProgramCategoryTargetId` int(11) NOT NULL,
  `YearId` int(11) NOT NULL,
  `MonthId` int(11) NOT NULL,
  `ProgramCategoryId` smallint(3) NOT NULL,
  `ReCertification` int(11) DEFAULT NULL,
  `NewCertification` int(11) DEFAULT NULL,
  `TotalCertification` int(11) DEFAULT NULL,
  PRIMARY KEY (`ProgramCategoryTargetId`),
  UNIQUE KEY `UK_t_programcategory_wise_target` (`ProgramCategoryId`, `YearId`, `MonthId`),
  KEY `FK_t_programcategory_wise_target_programcategory` (`ProgramCategoryId`),
  KEY `FK_t_programcategory_wise_target_month` (`MonthId`),
  CONSTRAINT `FK_t_programcategory_wise_target_programcategory` FOREIGN KEY (`ProgramCategoryId`) REFERENCES `t_programcategory` (`ProgramCategoryId`) ON DELETE CASCADE,
  CONSTRAINT `FK_t_programcategory_wise_target_month` FOREIGN KEY (`MonthId`) REFERENCES `t_month` (`MonthId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Run this ALTER if the table already exists:
ALTER TABLE `t_programcategory_wise_target`
  MODIFY `ReCertification` int(11) DEFAULT NULL,
  MODIFY `NewCertification` int(11) DEFAULT NULL,
  MODIFY `TotalCertification` int(11) DEFAULT NULL;

-- 2. Add menu entry for the new page
-- =====================================================
-- NOTE: Adjust MenuId to the next available ID in your t_menu table

INSERT INTO `t_menu` (`MenuId`, `MenuKey`, `MenuTitle`, `Url`, `ParentId`, `MenuLevel`, `SortOrder`, `MenuType`, `CategoryName`, `ICONURL`, `CreateTs`, `UpdateTs`) VALUES
(201, 'programcategorytarget', 'Assign Program Category wise Target', '/programcategorytarget', 4, 'menu_level_2', 114, 'WEB', NULL, NULL, NOW(), NULL);
