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

		$StartDate = trim($data->StartDate);
		$EndDate = trim($data->EndDate) . " 23-59-59";


		//OverdueDays =  this is only working days
		$query = "SELECT a.TransactionId AS id,c.FactoryName,e.ProgramName,f.UserName as CoordinatorName,
		g.AuditStageName,i.BuyerName,a.AssessmentNo,a.AuditStartDate,a.AuditEndDate,
		j.AuditorName as ReportWriter,a.ReportReceivedDate,	k.UserName as LocalReviewer,
		a.StandardTAT,a.ReleaseDate,
		(DATEDIFF(a.ReleaseDate, a.StandardTAT) - (SELECT COUNT(m.HolyDayId) FROM t_holiday m WHERE m.DayType ='holiday' AND m.HoliDate BETWEEN a.StandardTAT AND a.ReleaseDate)) as OverdueDays

	   FROM `t_transaction` a
	   LEFT JOIN `t_factory` c ON a.`FactoryId` = c.`FactoryId`
	   LEFT JOIN `t_program` e ON a.`ProgramId` = e.`ProgramId`
	   LEFT JOIN `t_users` f ON a.`CoordinatorId` = f.`UserId`
	   LEFT JOIN `t_auditstage` g ON a.`AuditStageId` = g.`AuditStageId`
	   LEFT JOIN `t_buyer` i ON a.`BuyerId` = i.`BuyerId`
	   LEFT JOIN `t_auditor` j ON a.`ReportWriterId` = j.`AuditorId`
	   LEFT JOIN `t_users` k ON a.`LocalReviewerId` = k.`UserId`
		where a.StandardTAT is not null 
		and a.ReleaseDate is not null 
		and a.ReleaseDate > a.StandardTAT
		and (a.ReleaseDate between '$StartDate' and '$EndDate')
		ORDER BY a.`ReleaseDate` ASC;";

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
