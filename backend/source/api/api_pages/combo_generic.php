<?php
include("global.php");

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {
	case "RoleList":
		$returnData = RoleList($data);
		break;
	case "UserList":
		$returnData = UserList($data);
		break;
	case "getCoordinatorList":
		$returnData = getCoordinatorList($data);
		break;
	case "getReportReviewerList":
		$returnData = getReportReviewerList($data);
		break;
	case "CheckList":
		$returnData = CheckList($data);
		break;
	case "FactoryGroupList":
		$returnData = FactoryGroupList($data);
		break;
	case "ProgramList":
		$returnData = ProgramList($data);
		break;
	case "TATDayTypeList":
		$returnData = TATDayTypeList($data);
		break;
	case "ProgramCategoryList":
		$returnData = ProgramCategoryList($data);
		break;
	case "AuditStageList":
		$returnData = AuditStageList($data);
		break;
	case "getLeadStatusList":
		$returnData = getLeadStatusList($data);
		break;
	case "getBuyerList":
		$returnData = getBuyerList($data);
		break;
	case "getTeamList":
		$returnData = getTeamList($data);
		break;
	case "CustomerList":
		$returnData = CustomerList($data);
		break;
	case "DesignationList":
		$returnData = DesignationList($data);
		break;
	case "DepartmentList":
		$returnData = DepartmentList($data);
		break;
	case "OfficeList":
		$returnData = OfficeList($data);
		break;
	case "UserZoneList":
		$returnData = UserZoneList($data);
		break;
	case "GenderList":
		$returnData = GenderList($data);
		break;
	case "BusinessLineList":
		$returnData = BusinessLineList($data);
		break;
	case "LeadStatusList":
		$returnData = LeadStatusList($data);
		break;
	case "ActivityList":
		$returnData = ActivityList($data);
		break;
	case "FactoryList":
		$returnData = FactoryList($data);
		break;
	case "getMemberList":
		$returnData = getMemberList($data);
		break;
	case "getCountryList":
		$returnData = getCountryList($data);
		break;
	case "getDaysList":
		$returnData = getDaysList($data);
		break;
	case "getLeaveStatusList":
		$returnData = getLeaveStatusList($data);
		break;
	case "getAuditorList":
		$returnData = getAuditorList($data);
		break;
	case "getLeadAuditorList":
		$returnData = getLeadAuditorList($data);
		break;
	case "getTeamAuditorList":
		$returnData = getTeamAuditorList($data);
		break;
	case "getAuditTypeList":
		$returnData = getAuditTypeList($data);
		break;
	case "getReleasedStatusList":
		$returnData = getReleasedStatusList($data);
		break;


	case "MonthList":
		$returnData = MonthList($data);
		break;
	case "YearList":
		$returnData = YearList($data);
		break;

	case "NextInvoiceNumber":
		$returnData = NextInvoiceNumber($data);
		break;

	case "ClientList":
		$returnData = ClientList($data);
		break;
}

// echo json_encode($returnData);
return $returnData;



