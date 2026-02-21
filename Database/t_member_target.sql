-- =====================================================
-- SQL Script for "Assign Member wise Target" feature
-- =====================================================

-- 1. Create table structure for `t_member_target`
-- =====================================================

CREATE TABLE `t_member_target` (
  `MemberTargetId` int(11) NOT NULL AUTO_INCREMENT,
  `MemberId` int(11) NOT NULL,
  `YearName` varchar(10) NOT NULL,
  `MonthId` smallint(6) NOT NULL,
  `OnSiteTarget` decimal(15,2) NOT NULL DEFAULT 0.00,
  `OffSiteTarget` decimal(15,2) NOT NULL DEFAULT 0.00,
  `RevenueTarget` decimal(15,2) NOT NULL DEFAULT 0.00,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`MemberTargetId`),
  UNIQUE KEY `UK_t_member_target` (`MemberId`, `YearName`, `MonthId`),
  KEY `FK_t_member_target_member` (`MemberId`),
  KEY `FK_t_member_target_month` (`MonthId`),
  CONSTRAINT `FK_t_member_target_member` FOREIGN KEY (`MemberId`) REFERENCES `t_member` (`MemberId`) ON DELETE CASCADE,
  CONSTRAINT `FK_t_member_target_month` FOREIGN KEY (`MonthId`) REFERENCES `t_month` (`MonthId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 2. Add menu entry for the new page
-- =====================================================
-- NOTE: Adjust MenuId (200) to the next available ID in your t_menu table

INSERT INTO `t_menu` (`MenuId`, `MenuKey`, `MenuTitle`, `Url`, `ParentId`, `MenuLevel`, `SortOrder`, `MenuType`, `CategoryName`, `ICONURL`, `CreateTs`, `UpdateTs`) VALUES
(200, 'membertarget', 'Assign Member wise Target', '/membertarget', 4, 'menu_level_2', 113, 'WEB', NULL, NULL, NOW(), NULL);

-- 3. Grant permission to admin role (RoleId = 1)
-- =====================================================
-- NOTE: Adjust based on your t_role_menu_permission table structure

-- INSERT INTO `t_role_menu_permission` (`RoleId`, `MenuId`, `PermissionType`) VALUES (1, 200, 0);
