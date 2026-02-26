<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;
	case "getDataByBuyerList":
		$returnData = getDataByBuyerList($data);
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
		$EndDate = trim($data->EndDate) . " 23:59:59";

		$query = "SELECT a.TransactionId, a.ProgramId, b.ProgramName, b.TATDayTypeId, 0 ReportReleased, 0 CurrentTAT, 
		b.StandardTATDay, a.AuditEndDate, a.ReleaseDate, 0 CalDiffDaysAuditEndDateReleaseDate
			FROM `t_transaction` a
			INNER JOIN t_program b ON a.ProgramId=b.ProgramId
			where (a.ReleaseDate between '$StartDate' and '$EndDate')
			and a.AuditEndDate is not null
			and a.ReleaseDate is not null;";
		$resultdata = $dbh->query($query);
		// echo $query;
		// exit;
		$dataList = array();
		foreach ($resultdata as $row) {

			$StandardTAT = date("Y-m-d");
			$StrategicTAT = date("Y-m-d");

			$AuditEndDate = $row['AuditEndDate'];
			$ReleaseDate = $row['ReleaseDate'];
			$TATDayTypeId = $row['TATDayTypeId'];
			$StandardTATDay = $row['StandardTATDay'];
			$ProgramName = $row['ProgramName'];

			if ($TATDayTypeId == 1) {
				//Calendar day
				if ($AuditEndDate !== $ReleaseDate) {
					// $days = (new DateTime($AuditEndDate))->diff(new DateTime($ReleaseDate))->days;
					// $row['CalDiffDaysAuditEndDateReleaseDate'] = $days;
					$diff = (new DateTime($AuditEndDate))->diff(new DateTime($ReleaseDate));
					$row['CalDiffDaysAuditEndDateReleaseDate'] = (int)$diff->format("%R%a"); //-15 or +15
				}

				// $StandardTATDate = date_create($AuditEndDate);
				// date_add($StandardTATDate, date_interval_create_from_date_string("$StandardTATDay days"));
				// $StandardTAT = date_format($StandardTATDate, "Y-m-d");

				// $StrategicTATDate = date_create($AuditEndDate);
				// date_add($StrategicTATDate, date_interval_create_from_date_string("$StrategiceTATDay days"));
				// $StrategicTAT = date_format($StrategicTATDate, "Y-m-d");
			} else if ($TATDayTypeId == 2) {
				//working day

				//================== Start for StandardTATDay==========================
				// $AuditEndDate = date_create($AuditEndDate);
				// $ReleaseDate = date_create($ReleaseDate);

				$workingDays = 0;
				while ($AuditEndDate < $ReleaseDate) {
					// Move to next day
					$AuditEndDate = date('Y-m-d', strtotime($AuditEndDate . ' +1 day'));

					$sql = "select COUNT(*) as cnt	from t_holiday where DayType = 'holiday' and HoliDate = '$AuditEndDate';";
					$resultdata1 = $dbh->query($sql);
					if ($resultdata1[0]['cnt'] > 0) {
						continue; // skip holiday
					}

					// Count valid working day
					$workingDays++;
				}

				$row['CalDiffDaysAuditEndDateReleaseDate'] = $workingDays;
				//================== End for StandardTATDay========================== 

			}

			$dataList[] = $row;
		}


		$dataListMatrix = GroupByProgramArray($dataList);


		$dataListMatrixFinal = array();

		$totalCurrentTAT = 0;
		$totalReportReleased = 0;
		foreach ($dataListMatrix as $row) {

			if ($row['CalDiffDaysAuditEndDateReleaseDate'] > 0 && $row['ReportReleased'] > 0) {
				$row['CurrentTAT'] = round($row['CalDiffDaysAuditEndDateReleaseDate'] / $row['ReportReleased'], 2);

				$totalCurrentTAT += $row['CalDiffDaysAuditEndDateReleaseDate'];
				$totalReportReleased += $row['ReportReleased'];
			}
			$dataListMatrixFinal[] = $row;
		}

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => [
				"data" => $dataListMatrixFinal,
				"TotalCurrentTAT" => $totalCurrentTAT,
				"TotalReportReleased" => $totalReportReleased
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

function GroupByProgramArray($ArrayBase)
{
	$result = [];
	foreach ($ArrayBase as $row) {
		$key = $row['ProgramId'];

		if (!isset($result[$key])) {
			$result[$key] = [
				"ProgramId" => $row['ProgramId'],
				"ProgramName" => $row['ProgramName'],
				"ReportReleased" => 0,
				"CurrentTAT" => 0,
				"StandardTATDay" => $row['StandardTATDay'], // usually same per program
				"CalDiffDaysAuditEndDateReleaseDate" => 0
			];
		}

		$result[$key]['ReportReleased'] += 1;
		// $result[$key]['CurrentTAT'] += $row['CurrentTAT'];
		$result[$key]['CalDiffDaysAuditEndDateReleaseDate'] += $row['CalDiffDaysAuditEndDateReleaseDate'];
	}

	// Reindex array (optional)
	// $array2 = array_values($result);

	return $result;
}

function getDataByBuyerList($data)
{
	try {
		$dbh = new Db();

		$StartDate = trim($data->StartDate);
		$EndDate = trim($data->EndDate) . " 23:59:59";

		$query = "SELECT a.TransactionId, a.ProgramId, b.ProgramName,a.BuyerId, c.BuyerName, b.TATDayTypeId,
		 0 ReportReleased, 0 CurrentTAT, 
		b.StandardTATDay, a.AuditEndDate, a.ReleaseDate, 0 CalDiffDaysAuditEndDateReleaseDate
			FROM `t_transaction` a
			INNER JOIN t_program b ON a.ProgramId=b.ProgramId
			INNER JOIN t_buyer c ON a.BuyerId=c.BuyerId
			where (a.ReleaseDate between '$StartDate' and '$EndDate')
			and a.AuditEndDate is not null
			and a.ReleaseDate is not null;";
		$resultdata = $dbh->query($query);
		// echo $query;
		// exit;

		$dataList = array();
		$programWiseTAT = array();
		foreach ($resultdata as $row) {

			$StandardTAT = date("Y-m-d");
			$StrategicTAT = date("Y-m-d");

			$AuditEndDate = $row['AuditEndDate'];
			$ReleaseDate = $row['ReleaseDate'];
			$TATDayTypeId = $row['TATDayTypeId'];
			$StandardTATDay = $row['StandardTATDay'];

			$programWiseTAT[$row['ProgramId']] = $row['StandardTATDay'];


			if ($TATDayTypeId == 1) {
				//Calendar day
				if ($AuditEndDate !== $ReleaseDate) {
					$diff = (new DateTime($AuditEndDate))->diff(new DateTime($ReleaseDate));
					$row['CalDiffDaysAuditEndDateReleaseDate'] = (int)$diff->format("%R%a"); //-15 or +15
				}

			} else if ($TATDayTypeId == 2) {
				//working day

				//================== Start for StandardTATDay==========================
				$workingDays = 0;
				while ($AuditEndDate < $ReleaseDate) {
					// Move to next day
					$AuditEndDate = date('Y-m-d', strtotime($AuditEndDate . ' +1 day'));

					$sql = "select COUNT(*) as cnt	from t_holiday where DayType = 'holiday' and HoliDate = '$AuditEndDate';";
					$resultdata1 = $dbh->query($sql);
					if ($resultdata1[0]['cnt'] > 0) {
						continue; // skip holiday
					}

					// Count valid working day
					$workingDays++;
				}

				$row['CalDiffDaysAuditEndDateReleaseDate'] = $workingDays;
				//================== End for StandardTATDay==========================

			}

			$dataList[] = $row;
		}

		// echo "<pre>";
		// print_r($dataList);
		// echo "</pre>";
		// exit;

		$dataListMatrix = GroupByBuyerArray($dataList);

		$dataListMatrixFinal = array();
		$totalReportReleased = 0;
		$totalCurrentTAT = 0;

		foreach ($dataListMatrix as $row) {

			if ($row['CalDiffDaysAuditEndDateReleaseDate'] > 0 && $row['ReportReleased'] > 0) {
				$row['CurrentTAT'] = round($row['CalDiffDaysAuditEndDateReleaseDate'] / $row['ReportReleased'], 2);
			}

			if ($row['StandardTATDay'] > 0 && $row['ReportReleased'] > 0) {
				$row['StandardTATDay'] = round($row['StandardTATDay'] / $row['ReportReleased'], 2);
			}

			$dataListMatrixFinal[] = $row;
		}


		$totalReportReleased = array_sum(array_column($dataListMatrixFinal, 'ReportReleased'));
		$totalCurrentTAT = array_sum(array_column($dataListMatrixFinal, 'CurrentTAT'));

		$averageStandardTAT = count($programWiseTAT) > 0 ? round(array_sum($programWiseTAT) / count($programWiseTAT), 2) : 0;

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			// "datalist" => $dataListMatrixFinal
			"datalist" => [
				"data" => $dataListMatrixFinal,
				"TotalCurrentTAT" => $totalCurrentTAT,
				"TotalReportReleased" => $totalReportReleased,
				"AverageStandardTAT" => $averageStandardTAT
			]
		];

		

	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function GroupByBuyerArray($ArrayBase)
{
	$result = [];
	foreach ($ArrayBase as $row) {
		$key = $row['BuyerId'];

		if (!isset($result[$key])) {
			$result[$key] = [
				"BuyerId" => $row['BuyerId'],
				"BuyerName" => $row['BuyerName'],
				"ReportReleased" => 0,
				"CurrentTAT" => 0,
				"StandardTATDay" => 0, // usually same per program
				"CalDiffDaysAuditEndDateReleaseDate" => 0
			];
		}

		$result[$key]['ReportReleased'] += 1;
		$result[$key]['CurrentTAT'] += $row['CurrentTAT'];
		$result[$key]['StandardTATDay'] += $row['StandardTATDay'];
		$result[$key]['CalDiffDaysAuditEndDateReleaseDate'] += $row['CalDiffDaysAuditEndDateReleaseDate'];
	}

	// Reindex array (optional)
	// $array2 = array_values($result);

	return $result;
}

function getOverallSummary($data)
{
	try {
		$dbh = new Db();

		$StartDate = trim($data->StartDate);
		$EndDate = trim($data->EndDate) . " 23:59:59";
		$Today = date('Y-m-d');
		$TodayEnd = $Today . " 23:59:59";

		// Get today's onsite activity
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE DATE(CreatedDate) = '$Today' AND AuditTypeId = 1;";
		$result = $dbh->query($query);
		$TodaysOnsiteActivity = $result[0]['cnt'] ?? 0;

		// Get MTD onsite activity
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE (CreatedDate BETWEEN '$StartDate' AND '$EndDate') AND AuditTypeId = 1;";
		$result = $dbh->query($query);
		$MTDOnsiteActivity = $result[0]['cnt'] ?? 0;

		// Get target onsite activity (from t_target or hardcoded for now)
		$query = "SELECT COALESCE(SUM(TargetValue), 0) as target FROM t_target 
				  WHERE TargetTypeId = 1 AND YEAR(TargetDate) = YEAR('$StartDate') AND MONTH(TargetDate) = MONTH('$StartDate');";
		$result = $dbh->query($query);
		$TargetOnsiteActivity = $result[0]['target'] ?? 0;

		// Get today's offsite activity
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE DATE(CreatedDate) = '$Today' AND AuditTypeId = 2;";
		$result = $dbh->query($query);
		$TodaysOffsiteActivity = $result[0]['cnt'] ?? 0;

		// Get MTD offsite activity
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE (CreatedDate BETWEEN '$StartDate' AND '$EndDate') AND AuditTypeId = 2;";
		$result = $dbh->query($query);
		$MTDOffsiteActivity = $result[0]['cnt'] ?? 0;

		// Get target offsite activity
		$query = "SELECT COALESCE(SUM(TargetValue), 0) as target FROM t_target 
				  WHERE TargetTypeId = 2 AND YEAR(TargetDate) = YEAR('$StartDate') AND MONTH(TargetDate) = MONTH('$StartDate');";
		$result = $dbh->query($query);
		$TargetOffsiteActivity = $result[0]['target'] ?? 0;

		// Get today's perform jobs
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE DATE(AuditEndDate) = '$Today';";
		$result = $dbh->query($query);
		$TodaysPerformJobs = $result[0]['cnt'] ?? 0;

		// Get MTD perform jobs
		$query = "SELECT COUNT(*) as cnt FROM t_transaction 
				  WHERE (AuditEndDate BETWEEN '$StartDate' AND '$EndDate');";
		$result = $dbh->query($query);
		$MTDPerformJobs = $result[0]['cnt'] ?? 0;

		// Get today's perform mandays
		$query = "SELECT COALESCE(SUM(ManDays), 0) as total FROM t_transaction 
				  WHERE DATE(AuditEndDate) = '$Today';";
		$result = $dbh->query($query);
		$TodaysPerformMandays = $result[0]['total'] ?? 0;

		// Get MTD perform mandays
		$query = "SELECT COALESCE(SUM(ManDays), 0) as total FROM t_transaction 
				  WHERE (AuditEndDate BETWEEN '$StartDate' AND '$EndDate');";
		$result = $dbh->query($query);
		$MTDPerformMandays = $result[0]['total'] ?? 0;

		// Get today's revenue
		$query = "SELECT COALESCE(SUM(Revenue), 0) as total FROM t_transaction 
				  WHERE DATE(ReleaseDate) = '$Today';";
		$result = $dbh->query($query);
		$TodaysRevenue = $result[0]['total'] ?? 0;

		// Get MTD revenue
		$query = "SELECT COALESCE(SUM(Revenue), 0) as total FROM t_transaction 
				  WHERE (ReleaseDate BETWEEN '$StartDate' AND '$EndDate');";
		$result = $dbh->query($query);
		$MTDRevenue = $result[0]['total'] ?? 0;

		// Get target revenue
		$query = "SELECT COALESCE(SUM(TargetValue), 0) as target FROM t_target 
				  WHERE TargetTypeId = 3 AND YEAR(TargetDate) = YEAR('$StartDate') AND MONTH(TargetDate) = MONTH('$StartDate');";
		$result = $dbh->query($query);
		$TargetRevenue = $result[0]['target'] ?? 0;

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
				"TodaysPerformMandays" => (float)$TodaysPerformMandays,
				"MTDPerformMandays" => (float)$MTDPerformMandays,
				"TodaysRevenue" => (float)$TodaysRevenue,
				"MTDRevenue" => (float)$MTDRevenue,
				"TargetRevenue" => (float)$TargetRevenue
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}