function RoleList($data)
{
	try {

		$dbh = new Db();

		$query = "SELECT `RoleId` id,`RoleName` `name`
	 			 	FROM `t_roles` 
					ORDER BY RoleName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function UserList($data)
{
	try {

		$DepartmentId = isset($data->DepartmentId) ? trim($data->DepartmentId) : 0;

		$dbh = new Db();

		$query = "SELECT `UserId` id,`UserName` `name`
	 			 	FROM `t_users` 
					where (DepartmentId=$DepartmentId OR $DepartmentId=0)
					ORDER BY UserName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getCoordinatorList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT `UserId` id,`UserName` `name`
	 			 	FROM `t_users` 
					where IsCoordinator=1
					ORDER BY UserName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function getReportReviewerList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT `UserId` id,`UserName` `name`
	 			 	FROM `t_users` 
					where IsReportReviewer=1
					ORDER BY UserName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function CheckList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT `CheckId` id,`CheckName` `name`
	 			 	FROM `t_checklist` 
					ORDER BY CheckName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function FactoryGroupList($data)
{
	try {

		$dbh = new Db();

		$query = "SELECT `FactoryGroupId` id,FactoryGroupName `name`
	 			 	FROM `t_factorygroup` 
					ORDER BY FactoryGroupName;";



		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function TATDayTypeList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT `TATDayTypeId` id,TATDayType `name`
	 			 	FROM `t_tat_day_type` 
					ORDER BY TATDayType;";
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function ProgramCategoryList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT `ProgramCategoryId` id, ProgramCategoryName `name`
	 			 	FROM `t_programcategory` 
					ORDER BY ProgramCategoryName;";
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function ProgramList($data)
{
	try {

		$dbh = new Db();

		$query = "SELECT `ProgramId` id,ProgramName `name`
	 			 	FROM `t_program` 
					ORDER BY ProgramName;";



		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function AuditStageList($data)
{
	try {

		$dbh = new Db();
		$query = "SELECT `AuditStageId` id,AuditStageName `name`
	 			 	FROM `t_auditstage` 
					ORDER BY AuditStageName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getLeadStatusList($data)
{
	try {

		$dbh = new Db();
		$query = "SELECT `LeadStatusId` id,LeadStatusName `name`
	 			 	FROM `t_leadstatus` 
					ORDER BY LeadStatusName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getBuyerList($data)
{
	try {

		$dbh = new Db();
		$query = "SELECT `BuyerId` id,BuyerName `name`
	 			 	FROM `t_buyer` 
					ORDER BY BuyerName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getTeamList($data)
{
	try {

		$dbh = new Db();
		$query = "SELECT `TeamId` id,TeamName `name`
	 			 	FROM `t_team` 
					ORDER BY TeamName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function CustomerList($data)
{
	try {

		$dbh = new Db();

		$query = "SELECT `CustomerId` id,concat(`CustomerName`,' - ',ContactPhone) `name`
	 			 	FROM `t_customer` 
					ORDER BY CustomerName;";



		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function DesignationList($data)
{
	try {

		$dbh = new Db();
		$query = "SELECT `DesignationId` id,`DesignationName` `name`
	 			 	FROM `t_designation` 
					ORDER BY DesignationName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function DepartmentList($data)
{
	try {

		$dbh = new Db();
		$query = "SELECT `DepartmentId` id,`DepartmentName` `name`
	 			 	FROM `t_department` 
					ORDER BY DepartmentName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function OfficeList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT `OfficeId` id,`OfficeName` `name`
	 			 	FROM `t_office` 
					ORDER BY OfficeName;";
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function UserZoneList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT `UserZoneId` id,`UserZoneName` `name`
	 			 	FROM `t_user_zone` 
					ORDER BY UserZoneName;";
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function GenderList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT `GenderId` id,`GenderName` `name`
	 			 	FROM `t_gender` 
					ORDER BY GenderName;";
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function BusinessLineList($data)
{
	try {

		$dbh = new Db();

		$query = "SELECT `BusinessLineId` id,`BusinessLineName` `name`
	 			 	FROM `t_businessline` 
					ORDER BY BusinessLineName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function LeadStatusList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT `LeadStatusId` id,`LeadStatusName` `name`
	 			 	FROM `t_leadstatus` 
					ORDER BY LeadStatusName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}



function ActivityList($data)
{
	try {

		$dbh = new Db();
		$query = "SELECT `ActivityId` id,ActivityName `name`
	 			 	FROM `t_activity` 
					ORDER BY ActivityName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function FactoryList($data)
{
	try {
		$dbh = new Db();
		$query = "SELECT a.`FactoryId` id, a.FactoryName `name`, b.FactoryGroupName, a.Address
	 			 	FROM `t_factory` a
					inner join t_factorygroup b on a.FactoryGroupId = b.FactoryGroupId
					ORDER BY a.FactoryName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getMemberList($data)
{
	
    $DepartmentId = trim($data->DepartmentId);
	try {
		$dbh = new Db();
		$query = "SELECT a.`MemberId` id, a.MemberName `name`
	 			 	FROM t_member a
					where (a.DepartmentId = $DepartmentId)
					ORDER BY a.MemberName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getCountryList($data)
{
	
	try {
		$dbh = new Db();
		$query = "SELECT a.`CountryId` id, a.CountryName `name`
	 			 	FROM t_country a
					ORDER BY a.CountryName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getDaysList($data)
{
	
	try {
		$dbh = new Db();
		$query = "SELECT a.`DayName` id, a.DayName `name`
	 			 	FROM t_sevendays a order by Serial ASC;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getLeaveStatusList($data)
{
	
	try {
		$dbh = new Db();
		$query = "SELECT a.`LeaveStatusId` id, a.LeaveStatusName `name`
	 			 	FROM t_leavestatus a
					ORDER BY a.LeaveStatusName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}



function getAuditorList($data)
{
	
	try {
		$dbh = new Db();
		$query = "SELECT a.`AuditorId` id, a.AuditorName `name`
	 			 	FROM t_auditor a
					ORDER BY a.AuditorName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getLeadAuditorList($data)
{
	
    $ProgramId = trim($data->ProgramId);
	try {
		$dbh = new Db();
		$query = "SELECT a.`AuditorId` id, b.AuditorName `name`
	 			 	FROM t_auditor_lead_program a
					INNER JOIN t_auditor b on a.AuditorId=b.AuditorId and a.ProgramId=$ProgramId
					ORDER BY b.AuditorName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function getTeamAuditorList($data)
{
	
    $ProgramId = trim($data->ProgramId);
	try {
		$dbh = new Db();
		$query = "SELECT distinct a.`AuditorId` id, b.AuditorName `name`
	 			 	FROM t_auditor_member_program a
					INNER JOIN t_auditor b on a.AuditorId=b.AuditorId and a.ProgramId=$ProgramId
					ORDER BY b.AuditorName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getAuditTypeList($data)
{
	
	try {
		$dbh = new Db();
		$query = "SELECT a.`AuditTypeId` id, a.AuditTypeName `name`
	 			 	FROM t_audittype a
					ORDER BY a.AuditTypeName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getReleasedStatusList($data)
{
	
	try {
		$dbh = new Db();
		$query = "SELECT a.`ReportReleasedStatusId` id, a.ReportReleasedStatus `name`
	 			 	FROM t_releasedstatus a
					ORDER BY a.ReportReleasedStatus;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function MonthList($data)
{
	try {


		$dbh = new Db();
		$query = "SELECT distinct MonthId id, MonthName `name` FROM t_month	ORDER BY MonthId;";
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function YearList($data)
{
	try {

		$dbh = new Db();
		$query = "SELECT distinct YearName id, YearName `name` FROM t_year
		ORDER BY YearName DESC;";
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

















































 
function ClientList($data)
{
	try {

		$dbh = new Db();
		$query = "SELECT ClientId id, ClientName `name` 
		FROM t_client
		ORDER BY ClientName;";
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}
 
function NextInvoiceNumber($data)
{
	try {

		$ClientId = trim($data->ClientId);
		$BranchId = trim($data->BranchId);
		$TransactionTypeId = trim($data->TransactionTypeId);
		$InvNo = getNextInvoiceNumber($ClientId, $BranchId, $TransactionTypeId);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $InvNo
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}