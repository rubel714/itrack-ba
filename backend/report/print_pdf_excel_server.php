<?php

include_once('../env.php');
include_once('../source/api/pdolibs/pdo_lib.php');

$tableProperties = array("header_list" => array(), "query_field" => array(), "table_header" => array(), "align" => array(), "width_print_pdf" => array(), "width_excel" => array(), "precision" => array(), "total" => array(), "report_save_name" => "");

// $menukey = $_REQUEST['menukey'];
// $lan = $_REQUEST['lan'];
// include_once ('../source/api/languages/lang_switcher_custom.php');

$siteTitle = reportsitetitleeng;

$task = '';

if (isset($_POST['action'])) {
	$task = $_POST['action'];
} else if (isset($_GET['action'])) {
	$task = $_GET['action'];
}

switch ($task) {
	case "UserExport":
		UserExport();
		break;
	case "TeamExport":
		TeamExport();
		break;
	case "ProgramExport":
		ProgramExport();
		break;
	case "FactoryGroupsExport":
		FactoryGroupsExport();
		break;
	case "FactoryExport":
		FactoryExport();
		break;
	case "AuditStageExport":
		AuditStageExport();
		break;
	case "LeadStatusExport":
		LeadStatusExport();
		break;
	case "DesignationExport":
		DesignationExport();
		break;
	case "OfficeExport":
		OfficeExport();
		break;
	case "ZoneExport":
		ZoneExport();
		break;
	case "MemberExport":
		MemberExport();
		break;
	case "BuyerExport":
		BuyerExport();
		break;
	case "AuditorExport":
		AuditorExport();
		break;
	case "DepartmentExport":
		DepartmentExport();
		break;
	case "HoliDyExport":
		HoliDyExport();
		break;
	case "LeaveExport":
		LeaveExport();
		break;
	case "RevenueTypeExport":
		RevenueTypeExport();
		break;
	case "SalesPersonInputExport":
		SalesPersonInputExport();
		break;
	case "CoordinatorInputExport":
		CoordinatorInputExport();
		break;
	case "InvoiceExport":
		InvoiceExport();
		break;
	case "ReportReviewerExport":
		ReportReviewerExport();
		break;




	case "RoleExport":
		RoleExport();
		break;



	case "RoleToMenuPermissionExport":
		RoleToMenuPermissionExport();
		break;




	default:
		echo "{failure:true}";
		break;
}


function UserExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;


	$sql = "SELECT a.`UserName`, a.Address,h.OfficeName,e.DepartmentName, b.DesignationName,i.UserZoneName,
	f.GenderName,a.PhoneNo,d.RoleName, a.NID, a.LoginName, a.`Email`,a.UserCode,
	CASE WHEN a.IsActive=1 THEN 'Yes' ELSE 'No' END IsActiveName
	FROM `t_users` a
	INNER JOIN `t_designation` b ON a.`DesignationId` = b.`DesignationId`
	INNER JOIN `t_user_role_map` c ON a.`UserId` = c.`UserId`
	INNER JOIN `t_roles` d ON c.`RoleId` = d.`RoleId`
	INNER JOIN `t_department` e ON a.`DepartmentId` = e.`DepartmentId`
	INNER JOIN `t_gender` f ON a.`GenderId` = f.`GenderId`
	INNER JOIN `t_office` h ON a.`OfficeId` = h.`OfficeId`
	INNER JOIN `t_user_zone` i ON a.`UserZoneId` = i.`UserZoneId`
	ORDER BY a.`UserName` ASC;";





	$tableProperties["query_field"] = array("UserName", "Address", "OfficeName", "DepartmentName", "DesignationName", "UserZoneName", "GenderName", "PhoneNo", "RoleName", "NID", "LoginName", "Email", "UserCode", "IsActiveName");
	$tableProperties["table_header"] = array('Full Name', 'Address', 'Office', 'Department', 'Designation', 'User Zone', 'Gender', "Phone", "Role", "NID", "Login Name", 'Email', 'Employee Id', 'Status');
	$tableProperties["align"] = array("left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left");
	$tableProperties["width_print_pdf"] = array("15%", "30%",  "20%", "20%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("15", "30", "20", "20", "20", "20", "15", "15",  "15", "15", "15", "18", "15", "10");
	$tableProperties["precision"] = array("string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
	// exit;
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'User Information';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'User_Information';
}

function TeamExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `TeamName`
	FROM t_team 
	ORDER BY `TeamName`;";

	$tableProperties["query_field"] = array("TeamName");
	$tableProperties["table_header"] = array('Team Name');
	$tableProperties["align"] = array("left");
	$tableProperties["width_print_pdf"] = array("100%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("80");
	$tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0); //not total=0, total=1
	$tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Team';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Team';
}


function ProgramExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;


	$sql = "SELECT `ProgramName`,TATDayType,StandardTATDay,StrategiceTATDay,ProgramCategoryName
	FROM t_program 
	inner join t_tat_day_type on t_program.TATDayTypeId=t_tat_day_type.TATDayTypeId
	inner join t_programcategory on t_program.ProgramCategoryId=t_programcategory.ProgramCategoryId
	ORDER BY `ProgramName`;";

	$tableProperties["query_field"] = array("ProgramName", "TATDayType", "StandardTATDay", "StrategiceTATDay","ProgramCategoryName");
	$tableProperties["table_header"] = array('Program Name', 'TAT Day Type', 'Standard TAT Day', 'Strategice TAT Day','Category');
	$tableProperties["align"] = array("left", "left", "right", "right","left");
	$tableProperties["width_print_pdf"] = array("20%", "20%", "20%", "20%", "20%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("30", "20", "20", "20", "20");
	$tableProperties["precision"] = array("string", "string", 0, 0,"string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0, 0,0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0, 0, 0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Programs';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Programs';
}


function FactoryGroupsExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;


	$sql = "SELECT `FactoryGroupName`
	FROM t_factorygroup 
	ORDER BY `FactoryGroupName`;";

	$tableProperties["query_field"] = array("FactoryGroupName");
	$tableProperties["table_header"] = array('Factory Group Name');
	$tableProperties["align"] = array("left");
	$tableProperties["width_print_pdf"] = array("100%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("80");
	$tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0); //not total=0, total=1
	$tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Factory Groups';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'FactoryGroups';
}

