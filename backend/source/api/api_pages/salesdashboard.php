<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;
 
	case "getOverallSummary":
		$returnData = getOverallSummary($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{
	try {
		$dbh = new Db();

		$StartDate = trim($data->StartDate);
		$EndDate = trim($data->EndDate);
		$EndDateWithTime = trim($data->EndDate) . " 23:59:59";

		// Get all sales persons (members)
		$query = "SELECT MemberId, MemberName FROM t_member WHERE IsActive = 1 ORDER BY MemberName;";
		$members = $dbh->query($query);

		$dataList = array();

		foreach ($members as $member) {
			$MemberId = $member['MemberId'];
			$MemberName = $member['MemberName'];

			// Today's Onsite Activity (AuditTypeId = 1)
			$query = "SELECT COUNT(*) as cnt FROM t_transaction 
					  WHERE DATE(TransactionDate) = '$EndDate' AND AuditTypeId = 1 AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$TodaysOnsiteActivity = $result[0]['cnt'] ?? 0;

			// MTD Onsite Activity
			$query = "SELECT COUNT(*) as cnt FROM t_transaction 
					  WHERE (TransactionDate BETWEEN '$StartDate' AND '$EndDateWithTime') AND AuditTypeId = 1 AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$MTDOnsiteActivity = $result[0]['cnt'] ?? 0;

			// Today's Offsite Activity (AuditTypeId = 2)
			$query = "SELECT COUNT(*) as cnt FROM t_transaction 
					  WHERE DATE(TransactionDate) = '$EndDate' AND AuditTypeId = 2 AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$TodaysOffsiteActivity = $result[0]['cnt'] ?? 0;

			// MTD Offsite Activity
			$query = "SELECT COUNT(*) as cnt FROM t_transaction 
					  WHERE (TransactionDate BETWEEN '$StartDate' AND '$EndDateWithTime') AND AuditTypeId = 2 AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$MTDOffsiteActivity = $result[0]['cnt'] ?? 0;

			// Today's Perform Jobs (LeadStatusId = 5)
			$query = "SELECT COUNT(*) as cnt FROM t_transaction 
					  WHERE DATE(TransactionDate) = '$EndDate' AND LeadStatusId = 5 AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$TodaysPerformJobs = $result[0]['cnt'] ?? 0;

			// MTD Perform Jobs
			$query = "SELECT COUNT(*) as cnt FROM t_transaction 
					  WHERE (TransactionDate BETWEEN '$StartDate' AND '$EndDateWithTime') AND LeadStatusId = 5 AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$MTDPerformJobs = $result[0]['cnt'] ?? 0;

			// Today's Perform Mandays
			$query = "SELECT COALESCE(SUM(ManDay), 0) as total FROM t_transaction 
					  WHERE DATE(TransactionDate) = '$EndDate' AND LeadStatusId = 5 AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$TodaysPerformMandays = $result[0]['total'] ?? 0;

			// MTD Perform Mandays
			$query = "SELECT COALESCE(SUM(ManDay), 0) as total FROM t_transaction 
					  WHERE (TransactionDate BETWEEN '$StartDate' AND '$EndDateWithTime') AND LeadStatusId = 5 AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$MTDPerformMandays = $result[0]['total'] ?? 0;

			// Today's Revenue
			$query = "SELECT COALESCE(SUM(RevenueBDT), 0) as total FROM t_transaction 
					  WHERE DATE(ReleaseDate) = '$EndDate' AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$TodaysRevenue = $result[0]['total'] ?? 0;

			// MTD Revenue
			$query = "SELECT COALESCE(SUM(RevenueBDT), 0) as total FROM t_transaction 
					  WHERE (ReleaseDate BETWEEN '$StartDate' AND '$EndDateWithTime') AND MemberId = $MemberId;";
			$result = $dbh->query($query);
			$MTDRevenue = $result[0]['total'] ?? 0;

			// Targets from t_member_target
			$query = "SELECT COALESCE(SUM(OnSiteTarget), 0) as OnSiteTarget, 
					  COALESCE(SUM(OffSiteTarget), 0) as OffSiteTarget, 
					  COALESCE(SUM(RevenueTarget), 0) as RevenueTarget
					  FROM t_member_target 
					  WHERE MemberId = $MemberId 
					  AND DATE(CONCAT(YearId, '-', MonthId, '-01')) BETWEEN '$StartDate' AND '$EndDate';";
			$result = $dbh->query($query);
			$TargetOnsiteActivity = $result[0]['OnSiteTarget'] ?? 0;
			$TargetOffsiteActivity = $result[0]['OffSiteTarget'] ?? 0;
			$RevenueTarget = $result[0]['RevenueTarget'] ?? 0;

			$dataList[] = [
				"MemberId" => (int)$MemberId,
				"SalesPersonName" => $MemberName,
				"TodaysOnsiteActivity" => (int)$TodaysOnsiteActivity,
				"MTDOnsiteActivity" => (int)$MTDOnsiteActivity,
				"TargetOnsiteActivity" => (int)$TargetOnsiteActivity,
				"TodaysOffsiteActivity" => (int)$TodaysOffsiteActivity,
				"MTDOffsiteActivity" => (int)$MTDOffsiteActivity,
				"TargetOffsiteActivity" => (int)$TargetOffsiteActivity,
				"TodaysPerformJobs" => (int)$TodaysPerformJobs,
				"MTDPerformJobs" => (int)$MTDPerformJobs,
				"TodaysPerformMandays" => (float)$TodaysPerformMandays,
				"MTDPerformMandays" => (float)$MTDPerformMandays,
				"TodaysRevenue" => (float)$TodaysRevenue,
				"MTDRevenue" => (float)$MTDRevenue,
				"RevenueTarget" => (float)$RevenueTarget
			];
		}

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => [
				"data" => $dataList
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


 
function getOverallSummary($data)
{
	try {
		$dbh = new Db();

		$StartDate = trim($data->StartDate);
		$EndDate = trim($data->EndDate);
		$EndDateWithTime = trim($data->EndDate) . " 23:59:59";


		// Get today's onsite activity
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE DATE(TransactionDate) = '$EndDate' AND AuditTypeId = 1;";
		$result = $dbh->query($query);
		$TodaysOnsiteActivity = $result[0]['cnt'] ?? 0;

		// Get MTD onsite activity
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE (TransactionDate BETWEEN '$StartDate' AND '$EndDateWithTime') AND AuditTypeId = 1;";
		$result = $dbh->query($query);
		$MTDOnsiteActivity = $result[0]['cnt'] ?? 0;

		// Get target onsite and offsite activity
		$query = "SELECT COALESCE(SUM(OnSiteTarget), 0) as OnSiteTarget, COALESCE(SUM(OffSiteTarget), 0) as OffSiteTarget, 
				COALESCE(SUM(RevenueTarget), 0) as RevenueTarget
				  FROM t_member_target 
				  WHERE DATE(CONCAT(YearId, '-', MonthId, '-01')) between '$StartDate' AND '$EndDate';";
		$result = $dbh->query($query);
		$TargetOnsiteActivity = $result[0]['OnSiteTarget'] ?? 0;
		$TargetOffsiteActivity = $result[0]['OffSiteTarget'] ?? 0;
		$RevenueTarget = $result[0]['RevenueTarget'] ?? 0;


		// Get today's offsite activity
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE DATE(TransactionDate) = '$EndDate' AND AuditTypeId = 2;";
		$result = $dbh->query($query);
		$TodaysOffsiteActivity = $result[0]['cnt'] ?? 0;

		// Get MTD offsite activity
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE (TransactionDate BETWEEN '$StartDate' AND '$EndDateWithTime') AND AuditTypeId = 2;";
		$result = $dbh->query($query);
		$MTDOffsiteActivity = $result[0]['cnt'] ?? 0;



		// Get today's perform jobs. t_leadstatus = 5 = Performed
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE DATE(TransactionDate) = '$EndDate' AND LeadStatusId = 5;";
		$result = $dbh->query($query);
		$TodaysPerformJobs = $result[0]['cnt'] ?? 0;

		// Get MTD perform jobs
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE (TransactionDate BETWEEN '$StartDate' AND '$EndDateWithTime') AND LeadStatusId = 5;";
		$result = $dbh->query($query);
		$MTDPerformJobs = $result[0]['cnt'] ?? 0;



		// Get today's perform mandays
		$query = "SELECT COALESCE(SUM(ManDay), 0) as total FROM t_transaction 
				  WHERE DATE(TransactionDate) = '$EndDate' AND LeadStatusId = 5;";
		$result = $dbh->query($query);
		$TodaysPerformMandays = $result[0]['total'] ?? 0;

		// Get MTD perform mandays
		$query = "SELECT COALESCE(SUM(ManDay), 0) as total FROM t_transaction 
				  WHERE (TransactionDate BETWEEN '$StartDate' AND '$EndDateWithTime') AND LeadStatusId = 5;";
		$result = $dbh->query($query);
		$MTDPerformMandays = $result[0]['total'] ?? 0;

		// Get today's revenue
		$query = "SELECT COALESCE(SUM(RevenueBDT), 0) as total FROM t_transaction 
				  WHERE DATE(ReleaseDate) = '$EndDate';";
		$result = $dbh->query($query);
		$TodaysRevenue = $result[0]['total'] ?? 0;

		// Get MTD revenue
		$query = "SELECT COALESCE(SUM(RevenueBDT), 0) as total FROM t_transaction 
				  WHERE (ReleaseDate BETWEEN '$StartDate' AND '$EndDateWithTime');";
		$result = $dbh->query($query);
		$MTDRevenue = $result[0]['total'] ?? 0;


		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => [
				"TodaysOnsiteActivity" => (int)$TodaysOnsiteActivity,
				"MTDOnsiteActivity" => (int)$MTDOnsiteActivity,
				"TargetOnsiteActivity" => (int)$TargetOnsiteActivity,
				"TodaysOffsiteActivity" => (int)$TodaysOffsiteActivity,
				"MTDOffsiteActivity" => (int)$MTDOffsiteActivity,
				"TargetOffsiteActivity" => (int)$TargetOffsiteActivity,
				"TodaysPerformJobs" => (int)$TodaysPerformJobs,
				"MTDPerformJobs" => (int)$MTDPerformJobs,
				"TodaysPerformMandays" => (int)$TodaysPerformMandays,
				"MTDPerformMandays" => (int)$MTDPerformMandays,
				"TodaysRevenue" => (float)$TodaysRevenue,
				"MTDRevenue" => (float)$MTDRevenue,
				"RevenueTarget" => (float)$RevenueTarget
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}
