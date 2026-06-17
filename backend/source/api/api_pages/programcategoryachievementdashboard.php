<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{
	try {
		$dbh = new Db();

		$YearId   = isset($data->YearName) ? (int)$data->YearName : (int)date('Y');
		$MonthId  = isset($data->MonthId)  ? (int)$data->MonthId  : (int)date('n');
		$PYYearId = $YearId - 1;

		// Remarks: 'New' = New Certification, 'Re-Certificate' = Re-Certification
		// All t_transaction rows exclude LeadStatusId IN (9,11)
		// MTD Performed : LeadStatusId IN (5,14,12,13,15,16,20,17)
		// CM Scheduled  : LeadStatusId = 19
		// CM Confirmed  : LeadStatusId = 2
		// In-progress   : LeadStatusId = 1  (all time)
		// Pipeline      : LeadStatusId = 7  (all time)
		// Join path     : t_programcategory → t_program → t_transaction
		$query = "
			SELECT
				pc.ProgramCategoryId,
				pc.ProgramCategoryName,

				-- Budget CM (from t_programcategory_wise_target for selected month/year)
				COALESCE(pct.ReCertification, 0)    AS BudgetCMReCert,
				COALESCE(pct.NewCertification, 0)   AS BudgetCMNewCert,
				COALESCE(pct.TotalCertification, 0) AS BudgetCMTotal,

				-- Actual PY: same month, previous year (exclude LeadStatusId IN 9,11)
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND YEAR(t.AuditStartDate) = $PYYearId
					          AND MONTH(t.AuditStartDate) = $MonthId
					          AND t.Remarks = 'Re-Certificate'
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS ActualPYReCert,
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND YEAR(t.AuditStartDate) = $PYYearId
					          AND MONTH(t.AuditStartDate) = $MonthId
					          AND t.Remarks = 'New'
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS ActualPYNewCert,
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND YEAR(t.AuditStartDate) = $PYYearId
					          AND MONTH(t.AuditStartDate) = $MonthId
					          AND t.Remarks IN ('New','Re-Certificate')
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS ActualPYTotal,

				-- MTD Performed: LeadStatusId IN (5,14,12,13,15,16,20,17), selected month/year
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND YEAR(t.AuditStartDate) = $YearId
					          AND MONTH(t.AuditStartDate) = $MonthId
					          AND t.LeadStatusId IN (5,14,12,13,15,16,20,17)
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS MTDPerformed,

				-- CM Scheduled: LeadStatusId = 19, selected month/year
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND YEAR(t.AuditStartDate) = $YearId
					          AND MONTH(t.AuditStartDate) = $MonthId
					          AND t.LeadStatusId = 19
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS CMScheduled,

				-- CM Confirmed: LeadStatusId = 2, selected month/year
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND YEAR(t.AuditStartDate) = $YearId
					          AND MONTH(t.AuditStartDate) = $MonthId
					          AND t.LeadStatusId = 2
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS CMConfirmed,

				-- In-progress: LeadStatusId = 1, all time (no date filter)
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND t.LeadStatusId = 1
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS InProgress,

				-- Pipeline: LeadStatusId = 7, all time (no date filter)
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND t.LeadStatusId = 7
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS Pipeline,

				-- MTD Revenue (selected month/year, split by Remarks, exclude LeadStatusId IN 9,11)
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND YEAR(t.AuditStartDate) = $YearId
					          AND MONTH(t.AuditStartDate) = $MonthId
					          AND t.Remarks = 'Re-Certificate'
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS MTDRevenueReCert,
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND YEAR(t.AuditStartDate) = $YearId
					          AND MONTH(t.AuditStartDate) = $MonthId
					          AND t.Remarks = 'New'
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS MTDRevenueNewCert,
				COALESCE(SUM(
					CASE WHEN t.LeadStatusId NOT IN (9,11)
					          AND YEAR(t.AuditStartDate) = $YearId
					          AND MONTH(t.AuditStartDate) = $MonthId
					          AND t.Remarks IN ('New','Re-Certificate')
					THEN t.RevenueBDT ELSE 0 END
				), 0) AS MTDRevenueTotal

			FROM t_programcategory pc
			LEFT JOIN t_programcategory_wise_target pct
				ON pct.ProgramCategoryId = pc.ProgramCategoryId
				AND pct.YearId  = $YearId
				AND pct.MonthId = $MonthId
			LEFT JOIN t_program p
				ON p.ProgramCategoryId = pc.ProgramCategoryId
			LEFT JOIN t_transaction t
				ON t.ProgramId = p.ProgramId
			GROUP BY
				pc.ProgramCategoryId,
				pc.ProgramCategoryName,
				pct.ReCertification,
				pct.NewCertification,
				pct.TotalCertification
			ORDER BY pc.ProgramCategoryName ASC;
		";

		$resultdata = $dbh->query($query);

		$dataList = [];
		foreach ($resultdata as $row) {
			$budgetCMTotal   = (float)$row['BudgetCMTotal'];
			$mtdRevenueTotal = (float)$row['MTDRevenueTotal'];
			$mtgBudget       = $mtdRevenueTotal - $budgetCMTotal;
			$budgetVsMTDAch  = ($budgetCMTotal > 0)
				? round(($mtdRevenueTotal / $budgetCMTotal) * 100, 2)
				: 0;

			$dataList[] = [
				"ProgramCategoryId"    => (int)$row['ProgramCategoryId'],
				"ProgramCategoryName"  => $row['ProgramCategoryName'],
				"BudgetCMReCert"       => (float)$row['BudgetCMReCert'],
				"BudgetCMNewCert"      => (float)$row['BudgetCMNewCert'],
				"BudgetCMTotal"        => $budgetCMTotal,
				"ActualPYReCert"       => (float)$row['ActualPYReCert'],
				"ActualPYNewCert"      => (float)$row['ActualPYNewCert'],
				"ActualPYTotal"        => (float)$row['ActualPYTotal'],
				"LastDaysConfirmation" => 0,
				"MTDPerformed"         => (float)$row['MTDPerformed'],
				"CMScheduled"          => (float)$row['CMScheduled'],
				"CMConfirmed"          => (float)$row['CMConfirmed'],
				"InProgress"           => (float)$row['InProgress'],
				"Pipeline"             => (float)$row['Pipeline'],
				"MTDRevenueReCert"     => (float)$row['MTDRevenueReCert'],
				"MTDRevenueNewCert"    => (float)$row['MTDRevenueNewCert'],
				"MTDRevenueTotal"      => $mtdRevenueTotal,
				"MTGBudget"            => $mtgBudget,
				"BudgetVsMTDAch"       => $budgetVsMTDAch,
			];
		}

		$returnData = [
			"success"  => 1,
			"status"   => 200,
			"message"  => "",
			"datalist" => [
				"data" => $dataList
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}
