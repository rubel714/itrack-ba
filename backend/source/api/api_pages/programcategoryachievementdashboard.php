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

		$YearId  = isset($data->YearName) ? (int)$data->YearName : (int)date('Y');
		$MonthId = isset($data->MonthId)  ? (int)$data->MonthId  : (int)date('n');

		// Achievement classification uses t_transaction.Remarks:
		//   Remarks = 'New'            → New Certification
		//   Remarks = 'Re-Certificate' → Re-Certification
		// t_transaction links to t_programcategory via t_program.ProgramCategoryId
		$query = "
			SELECT
				pc.ProgramCategoryId,
				pc.ProgramCategoryName,
				COALESCE(pct.ReCertification, 0)    AS ReCertTarget,
				COALESCE(pct.NewCertification, 0)   AS NewCertTarget,
				COALESCE(pct.TotalCertification, 0) AS TotalCertTarget,
				COALESCE(SUM(
					CASE
						WHEN t.Remarks = 'Re-Certificate'
						THEN t.RevenueBDT
						ELSE 0
					END
				), 0) AS ReCertAchievement,
				COALESCE(SUM(
					CASE
						WHEN t.Remarks = 'New'
						THEN t.RevenueBDT
						ELSE 0
					END
				), 0) AS NewCertAchievement,
				COALESCE(SUM(
					CASE
						WHEN t.Remarks IN ('New', 'Re-Certificate')
						THEN t.RevenueBDT
						ELSE 0
					END
				), 0) AS TotalCertAchievement
			FROM t_programcategory pc
			LEFT JOIN t_programcategory_wise_target pct
				ON pct.ProgramCategoryId = pc.ProgramCategoryId
				AND pct.YearId  = $YearId
				AND pct.MonthId = $MonthId
			LEFT JOIN t_program p
				ON p.ProgramCategoryId = pc.ProgramCategoryId
			LEFT JOIN t_transaction t
				ON t.ProgramId = p.ProgramId
				AND YEAR(t.AuditStartDate)  = $YearId
				AND MONTH(t.AuditStartDate) = $MonthId
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
			$dataList[] = [
				"ProgramCategoryId"    => (int)$row['ProgramCategoryId'],
				"ProgramCategoryName"  => $row['ProgramCategoryName'],
				"ReCertTarget"         => (int)$row['ReCertTarget'],
				"NewCertTarget"        => (int)$row['NewCertTarget'],
				"TotalCertTarget"      => (int)$row['TotalCertTarget'],
				"ReCertAchievement"    => (float)$row['ReCertAchievement'],
				"NewCertAchievement"   => (float)$row['NewCertAchievement'],
				"TotalCertAchievement" => (float)$row['TotalCertAchievement'],
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
