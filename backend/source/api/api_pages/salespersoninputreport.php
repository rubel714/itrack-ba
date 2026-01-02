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

		$query = "SELECT a.TransactionId AS id,a.TransactionTypeId,DATE(a.`TransactionDate`) TransactionDate,
		a.InvoiceNo,a.ActivityId,b.ActivityName,a.FactoryId,c.FactoryName,
		a.FactoryAddress,a.FactoryContactPerson,a.FactoryContactPersonPhone,a.FactoryContactPersonEmail,a.StateId,
		d.FactoryGroupName,	a.ProgramId,e.ProgramName,a.ExpireDate,a.OpportunityDate,a.TentativeOfferPrice,
		a.CertificateBody,a.CoordinatorId,f.UserName as CoordinatorName, a.AuditStageId, g.AuditStageName,
		a.LeadStatusId, h.LeadStatusName,a.ManDay,a.BuyerId,i.BuyerName,a.NextFollowupDate,
		a.DepartmentId,j.DepartmentName,a.MemberId,k.MemberName,a.Remarks,a.StatusId, a.StatusId as CurrStatusId
		,l.UserName as SalesEntryUserName,a.Comments,m.StateName
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
	   LEFT JOIN `t_users` l ON a.`UserId` = l.`UserId`
	   LEFT JOIN `t_state` m ON a.`StateId` = m.`StateId`
		where (a.TransactionDate between '$StartDate' and '$EndDate')
		ORDER BY a.`TransactionDate` DESC, a.InvoiceNo ASC;";

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

