<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;
	case "getDataMTDStatusRevenueList":
		$returnData = getDataMTDStatusRevenueList($data);
		break;
	case "getYTDStatusList":
		$returnData = getYTDStatusList($data);
		break;
	case "getLostRevenueList":
		$returnData = getLostRevenueList($data);
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

		$query = "SELECT w.ProgramCategoryName,
			IFNULL(SUM(w.RevenueBDT), 0) as RevenueGBPK,
			IFNULL(SUM(w.NoOfJobs), 0) as NoOfJobs,
			IFNULL(SUM(w.NoOfMDs), 0) as NoOfMDs
			FROM (
				SELECT pc.ProgramCategoryName, t.RevenueBDT, 1 as NoOfJobs, t.ManDay as NoOfMDs
				FROM t_programcategory pc
				INNER JOIN t_program p ON pc.ProgramCategoryId = p.ProgramCategoryId
				INNER JOIN t_transaction t ON p.ProgramId = t.ProgramId
				WHERE DATE(t.AuditStartDate) = '$StartDate'
			) w
			GROUP BY w.ProgramCategoryName;";

		// $query = "SELECT w.ProgramCategoryName,
		// 	IFNULL(SUM(w.RevenueBDT), 0) as RevenueGBPK,
		// 	IFNULL(SUM(w.NoOfJobs), 0) as NoOfJobs,
		// 	IFNULL(SUM(w.NoOfMDs), 0) as NoOfMDs
		// 	FROM (
		// 		SELECT pc.ProgramCategoryName, t.RevenueBDT, 1 as NoOfJobs, 0 as NoOfMDs
		// 		FROM t_programcategory pc
		// 		INNER JOIN t_program p ON pc.ProgramCategoryId = p.ProgramCategoryId
		// 		INNER JOIN t_transaction t ON p.ProgramId = t.ProgramId
		// 		WHERE DATE(t.AuditStartDate) = '$StartDate'

		// 		UNION ALL

		// 		SELECT pc.ProgramCategoryName, 0 as RevenueBDT, 0 as NoOfJobs, 1 as NoOfMDs
		// 		FROM t_transaction_auditor_assign taa
		// 		INNER JOIN t_transaction tt ON taa.TransactionId = tt.TransactionId
		// 		INNER JOIN t_program p ON tt.ProgramId = p.ProgramId
		// 		INNER JOIN t_programcategory pc ON p.ProgramCategoryId = pc.ProgramCategoryId
		// 		WHERE DATE(taa.AssignDate) = '$StartDate'
		// 	) w
		// 	GROUP BY w.ProgramCategoryName;";
		
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => [
				"data" => $resultdata
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

 
function getDataMTDStatusRevenueList($data)
{
	try {
		$dbh = new Db();

		$StartDate = trim($data->StartDate);
		$Year = date('Y', strtotime($StartDate));
		$Month = date('m', strtotime($StartDate));

		$query = "SELECT pc.ProgramCategoryName,
			case when t.LeadStatusId = 1 then IFNULL(SUM(t.RevenueBDT), 0) else 0 end as InprogressRevenue,
			case when t.LeadStatusId = 2 then IFNULL(SUM(t.RevenueBDT), 0) else 0 end as ConfirmedRevenue,
			case when t.LeadStatusId = 5 then IFNULL(SUM(t.RevenueBDT), 0) else 0 end as PerformedRevenue,
			IFNULL(SUM(t.RevenueBDT), 0) as TotalRevenue
			FROM t_programcategory pc
			INNER JOIN t_program p ON pc.ProgramCategoryId = p.ProgramCategoryId
			INNER JOIN t_transaction t ON p.ProgramId = t.ProgramId 
				AND YEAR(t.AuditStartDate) = '$Year'
				AND MONTH(t.AuditStartDate) = '$Month'
				AND t.LeadStatusId IN (1, 2, 5) -- Assuming 1= In-progress, 2= Confirmed, 5= Performed
			GROUP BY pc.ProgramCategoryName;";
		
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => [
				"data" => $resultdata
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function getYTDStatusList($data)
{
	try {
		$dbh = new Db();

		$StartDate = trim($data->StartDate);
		$Year = date('Y', strtotime($StartDate));

		$query = "SELECT w.ProgramCategoryName,
			IFNULL(SUM(w.RevenueBDT), 0) as PerformedRevenue,
			IFNULL(SUM(w.PerformedJobs), 0) as PerformedJobs,
			IFNULL(SUM(w.PerformedManday), 0) as PerformedManday
			FROM (
		
				SELECT pc.ProgramCategoryName, t.RevenueBDT, 1 as PerformedJobs, t.Manday as PerformedManday
				FROM t_programcategory pc
				INNER JOIN t_program p ON pc.ProgramCategoryId = p.ProgramCategoryId
				INNER JOIN t_transaction t ON p.ProgramId = t.ProgramId 
				Where YEAR(t.AuditStartDate) = '$Year'
				AND t.LeadStatusId = 5 -- Assuming 5= Performed
				) w
			GROUP BY ProgramCategoryName;";
			
		// $query = "SELECT w.ProgramCategoryName,
		// 	IFNULL(SUM(w.RevenueBDT), 0) as PerformedRevenue,
		// 	IFNULL(SUM(w.PerformedJobs), 0) as PerformedJobs,
		// 	IFNULL(SUM(w.PerformedManday), 0) as PerformedManday
		// 	FROM (
		
		// 		SELECT pc.ProgramCategoryName, t.RevenueBDT, 1 as PerformedJobs, 0 as PerformedManday
		// 		FROM t_programcategory pc
		// 		INNER JOIN t_program p ON pc.ProgramCategoryId = p.ProgramCategoryId
		// 		INNER JOIN t_transaction t ON p.ProgramId = t.ProgramId 
		// 		Where YEAR(t.AuditStartDate) = '$Year'
		// 		AND t.LeadStatusId = 5 -- Assuming 1= In-progress, 2= Confirmed, 5= Performed

		// 		UNION ALL

		// 		SELECT pc.ProgramCategoryName, 0 as PerformedRevenue, 0 as PerformedJobs, 1 as PerformedManday
		// 		FROM t_transaction_auditor_assign taa 
		// 		inner join t_transaction tt on taa.TransactionId = tt.TransactionId
		// 		INNER JOIN t_program p ON tt.ProgramId = p.ProgramId
		// 		INNER JOIN t_programcategory pc ON p.ProgramCategoryId = pc.ProgramCategoryId
		// 		WHERE YEAR(taa.AssignDate) = '$Year' 
		// 		AND tt.LeadStatusId = 5 -- Assuming 5= Performed
		// 		) w
		// 	GROUP BY ProgramCategoryName;";
		
		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => [
				"data" => $resultdata
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function getLostRevenueList($data)
{
	try {
		$dbh = new Db();

		$StartDate = trim($data->StartDate);
		$Year = date('Y', strtotime($StartDate));
		$Month = date('m', strtotime($StartDate));

		$query = "SELECT w.ProgramCategoryName,
			IFNULL(SUM(w.MTDRevenueBDT), 0) as MTDRevenueBDT,
			IFNULL(SUM(w.MTDNoOfJob), 0) as MTDNoOfJob,
			IFNULL(SUM(w.YTDRevenueBDT), 0) as YTDRevenueBDT,
			IFNULL(SUM(w.YTDNoOfJob), 0) as YTDNoOfJob
			FROM (
		
				SELECT pc.ProgramCategoryName, t.RevenueBDT as MTDRevenueBDT, 1 as MTDNoOfJob, 0 as YTDRevenueBDT, 0 as YTDNoOfJob
				FROM t_programcategory pc
				INNER JOIN t_program p ON pc.ProgramCategoryId = p.ProgramCategoryId
				INNER JOIN t_transaction t ON p.ProgramId = t.ProgramId 
				AND MONTH(t.AuditStartDate) = '$Month'
				AND t.LeadStatusId = 11 -- Assuming 11= Lost

				UNION ALL

				SELECT pcb.ProgramCategoryName, 0 AS MTDRevenueBDT, 0 AS MTDNoOfJob, tb.RevenueBDT AS YTDRevenueBDT, 1 AS YTDNoOfJob 
				FROM t_programcategory pcb
				INNER JOIN t_program pb ON pcb.ProgramCategoryId = pb.ProgramCategoryId 
				INNER JOIN t_transaction tb ON pb.ProgramId = tb.ProgramId
				WHERE YEAR(tb.AuditStartDate) = '$Year' 
				AND tb.LeadStatusId = 11 -- Assuming 11= Lost 

				) w
			GROUP BY ProgramCategoryName;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => [
				"data" => $resultdata
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}