function FactoryExport()
{
	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT a.FactoryName,a.FactoryCode, b.FactoryGroupName
		FROM t_factory a
		INNER JOIN t_factorygroup b on a.FactoryGroupId=b.FactoryGroupId
		ORDER BY a.`FactoryName` ASC;";


	$tableProperties["query_field"] = array("FactoryName", "FactoryCode", "FactoryGroupName");
	$tableProperties["table_header"] = array('Factory Name', 'Factory Code', 'Factory Group');
	$tableProperties["align"] = array("left", "left", "left");
	$tableProperties["width_print_pdf"] = array("15%", "15%", "15%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("25", "20", "20");
	$tableProperties["precision"] = array("string", "string", "string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Factory';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Factory';
}


function AuditStageExport()
{
	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT AuditStageName
		FROM t_auditstage
		ORDER BY AuditStageName ASC;";


	$tableProperties["query_field"] = array("AuditStageName");
	$tableProperties["table_header"] = array('Audit Stage Name');
	$tableProperties["align"] = array("left");
	$tableProperties["width_print_pdf"] = array("90%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("45");
	$tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0); //not total=0, total=1
	$tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Audit Stage';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'AuditStage';
}


function LeadStatusExport()
{
	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT LeadStatusName
		FROM t_leadstatus
		ORDER BY LeadStatusName ASC;";


	$tableProperties["query_field"] = array("LeadStatusName");
	$tableProperties["table_header"] = array('Lead Status Name');
	$tableProperties["align"] = array("left");
	$tableProperties["width_print_pdf"] = array("90%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("45");
	$tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0); //not total=0, total=1
	$tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Lead Status';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'LeadStatus';
}

function DesignationExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `DesignationName`
	FROM t_designation 
	ORDER BY `DesignationName`;";

	$tableProperties["query_field"] = array("DesignationName");
	$tableProperties["table_header"] = array('Designation');
	$tableProperties["align"] = array("left");
	$tableProperties["width_print_pdf"] = array("100%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("80");
	$tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0); //not total=0, total=1
	$tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Designation';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Designation';
}


function OfficeExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `OfficeName`
	FROM t_office 
	ORDER BY `OfficeName`;";

	$tableProperties["query_field"] = array("OfficeName");
	$tableProperties["table_header"] = array('Office Name');
	$tableProperties["align"] = array("left");
	$tableProperties["width_print_pdf"] = array("100%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("80");
	$tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0); //not total=0, total=1
	$tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Office List';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Office_List';
}

function ZoneExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `UserZoneName`
	FROM t_user_zone 
	ORDER BY `UserZoneName`;";

	$tableProperties["query_field"] = array("UserZoneName");
	$tableProperties["table_header"] = array('User Zone Name');
	$tableProperties["align"] = array("left");
	$tableProperties["width_print_pdf"] = array("100%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("80");
	$tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0); //not total=0, total=1
	$tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'User Zone List';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'UserZone_List';
}


function MemberExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `MemberCode`,MemberName,DepartmentName,PhoneNo,Email,Address
	FROM t_member 
	inner join t_department on t_department.DepartmentId=t_member.DepartmentId
	ORDER BY `MemberCode`;";

	$tableProperties["query_field"] = array("MemberCode", "MemberName", "DepartmentName", "PhoneNo", "Email", "Address");
	$tableProperties["table_header"] = array('Member Code', 'Member Name', 'Department', 'PhoneNo', 'Email', 'Address');
	$tableProperties["align"] = array("left", "left", "left", "left", "left", "left");
	$tableProperties["width_print_pdf"] = array("10%", "20%", "20%", "15%", "15%", "40%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("15", "25", "25", "15", "15", "30");
	$tableProperties["precision"] = array("string", "string",  "string", "string", "string", "string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0, 0, 0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0, 0, 0, 0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Employee';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Employee';
}


function BuyerExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT BuyerName, ClientType, Country, SunCode,EbitzCode, ItsCode, RegisterNo, CustomerCode
	FROM t_buyer 
	ORDER BY `BuyerName`;";

	$tableProperties["query_field"] = array('BuyerName', 'ClientType', 'Country', 'SunCode', 'EbitzCode', 'ItsCode', 'RegisterNo', 'CustomerCode');
	$tableProperties["table_header"] = array('Buyer Name', 'Client Type', 'Country', 'Sun Code', 'Ebitz Code', 'ITS Code', 'Register No', 'Customer Code');
	$tableProperties["align"] = array("left", "left", "left", "left", "left", "left", "left", "left");
	$tableProperties["width_print_pdf"] = array("10%", "10%", "10%", "10%", "10%", "10%", "10%",  "10%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("25", "15", "18", "15", "15", "15", "20", "20");
	$tableProperties["precision"] = array("string", "string", "string", "string", "string", "string", "string", "string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0, 0, 0, 0, 0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0, 0, 0, 0, 0, 0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Buyer';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Buyer';
}

function AuditorExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `AuditorCode`,AuditorName,Email,PhoneNo
	FROM t_auditor 
	ORDER BY `AuditorCode`;";

	$tableProperties["query_field"] = array("AuditorCode", "AuditorName",  "Email", "PhoneNo", "Address");
	$tableProperties["table_header"] = array('Emp Id', 'Name', 'Email', 'PhoneNo', 'Address');
	$tableProperties["align"] = array("left", "left", "left", "left", "left");
	$tableProperties["width_print_pdf"] = array("10%", "20%", "15%", "15%", "40%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("15", "25", "15", "15", "30");
	$tableProperties["precision"] = array("string", "string", "string", "string", "string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0, 0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0, 0, 0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Auditor';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Auditor';
}

function DepartmentExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `DepartmentName`
	FROM t_department 
	ORDER BY `DepartmentName`;";

	$tableProperties["query_field"] = array("DepartmentName");
	$tableProperties["table_header"] = array('Department');
	$tableProperties["align"] = array("left");
	$tableProperties["width_print_pdf"] = array("100%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("80");
	$tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0); //not total=0, total=1
	$tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Department';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Department';
}

function HoliDyExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `HoliDate`, Year(HoliDate) YearName, DATE_FORMAT(HoliDate, '%M') MonthName, DATE_FORMAT(HoliDate, '%W') DayName
	FROM t_holiday where DayType='holiday'
	ORDER BY `HoliDate` DESC;";

	$tableProperties["query_field"] = array("HoliDate","YearName","MonthName","DayName");
	$tableProperties["table_header"] = array('Weekend Date', 'Year', 'Month', 'Day');
	$tableProperties["align"] = array("left", "left", "left", "left");
	$tableProperties["width_print_pdf"] = array("30%","20%","20%","20%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("20", "15", "20", "20");
	$tableProperties["precision"] = array("string","string","string","string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0,0,0,0); //not total=0, total=1
	$tableProperties["color_code"] = array(0,0,0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Weekend List';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Weekend';
}

function LeaveExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT a.`HoliDate`, Year(a.HoliDate) YearName, DATE_FORMAT(a.HoliDate, '%M') MonthName, 
	DATE_FORMAT(a.HoliDate, '%W') DayName,b.AuditorName,b.PhoneNo,c.LeaveStatusName,a.Comments
	FROM t_holiday a 
	inner join t_auditor b on a.AuditorId=b.AuditorId
	inner join t_leavestatus c on a.LeaveStatusId=c.LeaveStatusId
	where DayType='leave'
	ORDER BY a.`HoliDate` DESC;";



	$tableProperties["query_field"] = array("HoliDate","YearName","MonthName","DayName","AuditorName","PhoneNo","LeaveStatusName","Comments");
	$tableProperties["table_header"] = array('Holidate', 'Year', 'Month', 'Day','Auditor','Phone','Status','Comments');
	$tableProperties["align"] = array("left", "left", "left", "left", "left", "left", "left", "left");
	$tableProperties["width_print_pdf"] = array("15%","10%","10%","10%","20%","10%","10%","25%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("20", "15", "20", "20", "20", "20", "20", "20");
	$tableProperties["precision"] = array("string","string","string","string","string","string","string","string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0,0,0,0,0,0,0,0); //not total=0, total=1
	$tableProperties["color_code"] = array(0,0,0,0,0,0,0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Leave/Office Work';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Leave_Office_Work';
}

function RevenueTypeExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `RevenueTypeName`,Rate
	FROM t_revenue_type 
	ORDER BY `RevenueTypeName`;";

	$tableProperties["query_field"] = array("RevenueTypeName", "Rate");
	$tableProperties["table_header"] = array('Revenue Type', 'Rate');
	$tableProperties["align"] = array("left", "right");
	$tableProperties["width_print_pdf"] = array("60%", "40%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("30", "25");
	$tableProperties["precision"] = array("string", 2); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Revenue Type';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'RevenueType';
}


function BusinessLinetExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT `BusinessLineName`
	FROM t_businessline 
	ORDER BY `BusinessLineName`;";

	$tableProperties["query_field"] = array("BusinessLineName");
	$tableProperties["table_header"] = array('Business Line');
	$tableProperties["align"] = array("left");
	$tableProperties["width_print_pdf"] = array("100%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("80");
	$tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0); //not total=0, total=1
	$tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Business Line';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'BusinessLine';
}


function SalesPersonInputExport()
{
	global $sql, $tableProperties, $TEXT, $siteTitle;
	$UserId = $_REQUEST['UserId'];
	$RoleId = $_REQUEST['RoleId'];
	if($RoleId == 1){
		$UserId = 0;
	}

	$sql = "SELECT b.ActivityName,c.FactoryName,d.FactoryGroupName,c.Address as FactoryAddress,
		e.ProgramName,a.ExpireDate,a.OpportunityDate,a.TentativeOfferPrice,
		a.CertificateBody,f.UserName as CoordinatorName, g.AuditStageName,
		h.LeadStatusName,a.ManDay,i.BuyerName,a.NextFollowupDate,
		j.DepartmentName,k.MemberName,a.Remarks

	   FROM `t_transaction` a
	   INNER JOIN `t_activity` b ON a.`ActivityId` = b.`ActivityId`
	   LEFT JOIN `t_factory` c ON a.`FactoryId` = c.`FactoryId`
	   LEFT JOIN `t_factorygroup` d ON c.`FactoryGroupId` = d.`FactoryGroupId`
	   LEFT JOIN `t_program` e ON a.`ProgramId` = e.`ProgramId`
	   LEFT JOIN `t_users` f ON a.`CoordinatorId` = f.`UserId`
	   LEFT JOIN `t_auditstage` g ON a.`AuditStageId` = g.`AuditStageId`
	   LEFT JOIN `t_leadstatus` h ON a.`LeadStatusId` = h.`LeadStatusId`
	   LEFT JOIN `t_buyer` i ON a.`BuyerId` = i.`BuyerId`
	   LEFT JOIN `t_department` j ON a.`DepartmentId` = j.`DepartmentId`
	   LEFT JOIN `t_member` k ON a.`MemberId` = k.`MemberId`
	   LEFT JOIN `t_country` l ON a.`CountryId` = l.`CountryId`
	   LEFT JOIN `t_auditor` m ON a.`LeadAuditorId` = m.`AuditorId`
	   LEFT JOIN `t_auditor` n ON a.`TeamAuditorId` = n.`AuditorId`
	   LEFT JOIN `t_audittype` o ON a.`AuditTypeId` = o.`AuditTypeId`
	   LEFT JOIN `t_users` p ON a.`ReportWriterId` = p.`UserId`
	   Where (a.UserId = $UserId OR $UserId=0)
	   ORDER BY a.`TransactionDate` DESC, a.InvoiceNo ASC;";


	$tableProperties["query_field"] = array("ActivityName", "FactoryName", "FactoryGroupName", "FactoryAddress", "ProgramName", "ExpireDate", "OpportunityDate", "TentativeOfferPrice", "CertificateBody", "CoordinatorName", "AuditStageName", "LeadStatusName", "ManDay", "BuyerName", "NextFollowupDate", "DepartmentName", "MemberName", "Remarks");
	$tableProperties["table_header"] = array("Activity", "Factory", "Factory Group", "Factory Location", "Program", "Expire Date", "Opportunity Date", "Tentative Offer Price", "Certificate Body", "Coordinator", "Audit Stage", "Lead Status", "Man Day", "Buyer", "Next Followup Date", "Department", "Member", "Remarks/Note");
	$tableProperties["align"] = array("left", "left", "left", "left", "left", "left", "left", "right", "left", "left", "left", "left", "right", "left", "left", "left", "left", "left");
	$tableProperties["width_print_pdf"] = array("10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "5%", "5%", "5%", "5%", "5%", "5%", "5%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("25", "22", "20", "20", "15", "15", "15", "15", "15", "16", "20", "20", "12", "20", "20", "20", "20", "25");
	$tableProperties["precision"] = array("string", "string", "string", "string", "string", "string", "string", 0, "string", "string", "string", "string", 0, "string", "string", "string", "string", "string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array( 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Sales Person Input';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Sales_Person_Input';
}



function CoordinatorInputExport()
{
	global $sql, $tableProperties, $TEXT, $siteTitle;

	$UserId = $_REQUEST['UserId'];
	$RoleId = $_REQUEST['RoleId'];
	if($RoleId == 1){
		$UserId = 0;
	}


	$StartDate = $_REQUEST['StartDate'];
	$EndDate = $_REQUEST['EndDate'];

	$sql = "SELECT b.ActivityName,c.FactoryName,d.FactoryGroupName,c.Address as FactoryAddress,
		e.ProgramName,a.ExpireDate,a.OpportunityDate,a.TentativeOfferPrice,
		a.CertificateBody,f.UserName as CoordinatorName, g.AuditStageName,
		h.LeadStatusName,a.ManDay,i.BuyerName,a.NextFollowupDate,
		j.DepartmentName,k.MemberName,a.Remarks
		
		,a.AssessmentNo, a.AuditStartDate, a.AuditEndDate, l.CountryName, m.AuditorName as LeadAuditor, 
		 o.AuditTypeName, a.Window,a.WindowEnd, a.PaymentStatus, p.AuditorName as ReportWriter, a.NoOfEmployee, a.AuditFee, 
		a.OPE,a.OthersAmount,  a.RevenueBDT,a.PINo, a.IsSendMail
	   FROM `t_transaction` a
	   INNER JOIN `t_activity` b ON a.`ActivityId` = b.`ActivityId`
	   LEFT JOIN `t_factory` c ON a.`FactoryId` = c.`FactoryId`
	   LEFT JOIN `t_factorygroup` d ON c.`FactoryGroupId` = d.`FactoryGroupId`
	   LEFT JOIN `t_program` e ON a.`ProgramId` = e.`ProgramId`
	   LEFT JOIN `t_users` f ON a.`CoordinatorId` = f.`UserId`
	   LEFT JOIN `t_auditstage` g ON a.`AuditStageId` = g.`AuditStageId`
	   LEFT JOIN `t_leadstatus` h ON a.`LeadStatusId` = h.`LeadStatusId`
	   LEFT JOIN `t_buyer` i ON a.`BuyerId` = i.`BuyerId`
	   LEFT JOIN `t_department` j ON a.`DepartmentId` = j.`DepartmentId`
	   LEFT JOIN `t_member` k ON a.`MemberId` = k.`MemberId`
	   LEFT JOIN `t_country` l ON a.`CountryId` = l.`CountryId`
	   LEFT JOIN `t_auditor` m ON a.`LeadAuditorId` = m.`AuditorId`
	   LEFT JOIN `t_audittype` o ON a.`AuditTypeId` = o.`AuditTypeId`
	   LEFT JOIN `t_auditor` p ON a.`ReportWriterId` = p.`AuditorId`
	   where ((a.AuditStartDate between '$StartDate' and '$EndDate') OR (a.AuditStartDate is null))
	   AND a.StatusId = 5
	   AND (a.CoordinatorId = $UserId OR $UserId=0)
	   ORDER BY a.`TransactionDate` DESC, a.InvoiceNo ASC;";

	$tableProperties["query_field"] = array("ActivityName", "FactoryName", "FactoryGroupName", "FactoryAddress", "ProgramName", "ExpireDate", "OpportunityDate", "TentativeOfferPrice", "CertificateBody", "CoordinatorName", "AuditStageName", "LeadStatusName", "ManDay", "BuyerName", "NextFollowupDate", "DepartmentName", "MemberName", "Remarks","AssessmentNo","AuditStartDate","AuditEndDate","CountryName","LeadAuditor","AuditTypeName","Window","WindowEnd","PaymentStatus","ReportWriter","NoOfEmployee","AuditFee","OPE","OthersAmount","RevenueBDT","PINo","IsSendMail");
	$tableProperties["table_header"] = array("Activity", "Factory", "Factory Group", "Factory Location", "Program", "Expire Date", "Opportunity Date", "Tentative Offer Price", "Certificate Body", "Coordinator", "Audit Stage", "Lead Status", "Man Day", "Buyer", "Next Followup Date", "Department", "Member", "Remarks/Note","Assessment No","Audit Start Date","Audit End Date","Country","Lead Auditor","Audit Type","Window Start","Window End","Payment Status","Report Writer","No Of Employee","Audit Fee","OPE","Others Amount","Revenue BDT","PI No","Is Send Mail");
	$tableProperties["align"] = array("left", "left", "left", "left", "left", "left", "left", "right", "left", "left", "left", "left", "right", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left","left", "right", "right", "right", "right","left",  "left");
	$tableProperties["width_print_pdf"] = array("10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%",  "5%", "5%", "5%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("25", "22", "20", "20", "15", "15", "15", "15", "15", "16", "20", "20", "12", "20", "20", "20", "20", "25","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15");
	$tableProperties["precision"] = array("string", "string", "string", "string", "string", "string", "string", 0, "string", "string", "string", "string", 0, "string", "string", "string", "string", "string", "string", "string", "string","string", "string", "string", "string", "string", "string", "string","string", 1, 1,1, 1, "string","string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Coordinator Input';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Coordinator_Input';
}


function InvoiceExport()
{
	global $sql, $tableProperties, $TEXT, $siteTitle;
	// $UserId = $_REQUEST['UserId'];
	// $Search = $_REQUEST['Search'];

	$sql = "SELECT b.ActivityName,c.FactoryName,d.FactoryGroupName,c.Address as FactoryAddress,
		e.ProgramName,a.ExpireDate,a.OpportunityDate,a.TentativeOfferPrice,
		a.CertificateBody,f.UserName as CoordinatorName, g.AuditStageName,
		h.LeadStatusName,a.ManDay,i.BuyerName,a.NextFollowupDate,
		j.DepartmentName,k.MemberName,a.Remarks
		
		,a.AssessmentNo, a.AuditStartDate, a.AuditEndDate, l.CountryName, m.AuditorName as LeadAuditor, 
		n.AuditorName as TeamAuditor, o.AuditTypeName, 
		a.Window,a.WindowEnd, a.PaymentStatus, p.UserName as ReportWriter, a.NoOfEmployee, a.AuditFee, a.OPE,a.OthersAmount, a.RevenueBDT,a.PINo, 
		 a.IsSendMail,a.InvoiceTo, a.NameofApplicant, a.InvoiceAddress, a.InvoiceEmail, a.InvoiceMobile, a.Discount
	   FROM `t_transaction` a
	   INNER JOIN `t_activity` b ON a.`ActivityId` = b.`ActivityId`
	   LEFT JOIN `t_factory` c ON a.`FactoryId` = c.`FactoryId`
	   LEFT JOIN `t_factorygroup` d ON c.`FactoryGroupId` = d.`FactoryGroupId`
	   LEFT JOIN `t_program` e ON a.`ProgramId` = e.`ProgramId`
	   LEFT JOIN `t_users` f ON a.`CoordinatorId` = f.`UserId`
	   LEFT JOIN `t_auditstage` g ON a.`AuditStageId` = g.`AuditStageId`
	   LEFT JOIN `t_leadstatus` h ON a.`LeadStatusId` = h.`LeadStatusId`
	   LEFT JOIN `t_buyer` i ON a.`BuyerId` = i.`BuyerId`
	   LEFT JOIN `t_department` j ON a.`DepartmentId` = j.`DepartmentId`
	   LEFT JOIN `t_member` k ON a.`MemberId` = k.`MemberId`
	   LEFT JOIN `t_country` l ON a.`CountryId` = l.`CountryId`
	   LEFT JOIN `t_auditor` m ON a.`LeadAuditorId` = m.`AuditorId`
	   LEFT JOIN `t_auditor` n ON a.`TeamAuditorId` = n.`AuditorId`
	   LEFT JOIN `t_audittype` o ON a.`AuditTypeId` = o.`AuditTypeId`
	   LEFT JOIN `t_users` p ON a.`ReportWriterId` = p.`UserId`
	   WHERE a.StatusId = 5
	   ORDER BY a.`TransactionDate` DESC, a.InvoiceNo ASC;";


	$tableProperties["query_field"] = array("ActivityName", "FactoryName", "FactoryGroupName", "FactoryAddress", "ProgramName", "ExpireDate", "OpportunityDate", "TentativeOfferPrice", "CertificateBody", "CoordinatorName", "AuditStageName", "LeadStatusName", "ManDay", "BuyerName", "NextFollowupDate", "DepartmentName", "MemberName", "Remarks","AssessmentNo","AuditStartDate","AuditEndDate","CountryName","LeadAuditor","TeamAuditor","AuditTypeName","Window","WindowEnd","PaymentStatus","ReportWriter","NoOfEmployee","AuditFee","OPE","OthersAmount","RevenueBDT","PINo","IsSendMail","InvoiceTo","NameofApplicant","InvoiceAddress","InvoiceEmail","InvoiceMobile","Discount");
	$tableProperties["table_header"] = array("Activity", "Factory", "Factory Group", "Factory Location", "Program", "Expire Date", "Opportunity Date", "Tentative Offer Price", "Certificate Body", "Coordinator", "Audit Stage", "Lead Status", "Man Day", "Buyer", "Next Followup Date", "Department", "Member", "Remarks/Note","Assessment No","Audit Start Date","Audit End Date","Country","Lead Auditor","Team Auditor","Audit Type","Window Start","Window End","Payment Status","Report Writer","No Of Employee","Audit Fee","OPE","Others Amount","Revenue BDT","PI No","Is Send Mail","Invoice To","Name of Applicant","Address","Email","Mobile","Discount");
	$tableProperties["align"] = array("left", "left", "left", "left", "left", "left", "left", "right", "left", "left", "left", "left", "right", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "right",  "left", "left", "left", "left", "left", "left", "right");
	$tableProperties["width_print_pdf"] = array("10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("25", "22", "20", "20", "15", "15", "15", "15", "15", "16", "20", "20", "12", "20", "20", "20", "20", "25","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15");
	$tableProperties["precision"] = array("string", "string", "string", "string", "string", "string", "string", 0, "string", "string", "string", "string", 0, "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string",  "string",1,1, 1, 1, "string", "string", "string", "string", "string", "string", "string", 2); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Invoice';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Invoice_Input';
}



function ReportReviewerExport()
{
	global $sql, $tableProperties, $TEXT, $siteTitle;

	$UserId = $_REQUEST['UserId'];
	$RoleId = $_REQUEST['RoleId'];
	if($RoleId == 1){
		$UserId = 0;
	}

	// $UserId = $_REQUEST['UserId'];
	// $Search = $_REQUEST['Search'];
	$currDate = date('Y-m-d');


	$sql = "SELECT b.ActivityName,c.FactoryName,d.FactoryGroupName,c.Address as FactoryAddress,
		e.ProgramName,a.ExpireDate,a.OpportunityDate,a.TentativeOfferPrice,
		a.CertificateBody,f.UserName as CoordinatorName, g.AuditStageName,
		h.LeadStatusName,a.ManDay,i.BuyerName,a.NextFollowupDate,
		j.DepartmentName,k.MemberName,a.Remarks
		
		,a.AssessmentNo, a.AuditStartDate, a.AuditEndDate, l.CountryName, m.AuditorName as LeadAuditor, 
		n.AuditorName as TeamAuditor, o.AuditTypeName, 
		a.Window,a.WindowEnd, a.PaymentStatus, p.UserName as ReportWriter, a.NoOfEmployee, a.AuditFee, a.OPE,a.OthersAmount, a.PINo, a.RevenueBDT, 
		 a.IsSendMail,a.InvoiceTo, a.NameofApplicant, a.InvoiceAddress, a.InvoiceEmail, a.InvoiceMobile, a.Discount
		 ,a.IsReportReceivedFromWriter,a.ReportReceivedDate,q.UserName as LocalReviewer,a.StandardTAT,a.StrategicTAT, a.ReportReleaseStatus,
		 r.ReportReleasedStatus,a.OverseasSendingDate,a.AuditorLogInTime,a.AduditorLogOutTime,a.ReportResult
	   FROM `t_transaction` a
	   INNER JOIN `t_activity` b ON a.`ActivityId` = b.`ActivityId`
	   LEFT JOIN `t_factory` c ON a.`FactoryId` = c.`FactoryId`
	   LEFT JOIN `t_factorygroup` d ON c.`FactoryGroupId` = d.`FactoryGroupId`
	   LEFT JOIN `t_program` e ON a.`ProgramId` = e.`ProgramId`
	   LEFT JOIN `t_users` f ON a.`CoordinatorId` = f.`UserId`
	   LEFT JOIN `t_auditstage` g ON a.`AuditStageId` = g.`AuditStageId`
	   LEFT JOIN `t_leadstatus` h ON a.`LeadStatusId` = h.`LeadStatusId`
	   LEFT JOIN `t_buyer` i ON a.`BuyerId` = i.`BuyerId`
	   LEFT JOIN `t_department` j ON a.`DepartmentId` = j.`DepartmentId`
	   LEFT JOIN `t_member` k ON a.`MemberId` = k.`MemberId`
	   LEFT JOIN `t_country` l ON a.`CountryId` = l.`CountryId`
	   LEFT JOIN `t_auditor` m ON a.`LeadAuditorId` = m.`AuditorId`
	   LEFT JOIN `t_auditor` n ON a.`TeamAuditorId` = n.`AuditorId`
	   LEFT JOIN `t_audittype` o ON a.`AuditTypeId` = o.`AuditTypeId`
	   LEFT JOIN `t_users` p ON a.`ReportWriterId` = p.`UserId`
	   LEFT JOIN `t_users` q ON a.`LocalReviewerId` = q.`UserId`
	   LEFT JOIN `t_releasedstatus` r ON a.`ReportReleasedStatusId` = r.`ReportReleasedStatusId`
	   where a.StatusId = 5
	   AND a.AuditEndDate<'$currDate'
	   ORDER BY a.`ReportReleaseStatus` ASC, a.AuditEndDate DESC;";
 

	$tableProperties["query_field"] = array("ActivityName", "FactoryName", "FactoryGroupName", "FactoryAddress", "ProgramName", "ExpireDate", "OpportunityDate", "TentativeOfferPrice", "CertificateBody", "CoordinatorName", "AuditStageName", "LeadStatusName", "ManDay", "BuyerName", "NextFollowupDate", "DepartmentName", "MemberName", "Remarks","AssessmentNo","AuditStartDate","AuditEndDate","CountryName","LeadAuditor","TeamAuditor","AuditTypeName","Window","WindowEnd","PaymentStatus","ReportWriter","NoOfEmployee","AuditFee","OPE","OthersAmount","RevenueBDT","PINo","IsSendMail","InvoiceTo","NameofApplicant","InvoiceAddress","InvoiceEmail","InvoiceMobile","Discount","IsReportReceivedFromWriter","ReportReceivedDate","LocalReviewer","StandardTAT","StrategicTAT","ReportReleaseStatus","ReportReleasedStatus","OverseasSendingDate","AuditorLogInTime","AduditorLogOutTime","ReportResult");
	$tableProperties["table_header"] = array("Activity", "Factory", "Factory Group", "Factory Location", "Program", "Expire Date", "Opportunity Date", "Tentative Offer Price", "Certificate Body", "Coordinator", "Audit Stage", "Lead Status", "Man Day", "Buyer", "Next Followup Date", "Department", "Member", "Remarks/Note","Assessment No","Audit Start Date","Audit End Date","Country","Lead Auditor","Team Auditor","Audit Type","Window Start","Window End","Payment Status","Report Writer","No Of Employee","Audit Fee","OPE","Others Amount","Revenue BDT","PI No","Is Send Mail","Invoice To","Name of Applicant","Address","Email","Mobile","Discount","IsReport Received From Writer","Report Received Date","Local Reviewer","Standard TAT","Strategic TAT","Report Release Status","Report Released Status","Overseas Sending Date","Auditor Log In Time","Aduditor Log Out Time","Report Result");
	$tableProperties["align"] = array("left", "left", "left", "left", "left", "left", "left", "right", "left", "left", "left", "left", "right", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "right", "left", "left", "left", "left", "left", "left", "left", "right", "right","left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left");
	$tableProperties["width_print_pdf"] = array("10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "10%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%", "5%","5%","5%","5%", "5%", "5%", "5%", "5%", "5%", "5%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("25", "22", "20", "20", "15", "15", "15", "15", "15", "16", "20", "20", "12", "20", "20", "20", "20", "25","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15","15");
	$tableProperties["precision"] = array("string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string","string", "string", "string", "string", "string","string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string", "string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Report Reviewer';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Report_Reviewer';
}





















function RoleExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$sql = "SELECT a.`RoleName`,a.DefaultRedirect
	FROM t_roles a
	ORDER BY a.RoleName;";

	$tableProperties["query_field"] = array("RoleName", "DefaultRedirect");
	$tableProperties["table_header"] = array('Role Name', 'Default Redirect');
	$tableProperties["align"] = array("left", "left");
	$tableProperties["width_print_pdf"] = array("30%", "70%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("30", "40");
	$tableProperties["precision"] = array("string", "string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1

	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Role Information';
	// $tableProperties["header_list"][1] = 'Heading 2';

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Role_Information';
}




function RoleToMenuPermissionExport()
{

	global $sql, $tableProperties, $TEXT, $siteTitle;


	$RoleId = $_REQUEST['RoleId'];
	$RoleName = $_REQUEST['RoleName'];


	$sql = "SELECT case WHEN b.PermissionType = 1 THEN 'View' ELSE 'Edit' END PermissionType,
	IF(MenuLevel='menu_level_2',CONCAT(' -', a.MenuTitle),
		IF(MenuLevel='menu_level_3',CONCAT(' --', a.MenuTitle),a.MenuTitle)) menuname,MenuType

			   FROM `t_menu` a
			   LEFT JOIN t_role_menu_map b ON b.`MenuId` = a.`MenuId` 
			
				and b.RoleId = $RoleId
		ORDER BY MenuType DESC, SortOrder ASC;";

	$tableProperties["query_field"] = array("PermissionType", "menuname", "MenuType");
	$tableProperties["table_header"] = array('Access', 'Menu Name', 'Menu For');
	$tableProperties["align"] = array("left", "left");
	$tableProperties["width_print_pdf"] = array("20%", "50%", "20%"); //when exist serial then here total 95% and 5% use for serial
	$tableProperties["width_excel"] = array("20", "50", "20");
	$tableProperties["precision"] = array("string", "string", "string"); //string,date,datetime,0,1,2,3,4
	$tableProperties["total"] = array(0, 0, 0); //not total=0, total=1
	$tableProperties["color_code"] = array(0, 0, 0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
	$tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
	// exit;
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Role To Menu Permission Information';
	$tableProperties["header_list"][2] = $RoleName;

	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Role_To_Menu_Permission_Information';
}




//==================================================================================
//=================Dynamic Export Print, Excel, Pdf, CSV============================
//==================================================================================


$db = new Db();

//Execute sql command
$result = $db->query($sql);



$serial = 0;
$useSl = 1;
$columnTotalList = array();
$reportHeaderList = $tableProperties["header_list"];

$reportType = $_REQUEST['reportType'];
$reportSaveName = str_replace(' ', '_', $tableProperties["report_save_name"]);


//Table Header Start
if ($reportType == 'print' || $reportType == 'pdf') {

	echo '<!DOCTYPE html>
		<html>
			 <head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />	
				<meta http-equiv="content-type" content="text/html; charset=utf-8" />
				<link href="css/bootstrap.min.css" rel="stylesheet"/>
				<link href="css/font-awesome.min.css" rel="stylesheet"/>
				<link href="css/custom.css" rel="stylesheet"/>
				<link href="css/base.css" rel="stylesheet"/>
				<link href="css/exportstyle.css" rel="stylesheet"/>
			<style>
				body {
					color:#727272;
				}
				table.display tr.even.row_selected td {
    				background-color: #4DD4FD;
			    }    
			    table.display tr.odd.row_selected td {
			    	background-color: #4DD4FD;
			    }
			    .SL{
			        text-align: center !important;
			    }
				.right-aln{
					text-align: right !important;
				}
				.left-aln{
					text-align: left !important;
				}
				.center-aln {
					text-align: center !important;
				}
			    td.Countries{cursor: pointer;}
			    th, td {
					border: 1px solid #e4e4e4 !important;
				}
				.margin-bottom {
					margin-bottom: 40px;
				}


				.BottomDiv{
					width:30%;
					text-align:center;
					display: block;
				}
				.content_area {
						text-align: center;
						font-size: 14px;
						font-weight: bold;
					}
	
					.margin_top{
						margin-top: 10px;
					}
					.margin_button{
						margin-bottom:120px;
					}
					.footer_Padding{
						border: 1px solid #ccc;
						min-height: 130px;
						padding-top: 10px;
					}
					.marginTop0{
						margin-top: 0px;
					}
			</style>
			</head>
			<body><div class="container-fluid margin-bottom">
			<div class="row"> 
			<div class="col-md-12">
          	<div class="table-responsive">
           	<div class="panel-heading" style="text-align:center;">';

	$reportHeaderListCount = count($reportHeaderList);

	//Report Header
	for ($i = 0; $i < $reportHeaderListCount; $i++) {
		if ($i == 0) {
			if ($tableProperties["header_logo"] == 1) {
				echo '<div class="row margin_top">

						<div class="col-md-4 col-sm-4 col-lg-4">
							<div class="content-body" style="text-align:left;">
							<img src="images/logo.png" alt="National health family logo" style="width: 90px;height: auto;">
							</div>
						</div>

						<div class="col-md-4 col-sm-4 col-lg-4">
							<div class="content-body_text">
								<div class="content_area">
								
									<h4>' . $reportHeaderList[$i] . '</h4>
									
								</div>
							</div>
						</div>

						<div class="col-md-4 col-sm-4 col-lg-4">
							<div class="content-body">
							<img src="images/benin_logo.png" alt="National health family logo" style="float: right;width: 65px;height: auto;">
							</div>
						</div>
					</div>';
			} else {
				echo '<div class="row margin_top">

						<div class="col-md-12 col-sm-12 col-lg-12">
							<div class="content-body_text">
								<div class="content_area">
								
									<h4>' . $reportHeaderList[$i] . '</h4>
									
								</div>
							</div>
						</div>

					</div>';
			}
		}


		//echo '<h2>'.$reportHeaderList[$i].'</h2>';
		else if ($i == 1)
			echo '<h5 class="marginTop0">' . $reportHeaderList[$i] . '</h5>';
		else
			echo '<h5>' . $reportHeaderList[$i] . '</h5>';
	}

	echo '</div>';


	$fontsize = "";
	if ($reportType == 'pdf') {
		$fontsize = "font-size:10px;";
	}
	echo '<table class="table table-striped table-bordered display" cellspacing="0" cellpadding="5" width="100%" border="0.5" style="margin:0 auto; ' . $fontsize . '">    	
				<tbody><tr>';

	if ($useSl > 0) {
		echo '<th style="width:5%; text-align:center;"><strong>SL.</strong></th>';
	}

	foreach ($tableProperties["table_header"] as $index => $header) {
		echo '<th style="width:' . $tableProperties["width_print_pdf"][$index] . '; text-align:' . $tableProperties["align"][$index] . ';"><strong>' . $header . '</strong></th>';
	}
	echo '</tr>';
} else if ($reportType == 'excel') {

	//include xlsxwriter
	set_include_path(get_include_path() . PATH_SEPARATOR);
	include_once("xlsxwriter/xlsxwriter.class.php");

	///////////for logo left and right header 29/03/2023
	require_once("xlsxwriter/xlsxwriterplus.class.php");
	///////////for logo left and right header 29/03/2023


	$sheetName = "Data";
	$rowStyle = array('border' => 'left,right,top,bottom', 'border-style' => 'thin');

	///////////for logo left and right header 29/03/2023. off first line and add 2nd line
	// $writer = new XLSXWriter();
	$writer = new XLSWriterPlus();
	///////////for logo left and right header 29/03/2023

	$tableHeaderList = array();

	if ($useSl > 0) {
		$tableHeaderList["SL."] = '0';
		array_unshift($tableProperties["width_excel"], 8);
	}

	foreach ($tableProperties["table_header"] as $index => $header) {

		$header = remove_html_tag($header);

		if (is_numeric($tableProperties["precision"][$index])) {
			// $tableHeaderList[$fieldLabelList[getActualFieldName($val)]] = '0.0';
			$precision = $tableProperties["precision"][$index];
			$format = "#,##0";
			if ($precision > 0) {
				$decimalPoint = ".";
				$decimalPoint = str_pad($decimalPoint, ($precision + 1), "0", STR_PAD_RIGHT);
				$format = "#,##0" . $decimalPoint;
			}
			// $tableHeaderList[$fieldLabelList[getActualFieldName($val)]] = '#,##0.0';
			$tableHeaderList[$header] = $format;
		} else {
			$tableHeaderList[$header] = '@';
		}
	}

	//For multiline report title 13/11/2022
	$reporttitle = $reportHeaderList[0];
	$reporttitlelist = explode('<br/>', $reporttitle);
	if (count($reporttitlelist) > 1) {
		$reportHeaderList[0] = $reporttitlelist[count($reporttitlelist) - 1];
		for ($h = (count($reporttitlelist) - 2); $h >= 0; $h--) {
			array_unshift($reportHeaderList, $reporttitlelist[$h]);
		}
	}
	//For multiline report title 13/11/2022


	////////last column width max 8 because of logo width 29/03/2023
	if ($tableProperties["header_logo"] == 1) {
		$lastcolw = $tableProperties["width_excel"][count($tableProperties["width_excel"]) - 1];
		if ($lastcolw > 8) {
			$tableProperties["width_excel"][count($tableProperties["width_excel"]) - 1] = 10;
		}
	}
	////////last column width max 8 because of logo width 29/03/2023


	$writer->writeSheetHeader(
		$sheetName,
		$tableHeaderList,
		array(
			// 'widths'=>array(5,20,20,20,20,20,15,15,15,15,15,10,10),
			'widths' => $tableProperties["width_excel"],
			'font-style' => 'bold',
			'font-size' => 11,
			'fill' => '#b4c6e7',
			'border' => 'left,right,top,bottom',
			'border-style' => 'thin',
			'halign' => 'left',
			'fitToWidth' => '1',
			// 'report_headers'=>array('Health Comodity Mangement','Stock status data', 'Year: 2018, Month: January')
			'report_headers' => $reportHeaderList
		)
	);
	//Report Header and table header end
} else if ($reportType == 'csv') {

	$writer = WriterFactory::create(Type::CSV);
	$writer->openToFile("media/$reportSaveName.csv");

	//Report Header start
	foreach ($reportHeaderList as $val) {
		$writer->addRow([$val]);
	}
	//Report Header end
	//Table Header start
	$tableHeaderList = array();
	if ($useSl > 0) {
		$tableHeaderList[] = "SL.";
	}

	foreach ($tableProperties["table_header"] as $index => $header) {
		$tableHeaderList[] = $header;
	}
	$writer->addRow($tableHeaderList); //$writer->addRow(['A','B']);
	//Table Header end
}
//Table Header End
//Data list start
foreach ($result as $row) {
	if ($reportType == 'print' || $reportType == 'pdf') {
		echo '<tr>';

		if ($useSl > 0) {
			echo '<td style="width:5%; text-align:center;">' . ++$serial . '</td>';
		}

		foreach ($tableProperties["query_field"] as $index => $fieldName) {

			if ($tableProperties["color_code"][$index] == 1) {
				echo '<td style="width:' . $tableProperties["width_print_pdf"][$index] . '; background-color:' . $row[$fieldName] . ';"></td>';
			} else {
				echo '<td style="width:' . $tableProperties["width_print_pdf"][$index] . '; text-align:' . $tableProperties["align"][$index] . ';">' . getValueFormat($row[$fieldName], $tableProperties["precision"][$index], $reportType) . '</td>';
			}

			if ($tableProperties["total"][$index] == 1) {
				if (array_key_exists($index, $columnTotalList)) {
					$columnTotalList[$index] += $row[$fieldName];
				} else {
					$columnTotalList[$index] = $row[$fieldName];
				}
			} else {
				$columnTotalList[$index] = "";
			}
		}
		echo '</tr>';
	} else if ($reportType == 'excel') {

		$isColorCode = false;
		if (in_array(1, $tableProperties["color_code"])) {
			$isColorCode = true;
		}

		$rowStyleModify = array();
		$rowStyleModify = $rowStyle;

		$rowdata = array();
		if ($useSl > 0) {
			$rowdata[] = ++$serial;

			if ($isColorCode) {
				$rowStyleModify[] = ['fill' => ''];
			}
		}

		foreach ($tableProperties["query_field"] as $index => $fieldName) {

			if ($tableProperties["color_code"][$index] == 1) {
				$rowStyleModify[] = ['fill' => $row[$fieldName]];
				$rowdata[] = "";
			} else {
				if ($isColorCode) {
					$rowStyleModify[] = ['fill' => ''];
				}
				$rowdata[] = getValueFormat(remove_html_tag($row[$fieldName]), $tableProperties["precision"][$index], $reportType);
			}


			if ($tableProperties["total"][$index] == 1) {
				if (array_key_exists($index, $columnTotalList)) {
					$columnTotalList[$index] += $row[$fieldName];
				} else {
					$columnTotalList[$index] = $row[$fieldName];
				}
			} else {
				$columnTotalList[$index] = "";
			}
		}

		$writer->writeSheetRow($sheetName, $rowdata, $rowStyleModify);
	} else if ($reportType == 'csv') {
		$rowdata = array();
		if ($useSl > 0) {
			$rowdata[] = ++$serial;
		}

		foreach ($tableProperties["query_field"] as $index => $fieldName) {
			$rowdata[] = getValueFormat($row[$fieldName], $tableProperties["precision"][$index], $reportType);

			if ($tableProperties["total"][$index] == 1) {
				if (array_key_exists($index, $columnTotalList)) {
					$columnTotalList[$index] += $row[$fieldName];
				} else {
					$columnTotalList[$index] = $row[$fieldName];
				}
			} else {
				$columnTotalList[$index] = "";
			}
		}
		$writer->addRow($rowdata);
	}
}
//Data list end

if ($reportType == 'print' || $reportType == 'pdf') {

	if (in_array(1, $tableProperties["total"])) {
		echo '<tr>';

		if ($useSl > 0) {
			echo '<td></td>';
		}

		foreach ($columnTotalList as $index => $totalValue) {
			echo '<td style="width:' . $tableProperties["width_print_pdf"][$index] . '; text-align:' . $tableProperties["align"][$index] . ';">' . getValueFormat($totalValue, $tableProperties["precision"][$index], $reportType) . '</td>';
		}
		echo '</tr>';
	}

	echo '</tbody></table>';

	if ($tableProperties["footer_signatory"] == 1) {
		echo	'<div class="row margin_top">
						<div class="col-md-12 col-lg-12">
							<div class="footer_Padding">
						
								<div class="col-md-6 col-lg-6">
									<div class="footer_section">
										<p> ' . $TEXT["Nom et signature du gestionnaire"] . ' </p>
									</div>
								</div>	
								<div class="col-md-6 col-lg-6">
									<div class="footer_section text-right">
										<p> ' . $TEXT["Nom et signature du responsable du site de PEC"] . ' </p>
									</div>
								</div> 
							</div>
						</div>
					</div>';
	}


	echo '	</div>
				</div>   
				</div>  
			 </div>
		 </body></html>';
} else if ($reportType == 'excel') {

	if (in_array(1, $tableProperties["total"])) {
		$rowTotalStyle = array('font-style' => 'bold', 'border' => 'left,right,top,bottom', 'border-style' => 'thin');
		$rowdata = array();

		if ($useSl > 0) {
			$rowdata[] = "";
		}

		foreach ($columnTotalList as $index => $totalValue) {
			$rowdata[] = getValueFormat($totalValue, $tableProperties["precision"][$index], $reportType);
		}
		$writer->writeSheetRow($sheetName, $rowdata, $rowTotalStyle);
	}

	/* Report header merge */
	$end_col = count($tableProperties["query_field"]) - 1; //column count - 1
	if ($useSl > 0) {
		$end_col++;
	}

	foreach ($reportHeaderList as $start_row => $val) {
		$writer->markMergedCell($sheetName, $start_row, $start_col = 0, $end_row = $start_row, $end_col);
		// $writer->markMergedCell($sheetName, $start_row=0, $start_col=0, $end_row=0, $end_col=12);
		// $writer->markMergedCell($sheetName, $start_row=1, $start_col=0, $end_row=1, $end_col=12);
	}



	///////////for logo left and right header 29/03/2023
	if ($tableProperties["header_logo"] == 1) {
		$writer->addImage($sheetName, realpath('./images/logo.png'), 'logo.png', 1, [
			'startColNum' => 0,
			'endColNum' => 1,
			'startRowNum' => 0,
			'endRowNum' => 3,
		]);
		// $columnTotalCount = count($columnTotalList);
		$columnTotalCount = count($tableProperties["query_field"]);

		$writer->addImage($sheetName, realpath('./images/benin_logo.png'), 'benin_logo.png', 2, [
			'startColNum' => $columnTotalCount,
			'endColNum' => ($columnTotalCount + 1),
			'startRowNum' => 0,
			'endRowNum' => 3,
		]);
	}
	///////////for logo left and right header 29/03/2023



	/////////////////for footer signator//////////////////////// 29/03/2023/////////////////
	if ($tableProperties["footer_signatory"] == 1) {
		// $writer->writeSheetRow($sheetName, [], []);/// for a blank row

		// $rowdata = array();
		// $rowdata[] = 'Nom et signature du gestionnaire';
		// // $rowdata[3] = 'Nom et signature du responsable du site de PEC';

		// $rowTypeOverwrite = array();
		$middleColIdx = (int)(count($tableProperties["table_header"]) / 2);
		// for($f=0; $f<count($tableProperties["table_header"]); $f++){
		// 	$rowTypeOverwrite[] = 'string';

		// 	if($f == $middleColIdx){
		// 		$rowdata[] = 'Nom et signature du responsable du site de PEC';
		// 	}
		// 	else{
		// 		$rowdata[] = '';
		// 	}

		// }
		// $writer->setSheetColumnTypes($sheetName,['string','string','string','string','string']);
		// $writer->setSheetColumnTypes($sheetName,$rowTypeOverwrite);

		// $rowTotalStyle = array('font-style' => 'normal', 'border' => 'left,right,top,bottom', 'border-style' => 'thin','height'=>'80','valign'=>'top');
		// $writer->writeSheetRow($sheetName, $rowdata, $rowTotalStyle);

		// echo 'Rubel:';
		$footerrowposition = 0;
		if (in_array(1, $tableProperties["total"])) {
			//when total available
			$footerrowposition = count($reportHeaderList) + ($tableHearC = 1) + count($result) + ($tableTotalC = 1) + ($gaprowC = 1);
		} else {
			//when total not available
			$footerrowposition = count($reportHeaderList) + ($tableHearC = 1) + count($result) + ($gaprowC = 1);
		}


		// $rowTotalStyle = array('font-style' => 'normal', 'border' => 'left,right,top,bottom', 'border-style' => 'thin','height'=>'80','valign'=>'top','halign'=>'left');
		$rowTotalStyle = array('height' => '80', 'valign' => 'top', 'halign' => 'left');
		$writer->writeCellextra($sheetName, $footerrowposition, 0, $TEXT["Nom et signature du gestionnaire"], $rowTotalStyle);

		$rowTotalStyle = array('height' => '80', 'valign' => 'top', 'halign' => 'right');
		$writer->writeCellextra($sheetName, $footerrowposition, ($middleColIdx + 1), $TEXT["Nom et signature du responsable du site de PEC"], $rowTotalStyle);

		$writer->markMergedCell($sheetName, $footerrowposition, $start_col = 0, $end_row = $footerrowposition, ($middleColIdx));
		$writer->markMergedCell($sheetName, $footerrowposition, $start_col = ($middleColIdx + 1), $end_row = $footerrowposition, count($tableProperties["table_header"]));


		///////// $writer->writeCellextra($sheetName,75, 0, 'Rubel');
		///////// $writer->writeCellextra($sheetName,75, 5, 'Softworks');
	}



	/////////////////for footer signator//////////////////////// 29/03/2023/////////////////



	$exportTime = date("Y_m_d_H_i_s", time());
	$exportFilePath = $reportSaveName . '_' . $exportTime . ".xlsx";
	$writer->writeToFile("media/$exportFilePath");
	header('Location:media/' . $exportFilePath); //File open location	

} else if ($reportType == 'csv') {

	if (in_array(1, $tableProperties["total"])) {
		$rowdata = array();

		if ($useSl > 0) {
			$rowdata[] = "";
		}

		foreach ($columnTotalList as $index => $totalValue) {
			$rowdata[] = getValueFormat($totalValue, $tableProperties["precision"][$index], $reportType);
		}
		$writer->addRow($rowdata);
	}

	$writer->close();
	// header('Location:../media/' . $reportSaveName . ".csv"); //File open location

	$exportTime = date("Y_m_d_H_i_s", time());
	$exportFilePath = $reportSaveName . '_' . $exportTime . ".xlsx";
	$writer->writeToFile("media/$exportFilePath");
	header('Location:media/' . $exportFilePath); //File open location			
}


function getValueFormat($value, $precision, $reportType)
{
	$retVal = "";

	if ($precision === 'date') {
		if (validateDate($value, 'Y-m-d')) {
			$retVal = date('d-m-Y', strtotime($value));
		} else {
			$retVal = $value;
		}
	} else if ($precision === 'datetime') {
		if (validateDate($value, 'Y-m-d H:i:s')) {
			$retVal = date('d-m-Y', strtotime($value));
		} else {
			$retVal = $value;
		}
	} else if ($precision === 'string') {
		$retVal = $value;
	} else if (is_numeric($precision)) {
		if ($value == "") {
			$retVal = "";
		} else {
			// $retVal = getNumberFormat($value, $precision);
			$retVal = number_format($value, $precision);
			//when Excel then no need to COMA it is will auto format
			if ($reportType === 'excel') {
				$retVal = str_replace(",", "", $retVal);
			}
		}
	} else {
		$retVal = $value;
	}

	return $retVal;
}

function validateDate($date, $format = 'Y-m-d H:i:s')
{
	$d = DateTime::createFromFormat($format, $date);
	return $d && $d->format($format) == $date;
}

function remove_html_tag($text)
{
	if ($text == "") {
		return "";
	} else {
		$text = str_replace('<', ' < ', $text);
		return trim(strip_tags($text));
	}
}
