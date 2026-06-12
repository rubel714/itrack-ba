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
		$query = "
			SELECT
				m.MemberId,
				m.MemberName,
				COALESCE(mt.ReCertificationRevenueTarget, 0)  AS ReCertRevenueTarget,
				COALESCE(mt.NewCertificationRevenueTarget, 0) AS NewCertRevenueTarget,
				COALESCE(mt.RevenueTarget, 0)                 AS TotalRevenueTarget,
				COALESCE(SUM(
					CASE
						WHEN t.Remarks = 'Re-Certificate'
						THEN t.RevenueBDT
						ELSE 0
					END
				), 0) AS ReCertRevenueAchievement,
				COALESCE(SUM(
					CASE
						WHEN t.Remarks = 'New'
						THEN t.RevenueBDT
						ELSE 0
					END
				), 0) AS NewCertRevenueAchievement,
				COALESCE(SUM(
					CASE
						WHEN t.Remarks IN ('New', 'Re-Certificate')
						THEN t.RevenueBDT
						ELSE 0
					END
				), 0) AS TotalRevenueAchievement
			FROM t_member m
			LEFT JOIN t_member_target mt
				ON mt.MemberId = m.MemberId
				AND mt.YearId  = $YearId
				AND mt.MonthId = $MonthId
			LEFT JOIN t_transaction t
				ON t.MemberId = m.MemberId
				AND YEAR(t.AuditStartDate)  = $YearId
				AND MONTH(t.AuditStartDate) = $MonthId
			WHERE m.IsActive = 1
			GROUP BY
				m.MemberId,
				m.MemberName,
				mt.ReCertificationRevenueTarget,
				mt.NewCertificationRevenueTarget,
				mt.RevenueTarget
			ORDER BY m.MemberName ASC;
		";

		$resultdata = $dbh->query($query);

		$dataList = [];
		foreach ($resultdata as $row) {
			$dataList[] = [
				"MemberId"                  => (int)$row['MemberId'],
				"MemberName"                => $row['MemberName'],
				"ReCertRevenueTarget"       => (float)$row['ReCertRevenueTarget'],
				"NewCertRevenueTarget"      => (float)$row['NewCertRevenueTarget'],
				"TotalRevenueTarget"        => (float)$row['TotalRevenueTarget'],
				"ReCertRevenueAchievement"  => (float)$row['ReCertRevenueAchievement'],
				"NewCertRevenueAchievement" => (float)$row['NewCertRevenueAchievement'],
				"TotalRevenueAchievement"   => (float)$row['TotalRevenueAchievement'],
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
