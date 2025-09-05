-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2025 at 05:39 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `itrack_ba_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `t_activity`
--

CREATE TABLE `t_activity` (
  `ActivityId` smallint(3) NOT NULL,
  `ActivityName` varchar(50) NOT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_activity`
--

INSERT INTO `t_activity` (`ActivityId`, `ActivityName`, `CreateTs`, `UpdateTs`) VALUES
(1, 'Onsite Activity (In Office)', '2025-08-30 14:50:00', NULL),
(2, 'OffSite Activity (Out of Office)', '2025-08-30 14:50:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_auditor`
--

CREATE TABLE `t_auditor` (
  `AuditorId` int(11) NOT NULL,
  `AuditorCode` varchar(50) NOT NULL,
  `AuditorName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `PhoneNo` varchar(30) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 0,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_auditor`
--

INSERT INTO `t_auditor` (`AuditorId`, `AuditorCode`, `AuditorName`, `Email`, `Address`, `PhoneNo`, `IsActive`, `CreateTs`, `UpdateTs`) VALUES
(1, '1755711520', 'Rakibul', '', '', '01536251547', 1, '2025-08-20 17:37:20', NULL),
(2, '1755795317', 'Aman ullah', '', '', '01896524175', 1, '2025-08-21 16:55:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_auditstage`
--

CREATE TABLE `t_auditstage` (
  `AuditStageId` smallint(3) NOT NULL,
  `AuditStageName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_auditstage`
--

INSERT INTO `t_auditstage` (`AuditStageId`, `AuditStageName`, `CreateTs`, `UpdateTs`) VALUES
(1, 'Stage 01', '2025-08-21 11:30:00', NULL),
(2, 'Stage 02', '2025-08-21 11:30:00', NULL),
(3, 'Stage 03', '2025-08-21 11:30:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_branch`
--

CREATE TABLE `t_branch` (
  `BranchId` smallint(6) NOT NULL,
  `ClientId` smallint(6) NOT NULL,
  `BranchName` varchar(50) NOT NULL,
  `PhoneNo` varchar(30) NOT NULL,
  `Email` varchar(30) DEFAULT NULL,
  `BranchAddress` varchar(250) DEFAULT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_branch`
--

INSERT INTO `t_branch` (`BranchId`, `ClientId`, `BranchName`, `PhoneNo`, `Email`, `BranchAddress`, `CreateTs`, `UpdateTs`) VALUES
(1, 1, 'Intertek', '', NULL, NULL, '2023-08-10 00:14:16', '2023-08-10 00:14:16');

-- --------------------------------------------------------

--
-- Table structure for table `t_buyer`
--

CREATE TABLE `t_buyer` (
  `BuyerId` int(11) NOT NULL,
  `BuyerName` varchar(100) NOT NULL,
  `Phone` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Address` varchar(150) DEFAULT NULL,
  `UpdateTs` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_buyer`
--

INSERT INTO `t_buyer` (`BuyerId`, `BuyerName`, `Phone`, `Email`, `Address`, `UpdateTs`, `CreateTs`) VALUES
(1, 'Buyer 01', NULL, NULL, NULL, '2025-08-30 15:01:25', '2025-08-30 15:01:25');

-- --------------------------------------------------------

--
-- Table structure for table `t_client`
--

CREATE TABLE `t_client` (
  `ClientId` smallint(6) NOT NULL,
  `ClientName` varchar(50) NOT NULL,
  `ClientCode` varchar(20) NOT NULL,
  `AppName` varchar(50) NOT NULL,
  `PoweredBy` varchar(50) NOT NULL,
  `DevelopmentBy` varchar(50) NOT NULL,
  `DevelopmentByWebsite` varchar(50) DEFAULT NULL,
  `PhoneNo` varchar(30) DEFAULT NULL,
  `Email` varchar(30) DEFAULT NULL,
  `ClientAddress` varchar(250) DEFAULT NULL,
  `ClientLogo` varchar(100) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_client`
--

INSERT INTO `t_client` (`ClientId`, `ClientName`, `ClientCode`, `AppName`, `PoweredBy`, `DevelopmentBy`, `DevelopmentByWebsite`, `PhoneNo`, `Email`, `ClientAddress`, `ClientLogo`, `IsActive`, `CreateTs`, `UpdateTs`) VALUES
(1, 'Intertek', 'INSPECTION', 'Intertek', 'Intertek', 'Intertek', 'https://www.intertek.com', '', NULL, '', NULL, 1, '2023-08-10 00:14:16', '2023-08-10 00:14:16');

-- --------------------------------------------------------

--
-- Table structure for table `t_department`
--

CREATE TABLE `t_department` (
  `DepartmentId` smallint(3) NOT NULL,
  `DepartmentName` varchar(50) NOT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_department`
--

INSERT INTO `t_department` (`DepartmentId`, `DepartmentName`, `CreateTs`, `UpdateTs`) VALUES
(1, 'NA', '2024-10-20 16:12:15', '2024-10-20 16:12:15'),
(2, 'Admin', '2023-08-09 18:14:16', '2024-10-20 16:12:15'),
(3, 'HR', '2023-08-09 18:14:16', '2024-10-20 16:12:15'),
(4, 'Audit', '2024-10-20 16:12:15', '2024-10-20 16:12:15'),
(5, 'Delivery', '2024-10-20 16:12:15', '2024-10-20 16:12:15'),
(6, 'IT Team', '2024-10-20 16:12:15', '2024-10-20 16:12:15'),
(7, 'Accounts', '2024-10-20 16:12:15', '2024-10-20 16:12:15'),
(8, 'MIS', '2024-10-20 16:12:15', '2024-10-20 16:12:15'),
(9, 'Maintenance', '2024-10-20 16:12:15', '2024-10-20 16:12:15');

-- --------------------------------------------------------

--
-- Table structure for table `t_designation`
--

CREATE TABLE `t_designation` (
  `DesignationId` smallint(3) NOT NULL,
  `ClientId` smallint(6) NOT NULL,
  `DesignationName` varchar(50) NOT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_designation`
--

INSERT INTO `t_designation` (`DesignationId`, `ClientId`, `DesignationName`, `CreateTs`, `UpdateTs`) VALUES
(1, 1, 'Chairman', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(2, 1, 'Managing Director', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(3, 1, 'Director', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(4, 1, 'Assistant General Manager', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(5, 1, 'Assistant Manager', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(6, 1, 'Assistant Officer', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(7, 1, 'Assistant Operator', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(8, 1, 'Data Entry Officer', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(9, 1, 'Delivery Man', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(10, 1, 'Deputy General Manager', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(11, 1, 'Deputy Manager', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(12, 1, 'Driver', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(13, 1, 'Electrician', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(14, 1, 'Engineer', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(15, 1, 'Executive', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(16, 1, 'General Manager', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(17, 1, 'Junior Engineer', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(18, 1, 'Junior Technician', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(19, 1, 'Manager', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(20, 1, 'Operator', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(21, 1, 'Security Guard', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(22, 1, 'Senior Electrician', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(23, 1, 'Senior General Manager', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(24, 1, 'Senior Manager', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(25, 1, 'Senior Officer', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(26, 1, 'Senior Operator', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(27, 1, 'Service Engineer', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(28, 1, 'Supervisor', '2024-10-24 16:35:56', '2024-10-24 16:35:56'),
(29, 1, 'Merchandiser', '2025-04-28 03:43:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_errorlog`
--

CREATE TABLE `t_errorlog` (
  `LogId` int(11) NOT NULL,
  `LogDate` datetime NOT NULL,
  `RemoteIP` varchar(100) NOT NULL,
  `UserId` int(11) NOT NULL COMMENT 'In user table has Client and Branch',
  `Query` text NOT NULL,
  `QueryType` varchar(30) NOT NULL,
  `ErrorNo` varchar(30) NOT NULL,
  `ErrorMsg` text NOT NULL,
  `SqlParams` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_errorlog`
--

INSERT INTO `t_errorlog` (`LogId`, `LogDate`, `RemoteIP`, `UserId`, `Query`, `QueryType`, `ErrorNo`, `ErrorMsg`, `SqlParams`) VALUES
(1, '2025-08-20 23:08:10', '127.0.0.1', 1, 'INSERT INTO t_member (MemberCode,MemberName,Email,Address,PhoneNo,IsActive) values (:MemberCode,:MemberName,:Email,:Address,:PhoneNo,:IsActive)', 'INSERT', '1048', 'Column \'Email\' cannot be null', '{\"values\":{\"MemberCode\":\"1\",\"MemberName\":\"ds453\",\"Email\":null,\"Address\":null,\"PhoneNo\":\"23424\",\"IsActive\":1}}'),
(2, '2025-08-20 23:17:09', '127.0.0.1', 1, 'INSERT INTO t_member (MemberCode,MemberName,Email,Address,PhoneNo,IsActive) values (:MemberCode,:MemberName,:Email,:Address,:PhoneNo,:IsActive)', 'INSERT', '1062', 'Duplicate entry \'1\' for key \'UK_t_member_MemberCode\'', '{\"values\":{\"MemberCode\":\"1\",\"MemberName\":\"d\",\"Email\":null,\"Address\":null,\"PhoneNo\":\"35\",\"IsActive\":1}}'),
(3, '2025-08-20 23:20:32', '127.0.0.1', 1, 'INSERT INTO t_member (MemberCode,MemberName,Email,Address,PhoneNo,IsActive) values (:MemberCode,:MemberName,:Email,:Address,:PhoneNo,:IsActive)', 'INSERT', '1048', 'Column \'MemberCode\' cannot be null', '{\"values\":{\"MemberCode\":null,\"MemberName\":\"wer34\",\"Email\":null,\"Address\":null,\"PhoneNo\":\"345\",\"IsActive\":1}}'),
(4, '2025-09-05 00:59:36', '127.0.0.1', 1, 'INSERT INTO t_transaction (TransactionTypeId,TransactionDate,InvoiceNo,ActivityId,FactoryId,ProgramId,ExpireDate,OpportunityDate,TentativeOfferPrice,CertificateBody,CoordinatorId,AuditStageId,LeadStatusId,ManDay,BuyerId,NextFollowupDate,TeamId,MemberId,Remarks,UserId,StatusId) values (:TransactionTypeId,:TransactionDate,:InvoiceNo,:ActivityId,:FactoryId,:ProgramId,:ExpireDate,:OpportunityDate,:TentativeOfferPrice,:CertificateBody,:CoordinatorId,:AuditStageId,:LeadStatusId,:ManDay,:BuyerId,:NextFollowupDate,:TeamId,:MemberId,:Remarks,:UserId,:StatusId)', 'INSERT', '1062', 'Duplicate entry \'2025-09-05\' for key \'UK_InvoiceNo\'', '{\"values\":{\"TransactionTypeId\":1,\"TransactionDate\":\"2025-09-05\",\"InvoiceNo\":\"2025-09-05\",\"ActivityId\":1,\"FactoryId\":1,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":null,\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":null,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":null,\"NextFollowupDate\":null,\"TeamId\":null,\"MemberId\":null,\"Remarks\":null,\"UserId\":\"1\",\"StatusId\":1}}');

-- --------------------------------------------------------

--
-- Table structure for table `t_factory`
--

CREATE TABLE `t_factory` (
  `FactoryId` int(11) NOT NULL,
  `FactoryGroupId` smallint(3) NOT NULL,
  `FactoryName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `PhoneNo` varchar(30) DEFAULT NULL,
  `Email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(200) DEFAULT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_factory`
--

INSERT INTO `t_factory` (`FactoryId`, `FactoryGroupId`, `FactoryName`, `PhoneNo`, `Email`, `Address`, `CreateTs`, `UpdateTs`) VALUES
(1, 1, 'Factory 001', NULL, NULL, 'Dhaka', '2025-08-21 17:28:24', NULL),
(2, 1, 'Factory 002', NULL, NULL, 'Gazipur', '2025-08-21 17:28:30', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_factorygroup`
--

CREATE TABLE `t_factorygroup` (
  `FactoryGroupId` smallint(3) NOT NULL,
  `FactoryGroupName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_factorygroup`
--

INSERT INTO `t_factorygroup` (`FactoryGroupId`, `FactoryGroupName`, `CreateTs`, `UpdateTs`) VALUES
(1, 'Group 01', '2025-08-21 17:27:56', NULL),
(2, 'Group 02', '2025-08-21 17:27:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_leadstatus`
--

CREATE TABLE `t_leadstatus` (
  `LeadStatusId` smallint(3) NOT NULL,
  `LeadStatusName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_leadstatus`
--

INSERT INTO `t_leadstatus` (`LeadStatusId`, `LeadStatusName`, `CreateTs`, `UpdateTs`) VALUES
(1, 'Lead Status 01', '2025-08-21 11:30:00', NULL),
(2, 'Lead Status 02', '2025-08-21 11:30:00', NULL),
(3, 'Lead Status 03', '2025-08-21 11:30:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_member`
--

CREATE TABLE `t_member` (
  `MemberId` int(11) NOT NULL,
  `MemberCode` varchar(50) NOT NULL,
  `MemberName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(200) DEFAULT NULL,
  `PhoneNo` varchar(30) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_member`
--

INSERT INTO `t_member` (`MemberId`, `MemberCode`, `MemberName`, `Email`, `Address`, `PhoneNo`, `IsActive`, `CreateTs`, `UpdateTs`) VALUES
(1, '2', 'Mr Rubel', 'rubel714@gmail.com', 'Dhaka', '01538198763', 1, '2025-08-20 17:08:44', NULL),
(3, '1', 'Mr Mrinal', NULL, NULL, '01714143603', 1, '2025-08-20 17:20:47', NULL),
(5, '1756920894', 'Kabir', '', '', '01538198763', 1, '2025-09-03 17:34:54', NULL),
(6, '1756920918', 'Ali', '', '', '01954256314', 1, '2025-09-03 17:35:18', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_menu`
--

CREATE TABLE `t_menu` (
  `MenuId` smallint(6) NOT NULL,
  `MenuKey` varchar(50) NOT NULL,
  `MenuTitle` varchar(150) NOT NULL,
  `Url` varchar(150) NOT NULL,
  `ParentId` int(11) DEFAULT NULL,
  `MenuLevel` varchar(30) DEFAULT NULL,
  `SortOrder` int(11) DEFAULT NULL,
  `MenuType` varchar(10) NOT NULL DEFAULT 'WEB' COMMENT 'WEB/APP',
  `CategoryName` varchar(30) DEFAULT NULL,
  `ICONURL` varchar(150) DEFAULT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_menu`
--

INSERT INTO `t_menu` (`MenuId`, `MenuKey`, `MenuTitle`, `Url`, `ParentId`, `MenuLevel`, `SortOrder`, `MenuType`, `CategoryName`, `ICONURL`, `CreateTs`, `UpdateTs`) VALUES
(1, 'home', 'Home', '/home', 0, 'menu_level_1', 1, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(3, 'reports', 'Reports', '#', 0, 'menu_level_1', 300, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(4, 'basicsetup', 'Basic Setup', '#', 0, 'menu_level_1', 100, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(26, 'buyer', 'Buyer', '/buyer', 4, 'menu_level_2', 155, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(53, 'userrole', 'User Role', '/userrole', 4, 'menu_level_2', 158, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(56, 'roletomenupermission', 'Role to Menu Permission', '/roletomenupermission', 4, 'menu_level_2', 162, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(59, 'userentry', 'User Entry', '/userentry', 4, 'menu_level_2', 160, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(60, 'myprofileweb', 'My Profile Web', '/myprofileweb', 0, 'menu_level_1', 400, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(63, 'auditlog', 'Audit Log', '/auditlog', 0, 'menu_level_2', 165, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(64, 'errorlog', 'Error Log', '/errorlog', 0, 'menu_level_2', 170, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(107, 'designation', 'Designation', '/designation', 4, 'menu_level_2', 148, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(108, 'department', 'Department', '/department', 4, 'menu_level_2', 150, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(120, 'audit', 'Audit', '#', 0, 'menu_level_1', 200, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(135, 'members', 'Members', '/members', 4, 'menu_level_2', 112, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(136, 'auditors', 'Auditors', '/auditors', 4, 'menu_level_2', 105, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(137, 'programs', 'Programs', '/programs', 4, 'menu_level_2', 130, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(138, 'factorygroups', 'Factory Groups', '/factorygroups', 4, 'menu_level_2', 120, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(139, 'factory', 'Factory', '/factory', 4, 'menu_level_2', 125, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(140, 'auditstage', 'Audit Stage', '/auditstage', 4, 'menu_level_2', 135, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(141, 'leadstatus', 'Lead Status', '/leadstatus', 4, 'menu_level_2', 140, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(142, 'salespersoninput', 'Sales Person Input', '/salespersoninput', 4, 'menu_level_2', 210, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(143, 'team', 'Team', '/team', 4, 'menu_level_2', 110, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16'),
(144, 'teammemberassign', 'Team Member Assign', '/teammemberassign', 4, 'menu_level_2', 115, 'WEB', NULL, NULL, '2023-08-09 06:14:16', '2023-08-09 06:14:16');

-- --------------------------------------------------------

--
-- Table structure for table `t_month`
--

CREATE TABLE `t_month` (
  `MonthId` int(11) NOT NULL,
  `MonthName` varchar(25) NOT NULL,
  `UpdateTs` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_month`
--

INSERT INTO `t_month` (`MonthId`, `MonthName`, `UpdateTs`, `CreateTs`) VALUES
(1, 'January', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(2, 'February', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(3, 'March', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(4, 'April', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(5, 'May', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(6, 'June', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(7, 'July', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(8, 'August', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(9, 'September', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(10, 'October', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(11, 'November', '2024-04-16 18:20:35', '2024-04-16 18:20:35'),
(12, 'December', '2024-04-16 18:20:35', '2024-04-16 18:20:35');

-- --------------------------------------------------------

--
-- Table structure for table `t_program`
--

CREATE TABLE `t_program` (
  `ProgramId` smallint(3) NOT NULL,
  `ProgramName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_program`
--

INSERT INTO `t_program` (`ProgramId`, `ProgramName`, `CreateTs`, `UpdateTs`) VALUES
(1, 'Program 01', '2025-08-21 17:30:00', NULL),
(2, 'Program 02', '2025-08-21 17:30:00', NULL),
(3, 'Program 03', '2025-08-21 17:30:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_roles`
--

CREATE TABLE `t_roles` (
  `RoleId` smallint(3) NOT NULL,
  `RoleName` varchar(50) NOT NULL,
  `DefaultRedirect` varchar(150) NOT NULL,
  `CreateTs` timestamp NULL DEFAULT NULL,
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_roles`
--

INSERT INTO `t_roles` (`RoleId`, `RoleName`, `DefaultRedirect`, `CreateTs`, `UpdateTs`) VALUES
(1, 'Super Admin', '/home', '2023-08-10 00:14:16', '2023-08-10 00:14:16');

-- --------------------------------------------------------

--
-- Table structure for table `t_role_menu_map`
--

CREATE TABLE `t_role_menu_map` (
  `RoleMenuId` int(11) NOT NULL,
  `ClientId` smallint(6) NOT NULL,
  `BranchId` smallint(6) NOT NULL,
  `RoleId` smallint(3) NOT NULL,
  `MenuId` smallint(6) NOT NULL,
  `PermissionType` tinyint(1) NOT NULL COMMENT '1=View,2=Edit',
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_role_menu_map`
--

INSERT INTO `t_role_menu_map` (`RoleMenuId`, `ClientId`, `BranchId`, `RoleId`, `MenuId`, `PermissionType`, `CreateTs`, `UpdateTs`) VALUES
(3, 1, 1, 1, 3, 2, '2023-08-09 06:14:16', '2024-10-21 09:04:27'),
(19, 1, 1, 1, 53, 2, '2023-08-09 06:14:16', '2024-10-21 09:04:27'),
(29, 1, 1, 1, 56, 2, '2023-09-08 23:04:48', '2024-10-21 09:04:27'),
(39, 1, 1, 1, 63, 2, '2023-10-31 04:47:03', '2024-10-21 09:04:27'),
(40, 1, 1, 1, 64, 2, '2023-10-31 04:47:03', '2024-10-21 09:04:27'),
(44, 1, 1, 1, 59, 2, '2023-12-22 16:52:12', '2024-10-21 09:04:27'),
(92, 1, 1, 1, 60, 2, '2024-09-06 06:13:37', '2024-10-21 09:04:27'),
(106, 1, 1, 1, 107, 2, '2024-09-06 06:29:25', '2024-10-21 09:04:27'),
(160, 1, 1, 1, 120, 1, '2024-10-21 18:41:34', '2024-10-21 09:04:27'),
(314, 1, 1, 1, 108, 2, '2024-10-26 05:05:00', NULL),
(315, 1, 1, 1, 1, 1, '2024-10-26 05:05:51', NULL),
(317, 1, 1, 1, 4, 2, '2024-10-27 03:35:15', NULL),
(399, 1, 1, 1, 135, 2, '2025-07-08 17:00:53', NULL),
(400, 1, 1, 1, 136, 2, '2025-08-20 17:30:23', NULL),
(401, 1, 1, 1, 139, 2, '2025-08-21 18:07:50', NULL),
(402, 1, 1, 1, 137, 2, '2025-08-21 18:07:51', NULL),
(403, 1, 1, 1, 138, 2, '2025-08-21 18:07:52', NULL),
(404, 1, 1, 1, 140, 2, '2025-08-30 10:27:26', NULL),
(405, 1, 1, 1, 141, 2, '2025-08-30 10:37:14', NULL),
(406, 1, 1, 1, 142, 2, '2025-08-30 15:47:15', NULL),
(407, 1, 1, 1, 143, 2, '2025-09-03 15:41:47', NULL),
(408, 1, 1, 1, 144, 2, '2025-09-03 15:47:46', NULL),
(409, 1, 1, 1, 26, 2, '2025-09-03 18:19:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_sqllog`
--

CREATE TABLE `t_sqllog` (
  `LogId` int(11) NOT NULL,
  `LogDate` datetime NOT NULL,
  `RemoteIP` varchar(100) NOT NULL,
  `UserId` int(11) NOT NULL COMMENT 'In user table has Client and Branch',
  `QueryType` varchar(30) NOT NULL,
  `TableName` varchar(30) NOT NULL,
  `JsonText` longtext NOT NULL,
  `SqlText` longtext NOT NULL,
  `SqlParams` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_sqllog`
--

INSERT INTO `t_sqllog` (`LogId`, `LogDate`, `RemoteIP`, `UserId`, `QueryType`, `TableName`, `JsonText`, `SqlText`, `SqlParams`) VALUES
(1, '2025-08-30 16:27:26', '127.0.0.1', 1, 'INSERT', 't_role_menu_map', '[[\"RoleMenuId\",\"\",404],[\"ClientId\",\"\",1],[\"BranchId\",\"\",1],[\"RoleId\",\"\",1],[\"MenuId\",\"\",140],[\"PermissionType\",\"\",1],[\"CreateTs\",\"\",\"2025-08-30 16:27:26\"]]', 'INSERT INTO t_role_menu_map (ClientId,BranchId,RoleId,MenuId,PermissionType) values (:ClientId,:BranchId,:RoleId,:MenuId,:PermissionType)', '{\"values\":{\"ClientId\":\"1\",\"BranchId\":\"1\",\"RoleId\":\"1\",\"MenuId\":140,\"PermissionType\":1}}'),
(2, '2025-08-30 16:27:28', '127.0.0.1', 1, 'UPDATE', 't_role_menu_map', '[[\"PermissionType\",1,2]]', 'UPDATE t_role_menu_map SET PermissionType = :PermissionType  WHERE RoleMenuId = :RoleMenuId', '{\"values\":{\"PermissionType\":2,\"RoleMenuId\":404}}'),
(3, '2025-08-30 16:29:53', '127.0.0.1', 1, 'INSERT', 't_auditstage', '[[\"AuditStageId\",\"\",4],[\"AuditStageName\",\"\",\"fsdfsf\"],[\"CreateTs\",\"\",\"2025-08-30 16:29:53\"]]', 'INSERT INTO t_auditstage (AuditStageName) values (:AuditStageName)', '{\"values\":{\"AuditStageName\":\"fsdfsf\"}}'),
(4, '2025-08-30 16:30:02', '127.0.0.1', 1, 'UPDATE', 't_auditstage', '[[\"AuditStageName\",\"fsdfsf\",\"fsdfsf fsdfsfwe34534\"]]', 'UPDATE t_auditstage SET AuditStageName = :AuditStageName  WHERE AuditStageId = :AuditStageId', '{\"values\":{\"AuditStageName\":\"fsdfsf fsdfsfwe34534\",\"AuditStageId\":4}}'),
(5, '2025-08-30 16:30:19', '127.0.0.1', 1, 'DELETE', 't_auditstage', '[[\"AuditStageId\",4,\"\"],[\"AuditStageName\",\"fsdfsf fsdfsfwe34534\",\"\"],[\"CreateTs\",\"2025-08-30 16:29:53\",\"\"],[\"UpdateTs\",null,\"\"]]', 'DELETE FROM t_auditstage  WHERE AuditStageId = :AuditStageId', '{\"values\":{\"AuditStageId\":4}}'),
(6, '2025-08-30 16:37:14', '127.0.0.1', 1, 'INSERT', 't_role_menu_map', '[[\"RoleMenuId\",\"\",405],[\"ClientId\",\"\",1],[\"BranchId\",\"\",1],[\"RoleId\",\"\",1],[\"MenuId\",\"\",141],[\"PermissionType\",\"\",1],[\"CreateTs\",\"\",\"2025-08-30 16:37:14\"]]', 'INSERT INTO t_role_menu_map (ClientId,BranchId,RoleId,MenuId,PermissionType) values (:ClientId,:BranchId,:RoleId,:MenuId,:PermissionType)', '{\"values\":{\"ClientId\":\"1\",\"BranchId\":\"1\",\"RoleId\":\"1\",\"MenuId\":141,\"PermissionType\":1}}'),
(7, '2025-08-30 16:37:16', '127.0.0.1', 1, 'UPDATE', 't_role_menu_map', '[[\"PermissionType\",1,2]]', 'UPDATE t_role_menu_map SET PermissionType = :PermissionType  WHERE RoleMenuId = :RoleMenuId', '{\"values\":{\"PermissionType\":2,\"RoleMenuId\":405}}'),
(8, '2025-08-30 16:47:23', '127.0.0.1', 1, 'INSERT', 't_leadstatus', '[[\"LeadStatusId\",\"\",4],[\"LeadStatusName\",\"\",\"df\"],[\"CreateTs\",\"\",\"2025-08-30 16:47:23\"]]', 'INSERT INTO t_leadstatus (LeadStatusName) values (:LeadStatusName)', '{\"values\":{\"LeadStatusName\":\"df\"}}'),
(9, '2025-08-30 16:47:39', '127.0.0.1', 1, 'UPDATE', 't_leadstatus', '[[\"LeadStatusName\",\"df\",\"df fsdf\"]]', 'UPDATE t_leadstatus SET LeadStatusName = :LeadStatusName  WHERE LeadStatusId = :LeadStatusId', '{\"values\":{\"LeadStatusName\":\"df fsdf\",\"LeadStatusId\":4}}'),
(10, '2025-08-30 16:47:43', '127.0.0.1', 1, 'DELETE', 't_leadstatus', '[[\"LeadStatusId\",4,\"\"],[\"LeadStatusName\",\"df fsdf\",\"\"],[\"CreateTs\",\"2025-08-30 16:47:23\",\"\"],[\"UpdateTs\",null,\"\"]]', 'DELETE FROM t_leadstatus  WHERE LeadStatusId = :LeadStatusId', '{\"values\":{\"LeadStatusId\":4}}'),
(11, '2025-08-30 21:47:15', '127.0.0.1', 1, 'INSERT', 't_role_menu_map', '[[\"RoleMenuId\",\"\",406],[\"ClientId\",\"\",1],[\"BranchId\",\"\",1],[\"RoleId\",\"\",1],[\"MenuId\",\"\",142],[\"PermissionType\",\"\",1],[\"CreateTs\",\"\",\"2025-08-30 21:47:15\"]]', 'INSERT INTO t_role_menu_map (ClientId,BranchId,RoleId,MenuId,PermissionType) values (:ClientId,:BranchId,:RoleId,:MenuId,:PermissionType)', '{\"values\":{\"ClientId\":\"1\",\"BranchId\":\"1\",\"RoleId\":\"1\",\"MenuId\":142,\"PermissionType\":1}}'),
(12, '2025-08-30 21:47:16', '127.0.0.1', 1, 'UPDATE', 't_role_menu_map', '[[\"PermissionType\",1,2]]', 'UPDATE t_role_menu_map SET PermissionType = :PermissionType  WHERE RoleMenuId = :RoleMenuId', '{\"values\":{\"PermissionType\":2,\"RoleMenuId\":406}}'),
(13, '2025-09-03 21:41:47', '127.0.0.1', 1, 'INSERT', 't_role_menu_map', '[[\"RoleMenuId\",\"\",407],[\"ClientId\",\"\",1],[\"BranchId\",\"\",1],[\"RoleId\",\"\",1],[\"MenuId\",\"\",143],[\"PermissionType\",\"\",1],[\"CreateTs\",\"\",\"2025-09-03 21:41:47\"]]', 'INSERT INTO t_role_menu_map (ClientId,BranchId,RoleId,MenuId,PermissionType) values (:ClientId,:BranchId,:RoleId,:MenuId,:PermissionType)', '{\"values\":{\"ClientId\":\"1\",\"BranchId\":\"1\",\"RoleId\":\"1\",\"MenuId\":143,\"PermissionType\":1}}'),
(14, '2025-09-03 21:41:48', '127.0.0.1', 1, 'UPDATE', 't_role_menu_map', '[[\"PermissionType\",1,2]]', 'UPDATE t_role_menu_map SET PermissionType = :PermissionType  WHERE RoleMenuId = :RoleMenuId', '{\"values\":{\"PermissionType\":2,\"RoleMenuId\":407}}'),
(15, '2025-09-03 21:42:02', '127.0.0.1', 1, 'INSERT', 't_team', '[[\"TeamId\",\"\",4],[\"TeamName\",\"\",\"sdfds\"],[\"CreateTs\",\"\",\"2025-09-03 21:42:02\"]]', 'INSERT INTO t_team (TeamName) values (:TeamName)', '{\"values\":{\"TeamName\":\"sdfds\"}}'),
(16, '2025-09-03 21:42:07', '127.0.0.1', 1, 'UPDATE', 't_team', '[[\"TeamName\",\"sdfds\",\"sdfdssssssssss\"]]', 'UPDATE t_team SET TeamName = :TeamName  WHERE TeamId = :TeamId', '{\"values\":{\"TeamName\":\"sdfdssssssssss\",\"TeamId\":4}}'),
(17, '2025-09-03 21:42:20', '127.0.0.1', 1, 'DELETE', 't_team', '[[\"TeamId\",4,\"\"],[\"TeamName\",\"sdfdssssssssss\",\"\"],[\"CreateTs\",\"2025-09-03 21:42:02\",\"\"],[\"UpdateTs\",null,\"\"]]', 'DELETE FROM t_team  WHERE TeamId = :TeamId', '{\"values\":{\"TeamId\":4}}'),
(18, '2025-09-03 21:47:46', '127.0.0.1', 1, 'INSERT', 't_role_menu_map', '[[\"RoleMenuId\",\"\",408],[\"ClientId\",\"\",1],[\"BranchId\",\"\",1],[\"RoleId\",\"\",1],[\"MenuId\",\"\",144],[\"PermissionType\",\"\",1],[\"CreateTs\",\"\",\"2025-09-03 21:47:46\"]]', 'INSERT INTO t_role_menu_map (ClientId,BranchId,RoleId,MenuId,PermissionType) values (:ClientId,:BranchId,:RoleId,:MenuId,:PermissionType)', '{\"values\":{\"ClientId\":\"1\",\"BranchId\":\"1\",\"RoleId\":\"1\",\"MenuId\":144,\"PermissionType\":1}}'),
(19, '2025-09-03 21:47:47', '127.0.0.1', 1, 'UPDATE', 't_role_menu_map', '[[\"PermissionType\",1,2]]', 'UPDATE t_role_menu_map SET PermissionType = :PermissionType  WHERE RoleMenuId = :RoleMenuId', '{\"values\":{\"PermissionType\":2,\"RoleMenuId\":408}}'),
(20, '2025-09-03 23:34:54', '127.0.0.1', 1, 'INSERT', 't_member', '[[0,\"\",\"42S22\"],[1,\"\",1054],[2,\"\",\"Unknown column \'CheckId\' in \'where clause\'\"]]', 'INSERT INTO t_member (MemberCode,MemberName,Email,Address,PhoneNo,IsActive) values (:MemberCode,:MemberName,:Email,:Address,:PhoneNo,:IsActive)', '{\"values\":{\"MemberCode\":1756920894,\"MemberName\":\"Kabir\",\"Email\":\"\",\"Address\":\"\",\"PhoneNo\":\"01538198763\",\"IsActive\":1}}'),
(21, '2025-09-03 23:35:18', '127.0.0.1', 1, 'INSERT', 't_member', '[[0,\"\",\"42S22\"],[1,\"\",1054],[2,\"\",\"Unknown column \'CheckId\' in \'where clause\'\"]]', 'INSERT INTO t_member (MemberCode,MemberName,Email,Address,PhoneNo,IsActive) values (:MemberCode,:MemberName,:Email,:Address,:PhoneNo,:IsActive)', '{\"values\":{\"MemberCode\":1756920918,\"MemberName\":\"Abbas\",\"Email\":\"\",\"Address\":\"\",\"PhoneNo\":\"01954256314\",\"IsActive\":1}}'),
(22, '2025-09-03 23:45:37', '127.0.0.1', 1, 'DELETE', 't_team_member_map', '[[\"TeamMemberMapId\",2,\"\"],[\"TeamId\",1,\"\"],[\"MemberId\",1,\"\"],[\"IsTeamLeader\",0,\"\"],[\"CreateTs\",\"2025-08-30 20:36:58\",\"\"],[\"UpdateTs\",null,\"\"]]', 'DELETE FROM t_team_member_map  WHERE TeamMemberMapId = :TeamMemberMapId', '{\"values\":{\"TeamMemberMapId\":2}}'),
(23, '2025-09-03 23:46:12', '127.0.0.1', 1, 'INSERT', 't_team_member_map', '[[\"TeamMemberMapId\",\"\",4],[\"TeamId\",\"\",1],[\"MemberId\",\"\",5],[\"CreateTs\",\"\",\"2025-09-03 23:46:12\"]]', 'INSERT INTO t_team_member_map (TeamId,MemberId,IsTeamLeader) values (:TeamId,:MemberId,:IsTeamLeader)', '{\"values\":{\"TeamId\":\"1\",\"MemberId\":5,\"IsTeamLeader\":0}}'),
(24, '2025-09-03 23:46:17', '127.0.0.1', 1, 'DELETE', 't_team_member_map', '[[\"TeamMemberMapId\",1,\"\"],[\"TeamId\",1,\"\"],[\"MemberId\",3,\"\"],[\"IsTeamLeader\",0,\"\"],[\"CreateTs\",\"2025-08-30 20:36:46\",\"\"],[\"UpdateTs\",null,\"\"]]', 'DELETE FROM t_team_member_map  WHERE TeamMemberMapId = :TeamMemberMapId', '{\"values\":{\"TeamMemberMapId\":1}}'),
(25, '2025-09-03 23:46:28', '127.0.0.1', 1, 'INSERT', 't_team_member_map', '[[\"TeamMemberMapId\",\"\",5],[\"TeamId\",\"\",1],[\"MemberId\",\"\",1],[\"CreateTs\",\"\",\"2025-09-03 23:46:28\"]]', 'INSERT INTO t_team_member_map (TeamId,MemberId,IsTeamLeader) values (:TeamId,:MemberId,:IsTeamLeader)', '{\"values\":{\"TeamId\":\"1\",\"MemberId\":1,\"IsTeamLeader\":0}}'),
(26, '2025-09-04 00:05:37', '127.0.0.1', 1, 'INSERT', 't_team_member_map', '[[\"TeamMemberMapId\",\"\",6],[\"TeamId\",\"\",1],[\"MemberId\",\"\",6],[\"CreateTs\",\"\",\"2025-09-04 00:05:37\"]]', 'INSERT INTO t_team_member_map (TeamId,MemberId,IsTeamLeader) values (:TeamId,:MemberId,:IsTeamLeader)', '{\"values\":{\"TeamId\":\"1\",\"MemberId\":6,\"IsTeamLeader\":0}}'),
(27, '2025-09-04 00:05:38', '127.0.0.1', 1, 'DELETE', 't_team_member_map', '[[\"TeamMemberMapId\",6,\"\"],[\"TeamId\",1,\"\"],[\"MemberId\",6,\"\"],[\"IsTeamLeader\",0,\"\"],[\"CreateTs\",\"2025-09-04 00:05:37\",\"\"],[\"UpdateTs\",null,\"\"]]', 'DELETE FROM t_team_member_map  WHERE TeamMemberMapId = :TeamMemberMapId', '{\"values\":{\"TeamMemberMapId\":6}}'),
(28, '2025-09-04 00:10:36', '127.0.0.1', 1, 'INSERT', 't_team_member_map', '[[\"TeamMemberMapId\",\"\",7],[\"TeamId\",\"\",2],[\"MemberId\",\"\",6],[\"CreateTs\",\"\",\"2025-09-04 00:10:36\"]]', 'INSERT INTO t_team_member_map (TeamId,MemberId,IsTeamLeader) values (:TeamId,:MemberId,:IsTeamLeader)', '{\"values\":{\"TeamId\":\"2\",\"MemberId\":6,\"IsTeamLeader\":0}}'),
(29, '2025-09-04 00:10:42', '127.0.0.1', 1, 'INSERT', 't_team_member_map', '[[\"TeamMemberMapId\",\"\",8],[\"TeamId\",\"\",1],[\"MemberId\",\"\",6],[\"CreateTs\",\"\",\"2025-09-04 00:10:42\"]]', 'INSERT INTO t_team_member_map (TeamId,MemberId,IsTeamLeader) values (:TeamId,:MemberId,:IsTeamLeader)', '{\"values\":{\"TeamId\":\"1\",\"MemberId\":6,\"IsTeamLeader\":0}}'),
(30, '2025-09-04 00:19:01', '127.0.0.1', 1, 'DELETE', 't_role_menu_map', '[[\"RoleMenuId\",12,\"\"],[\"ClientId\",1,\"\"],[\"BranchId\",1,\"\"],[\"RoleId\",1,\"\"],[\"MenuId\",26,\"\"],[\"PermissionType\",2,\"\"],[\"CreateTs\",\"2023-08-09 12:14:16\",\"\"],[\"UpdateTs\",\"2024-10-21 15:04:27\",\"\"]]', 'DELETE FROM t_role_menu_map  WHERE RoleMenuId = :RoleMenuId', '{\"values\":{\"RoleMenuId\":12}}'),
(31, '2025-09-04 00:19:02', '127.0.0.1', 1, 'INSERT', 't_role_menu_map', '[[\"RoleMenuId\",\"\",409],[\"ClientId\",\"\",1],[\"BranchId\",\"\",1],[\"RoleId\",\"\",1],[\"MenuId\",\"\",26],[\"PermissionType\",\"\",1],[\"CreateTs\",\"\",\"2025-09-04 00:19:02\"]]', 'INSERT INTO t_role_menu_map (ClientId,BranchId,RoleId,MenuId,PermissionType) values (:ClientId,:BranchId,:RoleId,:MenuId,:PermissionType)', '{\"values\":{\"ClientId\":\"1\",\"BranchId\":\"1\",\"RoleId\":\"1\",\"MenuId\":26,\"PermissionType\":1}}'),
(32, '2025-09-04 00:19:03', '127.0.0.1', 1, 'UPDATE', 't_role_menu_map', '[[\"PermissionType\",1,2]]', 'UPDATE t_role_menu_map SET PermissionType = :PermissionType  WHERE RoleMenuId = :RoleMenuId', '{\"values\":{\"PermissionType\":2,\"RoleMenuId\":409}}'),
(33, '2025-09-04 00:33:05', '127.0.0.1', 1, 'INSERT', 't_buyer', '[[\"BuyerId\",\"\",2],[\"BuyerName\",\"\",\"aaa\"],[\"Phone\",\"\",\"34\"],[\"Email\",\"\",\"4\"],[\"Address\",\"\",\"222222222gf\"],[\"UpdateTs\",\"\",\"2025-09-04 00:33:05\"],[\"CreateTs\",\"\",\"2025-09-04 00:33:05\"]]', 'INSERT INTO t_buyer (BuyerName,Phone,Email,Address) values (:BuyerName,:Phone,:Email,:Address)', '{\"values\":{\"BuyerName\":\"aaa\",\"Phone\":\"34\",\"Email\":\"4\",\"Address\":\"222222222gf\"}}'),
(34, '2025-09-04 00:33:12', '127.0.0.1', 1, 'UPDATE', 't_buyer', '[[\"BuyerName\",\"aaa\",\"aaaA\"],[\"Phone\",\"34\",\"34s\"],[\"Email\",\"4\",\"4s\"],[\"Address\",\"222222222gf\",\"222222222gfddddd\"],[\"UpdateTs\",\"2025-09-04 00:33:05\",\"2025-09-04 00:33:12\"]]', 'UPDATE t_buyer SET BuyerName = :BuyerName, Phone = :Phone, Email = :Email, Address = :Address  WHERE BuyerId = :BuyerId', '{\"values\":{\"BuyerName\":\"aaaA\",\"Phone\":\"34s\",\"Email\":\"4s\",\"Address\":\"222222222gfddddd\",\"BuyerId\":2}}'),
(35, '2025-09-04 00:33:16', '127.0.0.1', 1, 'DELETE', 't_buyer', '[[\"BuyerId\",2,\"\"],[\"BuyerName\",\"aaaA\",\"\"],[\"Phone\",\"34s\",\"\"],[\"Email\",\"4s\",\"\"],[\"Address\",\"222222222gfddddd\",\"\"],[\"UpdateTs\",\"2025-09-04 00:33:12\",\"\"],[\"CreateTs\",\"2025-09-04 00:33:05\",\"\"]]', 'DELETE FROM t_buyer  WHERE BuyerId = :BuyerId', '{\"values\":{\"BuyerId\":2}}'),
(36, '2025-09-04 22:24:50', '127.0.0.1', 1, 'INSERT', 't_buyer', '[[\"BuyerId\",\"\",3],[\"BuyerName\",\"\",\"s\"],[\"UpdateTs\",\"\",\"2025-09-04 22:24:50\"],[\"CreateTs\",\"\",\"2025-09-04 22:24:50\"]]', 'INSERT INTO t_buyer (BuyerName,Phone,Email,Address) values (:BuyerName,:Phone,:Email,:Address)', '{\"values\":{\"BuyerName\":\"s\",\"Phone\":\"\",\"Email\":\"\",\"Address\":\"\"}}'),
(37, '2025-09-04 22:24:54', '127.0.0.1', 1, 'DELETE', 't_buyer', '[[\"BuyerId\",3,\"\"],[\"BuyerName\",\"s\",\"\"],[\"Phone\",\"\",\"\"],[\"Email\",\"\",\"\"],[\"Address\",\"\",\"\"],[\"UpdateTs\",\"2025-09-04 22:24:50\",\"\"],[\"CreateTs\",\"2025-09-04 22:24:50\",\"\"]]', 'DELETE FROM t_buyer  WHERE BuyerId = :BuyerId', '{\"values\":{\"BuyerId\":3}}'),
(38, '2025-09-05 00:48:04', '127.0.0.1', 1, 'INSERT', 't_transaction', '[[\"TransactionId\",\"\",2],[\"TransactionTypeId\",\"\",1],[\"TransactionDate\",\"\",\"2025-09-05 00:00:00\"],[\"InvoiceNo\",\"\",\"2025-09-05\"],[\"ActivityId\",\"\",2],[\"FactoryId\",\"\",1],[\"ProgramId\",\"\",1],[\"TentativeOfferPrice\",\"\",222],[\"Remarks\",\"\",\"ffffff\"],[\"UserId\",\"\",1],[\"StatusId\",\"\",1],[\"UpdateTs\",\"\",\"2025-09-05 00:48:04\"],[\"CreateTs\",\"\",\"2025-09-05 00:48:04\"]]', 'INSERT INTO t_transaction (TransactionTypeId,TransactionDate,InvoiceNo,ActivityId,FactoryId,ProgramId,ExpireDate,OpportunityDate,TentativeOfferPrice,CertificateBody,CoordinatorId,AuditStageId,LeadStatusId,ManDay,BuyerId,NextFollowupDate,TeamId,MemberId,Remarks,UserId,StatusId) values (:TransactionTypeId,:TransactionDate,:InvoiceNo,:ActivityId,:FactoryId,:ProgramId,:ExpireDate,:OpportunityDate,:TentativeOfferPrice,:CertificateBody,:CoordinatorId,:AuditStageId,:LeadStatusId,:ManDay,:BuyerId,:NextFollowupDate,:TeamId,:MemberId,:Remarks,:UserId,:StatusId)', '{\"values\":{\"TransactionTypeId\":1,\"TransactionDate\":\"2025-09-05\",\"InvoiceNo\":\"2025-09-05\",\"ActivityId\":2,\"FactoryId\":1,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":\"222\",\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":null,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":null,\"NextFollowupDate\":null,\"TeamId\":null,\"MemberId\":null,\"Remarks\":\"ffffff\",\"UserId\":\"1\",\"StatusId\":1}}'),
(39, '2025-09-05 00:51:05', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"FactoryId\",1,2],[\"ProgramId\",1,2],[\"AuditStageId\",null,1],[\"BuyerId\",null,1],[\"NextFollowupDate\",null,\"2025-09-19\"],[\"TeamId\",null,1],[\"MemberId\",null,5],[\"UpdateTs\",\"2025-09-05 00:48:04\",\"2025-09-05 00:51:05\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":2,\"ProgramId\":2,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":222,\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":1,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":1,\"NextFollowupDate\":\"2025-09-19\",\"TeamId\":1,\"MemberId\":5,\"Remarks\":\"ffffff\",\"UserId\":\"1\",\"TransactionId\":2}}'),
(40, '2025-09-05 00:52:30', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"Remarks\",\"ffffff\",\"ffffffaaaaaa\"],[\"UpdateTs\",\"2025-09-05 00:51:05\",\"2025-09-05 00:52:30\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":2,\"ProgramId\":2,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":222,\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":1,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":1,\"NextFollowupDate\":\"2025-09-19\",\"TeamId\":1,\"MemberId\":5,\"Remarks\":\"ffffffaaaaaa\",\"UserId\":\"1\",\"TransactionId\":2}}'),
(41, '2025-09-05 00:52:46', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"ExpireDate\",null,\"2025-09-26\"],[\"UpdateTs\",\"2025-09-05 00:52:30\",\"2025-09-05 00:52:46\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":2,\"ProgramId\":2,\"ExpireDate\":\"2025-09-26\",\"OpportunityDate\":null,\"TentativeOfferPrice\":222,\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":1,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":1,\"NextFollowupDate\":\"2025-09-19\",\"TeamId\":1,\"MemberId\":5,\"Remarks\":\"ffffffaaaaaa\",\"UserId\":\"1\",\"TransactionId\":2}}'),
(42, '2025-09-05 00:59:07', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"OpportunityDate\",null,\"2025-09-25\"],[\"CertificateBody\",null,\"5dfgd\"],[\"CoordinatorId\",null,1],[\"LeadStatusId\",null,3],[\"ManDay\",null,44],[\"TeamId\",1,2],[\"MemberId\",5,6],[\"UpdateTs\",\"2025-09-05 00:52:46\",\"2025-09-05 00:59:07\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":2,\"ProgramId\":2,\"ExpireDate\":\"2025-09-26\",\"OpportunityDate\":\"2025-09-25\",\"TentativeOfferPrice\":222,\"CertificateBody\":\"5dfgd\",\"CoordinatorId\":1,\"AuditStageId\":1,\"LeadStatusId\":3,\"ManDay\":\"44\",\"BuyerId\":1,\"NextFollowupDate\":\"2025-09-19\",\"TeamId\":2,\"MemberId\":6,\"Remarks\":\"ffffffaaaaaa\",\"UserId\":\"1\",\"TransactionId\":2}}'),
(43, '2025-09-05 01:00:23', '127.0.0.1', 1, 'INSERT', 't_transaction', '[[\"TransactionId\",\"\",4],[\"TransactionTypeId\",\"\",1],[\"TransactionDate\",\"\",\"2025-09-05 00:00:00\"],[\"InvoiceNo\",\"\",\"1757012423\"],[\"ActivityId\",\"\",1],[\"FactoryId\",\"\",1],[\"ProgramId\",\"\",1],[\"UserId\",\"\",1],[\"StatusId\",\"\",1],[\"UpdateTs\",\"\",\"2025-09-05 01:00:23\"],[\"CreateTs\",\"\",\"2025-09-05 01:00:23\"]]', 'INSERT INTO t_transaction (TransactionTypeId,TransactionDate,InvoiceNo,ActivityId,FactoryId,ProgramId,ExpireDate,OpportunityDate,TentativeOfferPrice,CertificateBody,CoordinatorId,AuditStageId,LeadStatusId,ManDay,BuyerId,NextFollowupDate,TeamId,MemberId,Remarks,UserId,StatusId) values (:TransactionTypeId,:TransactionDate,:InvoiceNo,:ActivityId,:FactoryId,:ProgramId,:ExpireDate,:OpportunityDate,:TentativeOfferPrice,:CertificateBody,:CoordinatorId,:AuditStageId,:LeadStatusId,:ManDay,:BuyerId,:NextFollowupDate,:TeamId,:MemberId,:Remarks,:UserId,:StatusId)', '{\"values\":{\"TransactionTypeId\":1,\"TransactionDate\":\"2025-09-05\",\"InvoiceNo\":1757012423,\"ActivityId\":1,\"FactoryId\":1,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":null,\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":null,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":null,\"NextFollowupDate\":null,\"TeamId\":null,\"MemberId\":null,\"Remarks\":null,\"UserId\":\"1\",\"StatusId\":1}}'),
(44, '2025-09-05 01:00:48', '127.0.0.1', 1, 'INSERT', 't_transaction', '[[\"TransactionId\",\"\",5],[\"TransactionTypeId\",\"\",1],[\"TransactionDate\",\"\",\"2025-09-05 00:00:00\"],[\"InvoiceNo\",\"\",\"1757012448\"],[\"ActivityId\",\"\",2],[\"FactoryId\",\"\",2],[\"ProgramId\",\"\",1],[\"UserId\",\"\",1],[\"StatusId\",\"\",1],[\"UpdateTs\",\"\",\"2025-09-05 01:00:48\"],[\"CreateTs\",\"\",\"2025-09-05 01:00:48\"]]', 'INSERT INTO t_transaction (TransactionTypeId,TransactionDate,InvoiceNo,ActivityId,FactoryId,ProgramId,ExpireDate,OpportunityDate,TentativeOfferPrice,CertificateBody,CoordinatorId,AuditStageId,LeadStatusId,ManDay,BuyerId,NextFollowupDate,TeamId,MemberId,Remarks,UserId,StatusId) values (:TransactionTypeId,:TransactionDate,:InvoiceNo,:ActivityId,:FactoryId,:ProgramId,:ExpireDate,:OpportunityDate,:TentativeOfferPrice,:CertificateBody,:CoordinatorId,:AuditStageId,:LeadStatusId,:ManDay,:BuyerId,:NextFollowupDate,:TeamId,:MemberId,:Remarks,:UserId,:StatusId)', '{\"values\":{\"TransactionTypeId\":1,\"TransactionDate\":\"2025-09-05\",\"InvoiceNo\":1757012448,\"ActivityId\":2,\"FactoryId\":2,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":null,\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":null,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":null,\"NextFollowupDate\":null,\"TeamId\":null,\"MemberId\":null,\"Remarks\":null,\"UserId\":\"1\",\"StatusId\":1}}'),
(45, '2025-09-05 01:00:53', '127.0.0.1', 1, 'DELETE', 't_transaction', '[[\"TransactionId\",4,\"\"],[\"TransactionTypeId\",1,\"\"],[\"TransactionDate\",\"2025-09-05 00:00:00\",\"\"],[\"InvoiceNo\",\"1757012423\",\"\"],[\"ActivityId\",1,\"\"],[\"FactoryId\",1,\"\"],[\"ProgramId\",1,\"\"],[\"ExpireDate\",null,\"\"],[\"OpportunityDate\",null,\"\"],[\"TentativeOfferPrice\",null,\"\"],[\"CertificateBody\",null,\"\"],[\"CoordinatorId\",null,\"\"],[\"AuditStageId\",null,\"\"],[\"LeadStatusId\",null,\"\"],[\"ManDay\",null,\"\"],[\"BuyerId\",null,\"\"],[\"NextFollowupDate\",null,\"\"],[\"TeamId\",null,\"\"],[\"MemberId\",null,\"\"],[\"Remarks\",null,\"\"],[\"UserId\",1,\"\"],[\"StatusId\",1,\"\"],[\"UpdateTs\",\"2025-09-05 01:00:23\",\"\"],[\"CreateTs\",\"2025-09-05 01:00:23\",\"\"]]', 'DELETE FROM t_transaction  WHERE TransactionId = :TransactionId', '{\"values\":{\"TransactionId\":4}}'),
(46, '2025-09-05 12:06:28', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"TentativeOfferPrice\",null,20],[\"UpdateTs\",\"2025-09-05 01:00:48\",\"2025-09-05 12:06:28\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":2,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":\"20\",\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":null,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":null,\"NextFollowupDate\":null,\"TeamId\":null,\"MemberId\":null,\"Remarks\":null,\"UserId\":\"1\",\"TransactionId\":5}}'),
(47, '2025-09-05 12:16:24', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"MemberId\",3,1],[\"UpdateTs\",\"2025-08-30 21:24:30\",\"2025-09-05 12:16:24\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":1,\"FactoryId\":1,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":null,\"CertificateBody\":null,\"CoordinatorId\":1,\"AuditStageId\":1,\"LeadStatusId\":1,\"ManDay\":5,\"BuyerId\":1,\"NextFollowupDate\":null,\"TeamId\":1,\"MemberId\":1,\"Remarks\":null,\"UserId\":\"1\",\"TransactionId\":1}}'),
(48, '2025-09-05 12:22:10', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"Remarks\",null,\"ssss\"],[\"UpdateTs\",\"2025-09-05 12:16:24\",\"2025-09-05 12:22:10\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":1,\"FactoryId\":1,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":null,\"CertificateBody\":null,\"CoordinatorId\":1,\"AuditStageId\":1,\"LeadStatusId\":1,\"ManDay\":5,\"BuyerId\":1,\"NextFollowupDate\":null,\"TeamId\":1,\"MemberId\":1,\"Remarks\":\"ssss\",\"UserId\":\"1\",\"TransactionId\":1}}'),
(49, '2025-09-05 12:22:29', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"TeamId\",1,2],[\"UpdateTs\",\"2025-09-05 12:22:10\",\"2025-09-05 12:22:29\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":1,\"FactoryId\":1,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":null,\"CertificateBody\":null,\"CoordinatorId\":1,\"AuditStageId\":1,\"LeadStatusId\":1,\"ManDay\":5,\"BuyerId\":1,\"NextFollowupDate\":null,\"TeamId\":2,\"MemberId\":1,\"Remarks\":\"ssss\",\"UserId\":\"1\",\"TransactionId\":1}}'),
(50, '2025-09-05 12:34:40', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"TeamId\",2,1],[\"MemberId\",6,3],[\"UpdateTs\",\"2025-09-05 00:59:07\",\"2025-09-05 12:34:40\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":2,\"ProgramId\":2,\"ExpireDate\":\"2025-09-26\",\"OpportunityDate\":\"2025-09-25\",\"TentativeOfferPrice\":222,\"CertificateBody\":\"5dfgd\",\"CoordinatorId\":1,\"AuditStageId\":1,\"LeadStatusId\":3,\"ManDay\":44,\"BuyerId\":1,\"NextFollowupDate\":\"2025-09-19\",\"TeamId\":1,\"MemberId\":3,\"Remarks\":\"ffffffaaaaaa\",\"UserId\":\"1\",\"TransactionId\":2}}'),
(51, '2025-09-05 15:29:33', '127.0.0.1', 1, 'INSERT', 't_transaction', '[[\"TransactionId\",\"\",6],[\"TransactionTypeId\",\"\",1],[\"TransactionDate\",\"\",\"2025-09-05 00:00:00\"],[\"InvoiceNo\",\"\",\"1757064573\"],[\"ActivityId\",\"\",2],[\"FactoryId\",\"\",1],[\"ProgramId\",\"\",2],[\"ExpireDate\",\"\",\"2025-09-13\"],[\"OpportunityDate\",\"\",\"2025-09-30\"],[\"TentativeOfferPrice\",\"\",10],[\"CertificateBody\",\"\",\"15\"],[\"CoordinatorId\",\"\",1],[\"AuditStageId\",\"\",2],[\"LeadStatusId\",\"\",1],[\"ManDay\",\"\",20],[\"BuyerId\",\"\",1],[\"NextFollowupDate\",\"\",\"2025-09-06\"],[\"TeamId\",\"\",2],[\"MemberId\",\"\",6],[\"Remarks\",\"\",\"R001\"],[\"UserId\",\"\",1],[\"StatusId\",\"\",1],[\"UpdateTs\",\"\",\"2025-09-05 15:29:33\"],[\"CreateTs\",\"\",\"2025-09-05 15:29:33\"]]', 'INSERT INTO t_transaction (TransactionTypeId,TransactionDate,InvoiceNo,ActivityId,FactoryId,ProgramId,ExpireDate,OpportunityDate,TentativeOfferPrice,CertificateBody,CoordinatorId,AuditStageId,LeadStatusId,ManDay,BuyerId,NextFollowupDate,TeamId,MemberId,Remarks,UserId,StatusId) values (:TransactionTypeId,:TransactionDate,:InvoiceNo,:ActivityId,:FactoryId,:ProgramId,:ExpireDate,:OpportunityDate,:TentativeOfferPrice,:CertificateBody,:CoordinatorId,:AuditStageId,:LeadStatusId,:ManDay,:BuyerId,:NextFollowupDate,:TeamId,:MemberId,:Remarks,:UserId,:StatusId)', '{\"values\":{\"TransactionTypeId\":1,\"TransactionDate\":\"2025-09-05\",\"InvoiceNo\":1757064573,\"ActivityId\":2,\"FactoryId\":1,\"ProgramId\":2,\"ExpireDate\":\"2025-09-13\",\"OpportunityDate\":\"2025-09-30\",\"TentativeOfferPrice\":\"10\",\"CertificateBody\":\"15\",\"CoordinatorId\":1,\"AuditStageId\":2,\"LeadStatusId\":1,\"ManDay\":\"20\",\"BuyerId\":1,\"NextFollowupDate\":\"2025-09-06\",\"TeamId\":2,\"MemberId\":6,\"Remarks\":\"R001\",\"UserId\":\"1\",\"StatusId\":1}}'),
(52, '2025-09-05 15:31:29', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"ManDay\",20,30],[\"UpdateTs\",\"2025-09-05 15:29:33\",\"2025-09-05 15:31:29\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":1,\"ProgramId\":2,\"ExpireDate\":\"2025-09-13\",\"OpportunityDate\":\"2025-09-30\",\"TentativeOfferPrice\":10,\"CertificateBody\":\"15\",\"CoordinatorId\":1,\"AuditStageId\":2,\"LeadStatusId\":1,\"ManDay\":\"30\",\"BuyerId\":1,\"NextFollowupDate\":\"2025-09-06\",\"TeamId\":2,\"MemberId\":6,\"Remarks\":\"R001\",\"UserId\":\"1\",\"TransactionId\":6}}'),
(53, '2025-09-05 15:32:11', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"TeamId\",null,1],[\"MemberId\",null,1],[\"UpdateTs\",\"2025-09-05 12:06:28\",\"2025-09-05 15:32:11\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":2,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":20,\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":null,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":null,\"NextFollowupDate\":null,\"TeamId\":1,\"MemberId\":1,\"Remarks\":null,\"UserId\":\"1\",\"TransactionId\":5}}'),
(54, '2025-09-05 15:32:46', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"MemberId\",6,null],[\"UpdateTs\",\"2025-09-05 15:31:29\",\"2025-09-05 15:32:46\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":1,\"ProgramId\":2,\"ExpireDate\":\"2025-09-13\",\"OpportunityDate\":\"2025-09-30\",\"TentativeOfferPrice\":10,\"CertificateBody\":\"15\",\"CoordinatorId\":1,\"AuditStageId\":2,\"LeadStatusId\":1,\"ManDay\":30,\"BuyerId\":1,\"NextFollowupDate\":\"2025-09-06\",\"TeamId\":2,\"MemberId\":null,\"Remarks\":\"R001\",\"UserId\":\"1\",\"TransactionId\":6}}'),
(55, '2025-09-05 15:36:39', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"TeamId\",2,null],[\"UpdateTs\",\"2025-09-05 15:32:46\",\"2025-09-05 15:36:39\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":1,\"ProgramId\":2,\"ExpireDate\":\"2025-09-13\",\"OpportunityDate\":\"2025-09-30\",\"TentativeOfferPrice\":10,\"CertificateBody\":\"15\",\"CoordinatorId\":1,\"AuditStageId\":2,\"LeadStatusId\":1,\"ManDay\":30,\"BuyerId\":1,\"NextFollowupDate\":\"2025-09-06\",\"TeamId\":null,\"MemberId\":null,\"Remarks\":\"R001\",\"UserId\":\"1\",\"TransactionId\":6}}'),
(56, '2025-09-05 15:42:59', '127.0.0.1', 1, 'INSERT', 't_transaction', '[[\"TransactionId\",\"\",7],[\"TransactionTypeId\",\"\",1],[\"TransactionDate\",\"\",\"2025-09-05 00:00:00\"],[\"InvoiceNo\",\"\",\"1757065379\"],[\"ActivityId\",\"\",2],[\"FactoryId\",\"\",1],[\"ProgramId\",\"\",3],[\"UserId\",\"\",1],[\"StatusId\",\"\",1],[\"UpdateTs\",\"\",\"2025-09-05 15:42:59\"],[\"CreateTs\",\"\",\"2025-09-05 15:42:59\"]]', 'INSERT INTO t_transaction (TransactionTypeId,TransactionDate,InvoiceNo,ActivityId,FactoryId,ProgramId,ExpireDate,OpportunityDate,TentativeOfferPrice,CertificateBody,CoordinatorId,AuditStageId,LeadStatusId,ManDay,BuyerId,NextFollowupDate,TeamId,MemberId,Remarks,UserId,StatusId) values (:TransactionTypeId,:TransactionDate,:InvoiceNo,:ActivityId,:FactoryId,:ProgramId,:ExpireDate,:OpportunityDate,:TentativeOfferPrice,:CertificateBody,:CoordinatorId,:AuditStageId,:LeadStatusId,:ManDay,:BuyerId,:NextFollowupDate,:TeamId,:MemberId,:Remarks,:UserId,:StatusId)', '{\"values\":{\"TransactionTypeId\":1,\"TransactionDate\":\"2025-09-05\",\"InvoiceNo\":1757065379,\"ActivityId\":2,\"FactoryId\":1,\"ProgramId\":3,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":null,\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":null,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":null,\"NextFollowupDate\":null,\"TeamId\":null,\"MemberId\":null,\"Remarks\":null,\"UserId\":\"1\",\"StatusId\":1}}'),
(57, '2025-09-05 16:24:55', '127.0.0.1', 1, 'UPDATE', 't_transaction', '[[\"NextFollowupDate\",null,\"2025-09-11\"],[\"UpdateTs\",\"2025-09-05 15:32:11\",\"2025-09-05 16:24:55\"]]', 'UPDATE t_transaction SET ActivityId = :ActivityId, FactoryId = :FactoryId, ProgramId = :ProgramId, ExpireDate = :ExpireDate, OpportunityDate = :OpportunityDate, TentativeOfferPrice = :TentativeOfferPrice, CertificateBody = :CertificateBody, CoordinatorId = :CoordinatorId, AuditStageId = :AuditStageId, LeadStatusId = :LeadStatusId, ManDay = :ManDay, BuyerId = :BuyerId, NextFollowupDate = :NextFollowupDate, TeamId = :TeamId, MemberId = :MemberId, Remarks = :Remarks, UserId = :UserId  WHERE TransactionId = :TransactionId', '{\"values\":{\"ActivityId\":2,\"FactoryId\":2,\"ProgramId\":1,\"ExpireDate\":null,\"OpportunityDate\":null,\"TentativeOfferPrice\":20,\"CertificateBody\":null,\"CoordinatorId\":null,\"AuditStageId\":null,\"LeadStatusId\":null,\"ManDay\":null,\"BuyerId\":null,\"NextFollowupDate\":\"2025-09-11\",\"TeamId\":1,\"MemberId\":1,\"Remarks\":null,\"UserId\":\"1\",\"TransactionId\":5}}');

-- --------------------------------------------------------

--
-- Table structure for table `t_status`
--

CREATE TABLE `t_status` (
  `StatusId` smallint(3) NOT NULL,
  `StatusName` varchar(50) NOT NULL,
  `CreateTs` timestamp NULL DEFAULT NULL,
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_status`
--

INSERT INTO `t_status` (`StatusId`, `StatusName`, `CreateTs`, `UpdateTs`) VALUES
(1, 'Draft', '2024-08-09 18:14:16', '2024-08-09 18:14:16'),
(5, 'Post', '2024-08-09 18:14:16', '2024-08-09 18:14:16');

-- --------------------------------------------------------

--
-- Table structure for table `t_team`
--

CREATE TABLE `t_team` (
  `TeamId` smallint(3) NOT NULL,
  `TeamName` varchar(50) NOT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_team`
--

INSERT INTO `t_team` (`TeamId`, `TeamName`, `CreateTs`, `UpdateTs`) VALUES
(1, 'Team 1', '2024-08-09 12:14:16', '2024-08-09 12:14:16'),
(2, 'Team 2', '2024-08-09 12:14:16', '2024-08-09 12:14:16');

-- --------------------------------------------------------

--
-- Table structure for table `t_team_member_map`
--

CREATE TABLE `t_team_member_map` (
  `TeamMemberMapId` int(11) NOT NULL,
  `TeamId` smallint(3) NOT NULL,
  `MemberId` int(11) NOT NULL,
  `IsTeamLeader` tinyint(1) NOT NULL DEFAULT 0,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_team_member_map`
--

INSERT INTO `t_team_member_map` (`TeamMemberMapId`, `TeamId`, `MemberId`, `IsTeamLeader`, `CreateTs`, `UpdateTs`) VALUES
(3, 2, 3, 0, '2025-08-30 14:37:14', NULL),
(4, 1, 5, 0, '2025-09-03 17:46:12', NULL),
(5, 1, 1, 0, '2025-09-03 17:46:28', NULL),
(7, 2, 6, 0, '2025-09-03 18:10:36', NULL),
(8, 1, 6, 0, '2025-09-03 18:10:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_transaction`
--

CREATE TABLE `t_transaction` (
  `TransactionId` int(11) NOT NULL,
  `TransactionTypeId` smallint(3) NOT NULL,
  `TransactionDate` datetime NOT NULL,
  `InvoiceNo` varchar(20) NOT NULL,
  `ActivityId` smallint(3) NOT NULL,
  `FactoryId` int(11) NOT NULL,
  `ProgramId` smallint(3) NOT NULL,
  `ExpireDate` date DEFAULT NULL,
  `OpportunityDate` date DEFAULT NULL,
  `TentativeOfferPrice` float(12,2) DEFAULT NULL,
  `CertificateBody` varchar(100) DEFAULT NULL,
  `CoordinatorId` int(11) DEFAULT NULL COMMENT 'Link with User',
  `AuditStageId` smallint(3) DEFAULT NULL,
  `LeadStatusId` smallint(3) DEFAULT NULL,
  `ManDay` smallint(6) DEFAULT NULL,
  `BuyerId` int(11) DEFAULT NULL,
  `NextFollowupDate` date DEFAULT NULL,
  `TeamId` smallint(3) DEFAULT NULL COMMENT 'Member Team',
  `MemberId` int(11) DEFAULT NULL COMMENT 'Team Members',
  `Remarks` varchar(200) DEFAULT NULL,
  `UserId` int(11) NOT NULL COMMENT 'Entry By',
  `StatusId` smallint(3) NOT NULL,
  `UpdateTs` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_transaction`
--

INSERT INTO `t_transaction` (`TransactionId`, `TransactionTypeId`, `TransactionDate`, `InvoiceNo`, `ActivityId`, `FactoryId`, `ProgramId`, `ExpireDate`, `OpportunityDate`, `TentativeOfferPrice`, `CertificateBody`, `CoordinatorId`, `AuditStageId`, `LeadStatusId`, `ManDay`, `BuyerId`, `NextFollowupDate`, `TeamId`, `MemberId`, `Remarks`, `UserId`, `StatusId`, `UpdateTs`, `CreateTs`) VALUES
(1, 1, '2025-08-30 17:23:37', '111111', 1, 1, 1, NULL, NULL, NULL, NULL, 1, 1, 1, 5, 1, NULL, 2, 3, 'ssss', 1, 5, '2025-09-05 09:04:38', '2025-08-30 15:24:30'),
(2, 1, '2025-09-05 00:00:00', '2025-09-05', 2, 2, 2, '2025-09-26', '2025-09-25', 222.00, '5dfgd', 1, 1, 3, 44, 1, '2025-09-19', 1, 5, 'ffffffaaaaaa', 1, 1, '2025-09-05 09:04:47', '2025-09-04 18:48:04'),
(5, 1, '2025-09-05 00:00:00', '1757012448', 2, 2, 1, NULL, NULL, 20.00, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-11', 1, 1, NULL, 1, 1, '2025-09-05 10:24:55', '2025-09-04 19:00:48'),
(6, 1, '2025-09-05 00:00:00', '1757064573', 2, 1, 2, '2025-09-13', '2025-09-30', 10.00, '15', 1, 2, 1, 30, 1, '2025-09-06', NULL, NULL, 'R001', 1, 1, '2025-09-05 09:36:39', '2025-09-05 09:29:33'),
(7, 1, '2025-09-05 00:00:00', '1757065379', 2, 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2025-09-05 09:42:59', '2025-09-05 09:42:59');

-- --------------------------------------------------------

--
-- Table structure for table `t_transaction_items`
--

CREATE TABLE `t_transaction_items` (
  `TransactionItemId` int(11) NOT NULL,
  `TransactionId` int(11) NOT NULL,
  `CheckName` varchar(150) DEFAULT NULL,
  `UpdateTs` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `t_transaction_type`
--

CREATE TABLE `t_transaction_type` (
  `TransactionTypeId` smallint(3) NOT NULL,
  `ClientId` smallint(6) NOT NULL COMMENT 'Will not use',
  `TransactionType` varchar(50) NOT NULL,
  `IsPositive` tinyint(1) NOT NULL DEFAULT 1,
  `UpdateTs` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_transaction_type`
--

INSERT INTO `t_transaction_type` (`TransactionTypeId`, `ClientId`, `TransactionType`, `IsPositive`, `UpdateTs`, `CreateTs`) VALUES
(1, 1, 'Audit', 0, '2025-08-30 13:50:37', '2023-08-09 18:14:16');

-- --------------------------------------------------------

--
-- Table structure for table `t_users`
--

CREATE TABLE `t_users` (
  `UserId` int(11) NOT NULL,
  `ClientId` smallint(6) NOT NULL,
  `BranchId` smallint(6) NOT NULL,
  `UserCode` varchar(50) NOT NULL,
  `UserName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `LoginName` varchar(50) NOT NULL,
  `Email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Password` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `DesignationId` smallint(3) NOT NULL,
  `DepartmentId` smallint(3) NOT NULL,
  `Address` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL,
  `TeamId` smallint(3) DEFAULT NULL,
  `LinemanUserId` int(11) DEFAULT NULL COMMENT 'This is for team leader',
  `BusinessLineId` smallint(3) DEFAULT NULL,
  `PhoneNo` varchar(30) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 0,
  `PhotoUrl` varchar(200) CHARACTER SET utf8mb4 DEFAULT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL,
  `LinemanUserIdTxt` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_users`
--

INSERT INTO `t_users` (`UserId`, `ClientId`, `BranchId`, `UserCode`, `UserName`, `LoginName`, `Email`, `Password`, `DesignationId`, `DepartmentId`, `Address`, `TeamId`, `LinemanUserId`, `BusinessLineId`, `PhoneNo`, `IsActive`, `PhotoUrl`, `CreateTs`, `UpdateTs`, `LinemanUserIdTxt`) VALUES
(1, 1, 1, 'admin', 'Admin User', 'admin', 'admin@gmail.com', '$2y$10$gLjCIc3IjTZPr7YkYsi2Ruqo2A8gxRoC8C2DO30wula7Lbphxuaam', 1, 2, NULL, NULL, NULL, NULL, NULL, 1, 'user.jpg', '2023-08-10 00:14:16', '2024-02-04 05:23:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `t_user_role_map`
--

CREATE TABLE `t_user_role_map` (
  `UserRoleId` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `RoleId` smallint(11) NOT NULL,
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp(),
  `UpdateTs` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_user_role_map`
--

INSERT INTO `t_user_role_map` (`UserRoleId`, `UserId`, `RoleId`, `CreateTs`, `UpdateTs`) VALUES
(1, 1, 1, '2023-08-10 00:14:16', '2024-02-04 05:23:00');

-- --------------------------------------------------------

--
-- Table structure for table `t_year`
--

CREATE TABLE `t_year` (
  `YearId` int(11) NOT NULL,
  `ClientId` smallint(6) NOT NULL,
  `YearName` varchar(10) NOT NULL,
  `UpdateTs` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `CreateTs` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `t_year`
--

INSERT INTO `t_year` (`YearId`, `ClientId`, `YearName`, `UpdateTs`, `CreateTs`) VALUES
(1, 1, '2025', '2025-06-04 17:08:55', '2024-04-26 18:25:59'),
(2, 1, '2026', '2025-06-04 17:09:18', '2024-04-26 18:25:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `t_activity`
--
ALTER TABLE `t_activity`
  ADD PRIMARY KEY (`ActivityId`),
  ADD UNIQUE KEY `UK_t_activity_ActivityName` (`ActivityName`);

--
-- Indexes for table `t_auditor`
--
ALTER TABLE `t_auditor`
  ADD PRIMARY KEY (`AuditorId`),
  ADD UNIQUE KEY `UK_t_auditor_AuditorCode` (`AuditorCode`);

--
-- Indexes for table `t_auditstage`
--
ALTER TABLE `t_auditstage`
  ADD PRIMARY KEY (`AuditStageId`),
  ADD UNIQUE KEY `UK_t_auditstage_AuditStageName` (`AuditStageName`);

--
-- Indexes for table `t_branch`
--
ALTER TABLE `t_branch`
  ADD PRIMARY KEY (`BranchId`),
  ADD UNIQUE KEY `UK_t_branch_ClientId_BranchName` (`ClientId`,`BranchName`);

--
-- Indexes for table `t_buyer`
--
ALTER TABLE `t_buyer`
  ADD PRIMARY KEY (`BuyerId`),
  ADD UNIQUE KEY `UK_t_buyer_BuyerName` (`BuyerName`);

--
-- Indexes for table `t_client`
--
ALTER TABLE `t_client`
  ADD PRIMARY KEY (`ClientId`),
  ADD UNIQUE KEY `UK_t_client_ClientName` (`ClientName`),
  ADD UNIQUE KEY `UK_t_client_ClientCode` (`ClientCode`);

--
-- Indexes for table `t_department`
--
ALTER TABLE `t_department`
  ADD PRIMARY KEY (`DepartmentId`),
  ADD UNIQUE KEY `UK_t_designation_Client_Designation` (`DepartmentName`) USING BTREE;

--
-- Indexes for table `t_designation`
--
ALTER TABLE `t_designation`
  ADD PRIMARY KEY (`DesignationId`),
  ADD UNIQUE KEY `UK_t_designation_Client_Designation` (`ClientId`,`DesignationName`) USING BTREE;

--
-- Indexes for table `t_errorlog`
--
ALTER TABLE `t_errorlog`
  ADD PRIMARY KEY (`LogId`),
  ADD KEY `FK_t_errorlog_t_users` (`UserId`);

--
-- Indexes for table `t_factory`
--
ALTER TABLE `t_factory`
  ADD PRIMARY KEY (`FactoryId`),
  ADD UNIQUE KEY `UK_t_factory_FactoryGroupIdFactoryName` (`FactoryGroupId`,`FactoryName`);

--
-- Indexes for table `t_factorygroup`
--
ALTER TABLE `t_factorygroup`
  ADD PRIMARY KEY (`FactoryGroupId`),
  ADD UNIQUE KEY `UK_t_factorygroup_FactoryGroupName` (`FactoryGroupName`);

--
-- Indexes for table `t_leadstatus`
--
ALTER TABLE `t_leadstatus`
  ADD PRIMARY KEY (`LeadStatusId`),
  ADD UNIQUE KEY `UK_t_leadstatus_LeadStatusName` (`LeadStatusName`);

--
-- Indexes for table `t_member`
--
ALTER TABLE `t_member`
  ADD PRIMARY KEY (`MemberId`),
  ADD UNIQUE KEY `UK_t_member_MemberCode` (`MemberCode`);

--
-- Indexes for table `t_menu`
--
ALTER TABLE `t_menu`
  ADD PRIMARY KEY (`MenuId`);

--
-- Indexes for table `t_month`
--
ALTER TABLE `t_month`
  ADD PRIMARY KEY (`MonthId`),
  ADD UNIQUE KEY `UK_t_month_MonthName` (`MonthName`);

--
-- Indexes for table `t_program`
--
ALTER TABLE `t_program`
  ADD PRIMARY KEY (`ProgramId`),
  ADD UNIQUE KEY `UK_t_program_ProgramName` (`ProgramName`);

--
-- Indexes for table `t_roles`
--
ALTER TABLE `t_roles`
  ADD PRIMARY KEY (`RoleId`),
  ADD UNIQUE KEY `UK_t_roles_RoleName` (`RoleName`);

--
-- Indexes for table `t_role_menu_map`
--
ALTER TABLE `t_role_menu_map`
  ADD PRIMARY KEY (`RoleMenuId`),
  ADD UNIQUE KEY `UK_t_role_menu_map_ClientBranchRoleMenu` (`ClientId`,`BranchId`,`RoleId`,`MenuId`),
  ADD KEY `FK_t_role_menu_map_t_branch` (`BranchId`),
  ADD KEY `FK_t_role_menu_map_t_roles` (`RoleId`),
  ADD KEY `FK_t_role_menu_map_t_menu` (`MenuId`);

--
-- Indexes for table `t_sqllog`
--
ALTER TABLE `t_sqllog`
  ADD PRIMARY KEY (`LogId`),
  ADD KEY `FK_t_sqllog_t_users` (`UserId`);

--
-- Indexes for table `t_status`
--
ALTER TABLE `t_status`
  ADD PRIMARY KEY (`StatusId`),
  ADD UNIQUE KEY `UK_t_status_StatusName` (`StatusName`);

--
-- Indexes for table `t_team`
--
ALTER TABLE `t_team`
  ADD PRIMARY KEY (`TeamId`),
  ADD UNIQUE KEY `UK_t_team_TeamName` (`TeamName`) USING BTREE;

--
-- Indexes for table `t_team_member_map`
--
ALTER TABLE `t_team_member_map`
  ADD PRIMARY KEY (`TeamMemberMapId`),
  ADD UNIQUE KEY `UK_t_team_member_map_TeamId_MemberId` (`TeamId`,`MemberId`),
  ADD KEY `FK_t_team_member_map_t_member` (`MemberId`);

--
-- Indexes for table `t_transaction`
--
ALTER TABLE `t_transaction`
  ADD PRIMARY KEY (`TransactionId`),
  ADD UNIQUE KEY `UK_InvoiceNo` (`InvoiceNo`),
  ADD KEY `FK_t_transaction_t_transaction_type` (`TransactionTypeId`),
  ADD KEY `FK_t_transaction_t_users` (`UserId`),
  ADD KEY `FK_t_transaction_t_status` (`StatusId`),
  ADD KEY `FK_t_transaction_t_activity` (`ActivityId`),
  ADD KEY `FK_t_transaction_t_factory` (`FactoryId`),
  ADD KEY `FK_t_transaction_t_program` (`ProgramId`),
  ADD KEY `FK_t_transaction_t_users_coordinator` (`CoordinatorId`),
  ADD KEY `FK_t_transaction_t_auditstage` (`AuditStageId`),
  ADD KEY `FK_t_transaction_t_leadstatus` (`LeadStatusId`),
  ADD KEY `FK_t_transaction_t_buyer` (`BuyerId`),
  ADD KEY `FK_t_transaction_t_team` (`TeamId`),
  ADD KEY `FK_t_transaction_t_member` (`MemberId`);

--
-- Indexes for table `t_transaction_items`
--
ALTER TABLE `t_transaction_items`
  ADD PRIMARY KEY (`TransactionItemId`),
  ADD KEY `FK_t_transaction_items_t_transaction` (`TransactionId`);

--
-- Indexes for table `t_transaction_type`
--
ALTER TABLE `t_transaction_type`
  ADD PRIMARY KEY (`TransactionTypeId`),
  ADD UNIQUE KEY `UK_t_transaction_type_ClientTransType` (`ClientId`,`TransactionType`);

--
-- Indexes for table `t_users`
--
ALTER TABLE `t_users`
  ADD PRIMARY KEY (`UserId`),
  ADD UNIQUE KEY `UK_t_users_LoginName` (`LoginName`),
  ADD KEY `FK_t_users_t_branch` (`BranchId`),
  ADD KEY `FK_t_users_t_designation` (`DesignationId`),
  ADD KEY `FK_t_users_t_client` (`ClientId`),
  ADD KEY `FK_t_users_t_department` (`DepartmentId`),
  ADD KEY `FK_t_users_t_team` (`TeamId`),
  ADD KEY `FK_t_users_t_businessline` (`BusinessLineId`);

--
-- Indexes for table `t_user_role_map`
--
ALTER TABLE `t_user_role_map`
  ADD PRIMARY KEY (`UserRoleId`),
  ADD UNIQUE KEY `UK_t_role_menu_map_UserRole` (`UserId`,`RoleId`),
  ADD KEY `FK_t_user_role_map_t_roles` (`RoleId`);

--
-- Indexes for table `t_year`
--
ALTER TABLE `t_year`
  ADD PRIMARY KEY (`YearId`),
  ADD UNIQUE KEY `UK_t_year_ClientIdYearName` (`ClientId`,`YearName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `t_activity`
--
ALTER TABLE `t_activity`
  MODIFY `ActivityId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `t_auditor`
--
ALTER TABLE `t_auditor`
  MODIFY `AuditorId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `t_auditstage`
--
ALTER TABLE `t_auditstage`
  MODIFY `AuditStageId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `t_branch`
--
ALTER TABLE `t_branch`
  MODIFY `BranchId` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `t_buyer`
--
ALTER TABLE `t_buyer`
  MODIFY `BuyerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `t_client`
--
ALTER TABLE `t_client`
  MODIFY `ClientId` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `t_department`
--
ALTER TABLE `t_department`
  MODIFY `DepartmentId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `t_designation`
--
ALTER TABLE `t_designation`
  MODIFY `DesignationId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `t_errorlog`
--
ALTER TABLE `t_errorlog`
  MODIFY `LogId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `t_factory`
--
ALTER TABLE `t_factory`
  MODIFY `FactoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `t_factorygroup`
--
ALTER TABLE `t_factorygroup`
  MODIFY `FactoryGroupId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `t_leadstatus`
--
ALTER TABLE `t_leadstatus`
  MODIFY `LeadStatusId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `t_member`
--
ALTER TABLE `t_member`
  MODIFY `MemberId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `t_menu`
--
ALTER TABLE `t_menu`
  MODIFY `MenuId` smallint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `t_month`
--
ALTER TABLE `t_month`
  MODIFY `MonthId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `t_program`
--
ALTER TABLE `t_program`
  MODIFY `ProgramId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `t_roles`
--
ALTER TABLE `t_roles`
  MODIFY `RoleId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `t_role_menu_map`
--
ALTER TABLE `t_role_menu_map`
  MODIFY `RoleMenuId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=410;

--
-- AUTO_INCREMENT for table `t_sqllog`
--
ALTER TABLE `t_sqllog`
  MODIFY `LogId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `t_status`
--
ALTER TABLE `t_status`
  MODIFY `StatusId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `t_team`
--
ALTER TABLE `t_team`
  MODIFY `TeamId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `t_team_member_map`
--
ALTER TABLE `t_team_member_map`
  MODIFY `TeamMemberMapId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `t_transaction`
--
ALTER TABLE `t_transaction`
  MODIFY `TransactionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `t_transaction_items`
--
ALTER TABLE `t_transaction_items`
  MODIFY `TransactionItemId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `t_transaction_type`
--
ALTER TABLE `t_transaction_type`
  MODIFY `TransactionTypeId` smallint(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `t_users`
--
ALTER TABLE `t_users`
  MODIFY `UserId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `t_user_role_map`
--
ALTER TABLE `t_user_role_map`
  MODIFY `UserRoleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=422;

--
-- AUTO_INCREMENT for table `t_year`
--
ALTER TABLE `t_year`
  MODIFY `YearId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `t_branch`
--
ALTER TABLE `t_branch`
  ADD CONSTRAINT `FK_t_branch_t_client` FOREIGN KEY (`ClientId`) REFERENCES `t_client` (`ClientId`);

--
-- Constraints for table `t_designation`
--
ALTER TABLE `t_designation`
  ADD CONSTRAINT `FK_t_designation_t_client` FOREIGN KEY (`ClientId`) REFERENCES `t_client` (`ClientId`);

--
-- Constraints for table `t_errorlog`
--
ALTER TABLE `t_errorlog`
  ADD CONSTRAINT `FK_t_errorlog_t_users` FOREIGN KEY (`UserId`) REFERENCES `t_users` (`UserId`);

--
-- Constraints for table `t_factory`
--
ALTER TABLE `t_factory`
  ADD CONSTRAINT `FK_t_factory_t_factorygroup` FOREIGN KEY (`FactoryGroupId`) REFERENCES `t_factorygroup` (`FactoryGroupId`);

--
-- Constraints for table `t_role_menu_map`
--
ALTER TABLE `t_role_menu_map`
  ADD CONSTRAINT `FK_t_role_menu_map_t_branch` FOREIGN KEY (`BranchId`) REFERENCES `t_branch` (`BranchId`),
  ADD CONSTRAINT `FK_t_role_menu_map_t_client` FOREIGN KEY (`ClientId`) REFERENCES `t_client` (`ClientId`),
  ADD CONSTRAINT `FK_t_role_menu_map_t_menu` FOREIGN KEY (`MenuId`) REFERENCES `t_menu` (`MenuId`),
  ADD CONSTRAINT `FK_t_role_menu_map_t_roles` FOREIGN KEY (`RoleId`) REFERENCES `t_roles` (`RoleId`);

--
-- Constraints for table `t_sqllog`
--
ALTER TABLE `t_sqllog`
  ADD CONSTRAINT `FK_t_sqllog_t_users` FOREIGN KEY (`UserId`) REFERENCES `t_users` (`UserId`);

--
-- Constraints for table `t_team_member_map`
--
ALTER TABLE `t_team_member_map`
  ADD CONSTRAINT `FK_t_team_member_map_t_member` FOREIGN KEY (`MemberId`) REFERENCES `t_member` (`MemberId`),
  ADD CONSTRAINT `FK_t_team_member_map_t_team` FOREIGN KEY (`TeamId`) REFERENCES `t_team` (`TeamId`);

--
-- Constraints for table `t_transaction`
--
ALTER TABLE `t_transaction`
  ADD CONSTRAINT `FK_t_transaction_t_activity` FOREIGN KEY (`ActivityId`) REFERENCES `t_activity` (`ActivityId`),
  ADD CONSTRAINT `FK_t_transaction_t_auditstage` FOREIGN KEY (`AuditStageId`) REFERENCES `t_auditstage` (`AuditStageId`),
  ADD CONSTRAINT `FK_t_transaction_t_buyer` FOREIGN KEY (`BuyerId`) REFERENCES `t_buyer` (`BuyerId`),
  ADD CONSTRAINT `FK_t_transaction_t_factory` FOREIGN KEY (`FactoryId`) REFERENCES `t_factory` (`FactoryId`),
  ADD CONSTRAINT `FK_t_transaction_t_leadstatus` FOREIGN KEY (`LeadStatusId`) REFERENCES `t_leadstatus` (`LeadStatusId`),
  ADD CONSTRAINT `FK_t_transaction_t_member` FOREIGN KEY (`MemberId`) REFERENCES `t_member` (`MemberId`),
  ADD CONSTRAINT `FK_t_transaction_t_program` FOREIGN KEY (`ProgramId`) REFERENCES `t_program` (`ProgramId`),
  ADD CONSTRAINT `FK_t_transaction_t_status` FOREIGN KEY (`StatusId`) REFERENCES `t_status` (`StatusId`),
  ADD CONSTRAINT `FK_t_transaction_t_team` FOREIGN KEY (`TeamId`) REFERENCES `t_team` (`TeamId`),
  ADD CONSTRAINT `FK_t_transaction_t_transaction_type` FOREIGN KEY (`TransactionTypeId`) REFERENCES `t_transaction_type` (`TransactionTypeId`),
  ADD CONSTRAINT `FK_t_transaction_t_users` FOREIGN KEY (`UserId`) REFERENCES `t_users` (`UserId`),
  ADD CONSTRAINT `FK_t_transaction_t_users_coordinator` FOREIGN KEY (`CoordinatorId`) REFERENCES `t_users` (`UserId`);

--
-- Constraints for table `t_transaction_items`
--
ALTER TABLE `t_transaction_items`
  ADD CONSTRAINT `FK_t_transaction_items_t_transaction` FOREIGN KEY (`TransactionId`) REFERENCES `t_transaction` (`TransactionId`);

--
-- Constraints for table `t_transaction_type`
--
ALTER TABLE `t_transaction_type`
  ADD CONSTRAINT `FK_t_transaction_type_t_client` FOREIGN KEY (`ClientId`) REFERENCES `t_client` (`ClientId`);

--
-- Constraints for table `t_users`
--
ALTER TABLE `t_users`
  ADD CONSTRAINT `FK_t_users_t_branch` FOREIGN KEY (`BranchId`) REFERENCES `t_branch` (`BranchId`),
  ADD CONSTRAINT `FK_t_users_t_client` FOREIGN KEY (`ClientId`) REFERENCES `t_client` (`ClientId`),
  ADD CONSTRAINT `FK_t_users_t_department` FOREIGN KEY (`DepartmentId`) REFERENCES `t_department` (`DepartmentId`),
  ADD CONSTRAINT `FK_t_users_t_designation` FOREIGN KEY (`DesignationId`) REFERENCES `t_designation` (`DesignationId`),
  ADD CONSTRAINT `FK_t_users_t_team` FOREIGN KEY (`TeamId`) REFERENCES `t_team` (`TeamId`);

--
-- Constraints for table `t_user_role_map`
--
ALTER TABLE `t_user_role_map`
  ADD CONSTRAINT `FK_t_user_role_map_t_roles` FOREIGN KEY (`RoleId`) REFERENCES `t_roles` (`RoleId`),
  ADD CONSTRAINT `FK_t_user_role_map_t_users` FOREIGN KEY (`UserId`) REFERENCES `t_users` (`UserId`);

--
-- Constraints for table `t_year`
--
ALTER TABLE `t_year`
  ADD CONSTRAINT `FK_t_year_t_client` FOREIGN KEY (`ClientId`) REFERENCES `t_client` (`ClientId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
