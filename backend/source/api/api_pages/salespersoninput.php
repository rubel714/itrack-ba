<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;
	case "dataAddEdit":
		$returnData = dataAddEdit($data);
		break;
	case "deleteData":
		$returnData = deleteData($data);
		break;
	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{
	try {
		$dbh = new Db();
		$UserId = trim($data->UserId);
		$RoleId = trim($data->RoleId);
		if ($RoleId == 1) {
			$UserId = 0;
		}

		$query = "SELECT a.TransactionId AS id,a.TransactionTypeId,DATE(a.`TransactionDate`) TransactionDate,
		a.InvoiceNo,a.ActivityId,b.ActivityName,a.FactoryId,c.FactoryName,
		a.FactoryAddress,a.FactoryContactPerson,a.FactoryContactPersonPhone,a.FactoryContactPersonEmail,a.StateId,
		d.FactoryGroupName,	a.ProgramId,e.ProgramName,a.ExpireDate,a.OpportunityDate,a.TentativeOfferPrice,
		a.CertificateBody,a.CoordinatorId,f.UserName as CoordinatorName, a.AuditStageId, g.AuditStageName,
		a.LeadStatusId, h.LeadStatusName,a.ManDay,a.BuyerId,i.BuyerName,a.NextFollowupDate,
		a.DepartmentId,j.DepartmentName,a.MemberId,k.MemberName,a.Remarks,a.StatusId, a.StatusId as CurrStatusId
		,l.UserName as SalesEntryUserName,a.Comments
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
	   Where (a.UserId = $UserId OR $UserId=0)
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


function dataAddEdit($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	} else {

		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		$id = $data->rowData->id;
		$TransactionTypeId = $data->rowData->TransactionTypeId;
		$InvoiceNo = time(); // $data->rowData->InvoiceNo;
		$TransactionDate = $data->rowData->TransactionDate;
		$ActivityId = $data->rowData->ActivityId;
		$FactoryId = $data->rowData->FactoryId;
		$FactoryAddress = $data->rowData->FactoryAddress ? $data->rowData->FactoryAddress : null;
		$FactoryContactPerson = $data->rowData->FactoryContactPerson ? $data->rowData->FactoryContactPerson : null;
		$FactoryContactPersonPhone = $data->rowData->FactoryContactPersonPhone ? $data->rowData->FactoryContactPersonPhone : null;
		$FactoryContactPersonEmail = $data->rowData->FactoryContactPersonEmail ? $data->rowData->FactoryContactPersonEmail : null;
		$StateId = $data->rowData->StateId ? $data->rowData->StateId : null;

		$ProgramId = $data->rowData->ProgramId;
		$ExpireDate = $data->rowData->ExpireDate ? $data->rowData->ExpireDate : null;
		$OpportunityDate = $data->rowData->OpportunityDate ? $data->rowData->OpportunityDate : null;
		$TentativeOfferPrice = $data->rowData->TentativeOfferPrice ? $data->rowData->TentativeOfferPrice : null;
		$CertificateBody = $data->rowData->CertificateBody ? $data->rowData->CertificateBody : null;
		$CoordinatorId = $data->rowData->CoordinatorId ? $data->rowData->CoordinatorId : null;
		$AuditStageId = $data->rowData->AuditStageId ? $data->rowData->AuditStageId : null;
		$LeadStatusId = $data->rowData->LeadStatusId ? $data->rowData->LeadStatusId : null;
		$ManDay = $data->rowData->ManDay ? $data->rowData->ManDay : null;
		$BuyerId = $data->rowData->BuyerId ? $data->rowData->BuyerId : null;
		$NextFollowupDate = $data->rowData->NextFollowupDate ? $data->rowData->NextFollowupDate : null;
		$DepartmentId = $data->rowData->DepartmentId ? $data->rowData->DepartmentId : null;
		$MemberId = $data->rowData->MemberId ? $data->rowData->MemberId : null;
		$Remarks = $data->rowData->Remarks ? $data->rowData->Remarks : null;
		$Comments = $data->rowData->Comments ? $data->rowData->Comments : null;
		$StatusId = $data->rowData->StatusId ? $data->rowData->StatusId : 1;
		$CurrStatusId = $data->rowData->CurrStatusId ? $data->rowData->CurrStatusId : 1;
		// $StatusId = 1;



		try {
			$aQuerys = array();
			if ($id == "") {
				$q = new insertq();
				$q->table = 't_transaction';
				$q->columns = ['TransactionTypeId', 'TransactionDate', 'InvoiceNo', 'ActivityId', 'FactoryId','FactoryAddress',
				'FactoryContactPerson',
				'FactoryContactPersonPhone',
				'FactoryContactPersonEmail','StateId', 'ProgramId', 'ExpireDate', 'OpportunityDate', 'TentativeOfferPrice', 'CertificateBody', 'CoordinatorId', 'AuditStageId', 'LeadStatusId', 'ManDay', 'BuyerId', 'NextFollowupDate', 'DepartmentId', 'MemberId', 'Remarks','Comments', 'UserId', 'LastSalesInputUpdateUserId', 'StatusId', 'LastUpdateUserId'];
				$q->values = [$TransactionTypeId, $TransactionDate, $InvoiceNo, $ActivityId, $FactoryId,$FactoryAddress,
				$FactoryContactPerson,
				$FactoryContactPersonPhone,
				$FactoryContactPersonEmail, $StateId, $ProgramId, $ExpireDate, $OpportunityDate, $TentativeOfferPrice, $CertificateBody, $CoordinatorId, $AuditStageId, $LeadStatusId, $ManDay, $BuyerId, $NextFollowupDate, $DepartmentId, $MemberId, $Remarks, $Comments, $UserId, $UserId, $CurrStatusId, $UserId];
				$q->pks = ['TransactionId'];
				$q->bUseInsetId = true;
				$q->build_query();
				$aQuerys[] = $q;
			} else {
				$u = new updateq();
				$u->table = 't_transaction';
				$u->columns = ['ActivityId', 'FactoryId','FactoryAddress','FactoryContactPerson','FactoryContactPersonPhone','FactoryContactPersonEmail','StateId', 'ProgramId', 'ExpireDate', 'OpportunityDate', 'TentativeOfferPrice', 'CertificateBody', 'CoordinatorId', 'AuditStageId', 'LeadStatusId', 'ManDay', 'BuyerId', 'NextFollowupDate', 'DepartmentId', 'MemberId', 'Remarks','Comments', 'LastSalesInputUpdateUserId', 'LastUpdateUserId', 'StatusId'];
				$u->values = [$ActivityId, $FactoryId,$FactoryAddress,$FactoryContactPerson,$FactoryContactPersonPhone,$FactoryContactPersonEmail, $StateId, $ProgramId, $ExpireDate, $OpportunityDate, $TentativeOfferPrice, $CertificateBody, $CoordinatorId, $AuditStageId, $LeadStatusId, $ManDay, $BuyerId, $NextFollowupDate, $DepartmentId, $MemberId, $Remarks, $Comments, $UserId, $UserId, $CurrStatusId];
				$u->pks = ['TransactionId'];
				$u->pk_values = [$id];
				$u->build_query();
				$aQuerys[] = $u;
			}

			$res = exec_query($aQuerys, $UserId, $lan);
			$success = ($res['msgType'] == 'success') ? 1 : 0;
			$status = ($res['msgType'] == 'success') ? 200 : 500;

			$returnData = [
				"success" => $success,
				"status" => $status,
				"UserId" => $UserId,
				"message" => $res['msg']
			];
		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}

		return $returnData;
	}
}




function deleteData($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif (!isset($data->rowData->id)) {
		$fields = ['fields' => ['id']];
		return $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
	} else {

		$id = $data->rowData->id;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		try {

			$dbh = new Db();

			// $d = new deleteq();
			// $d->table = 't_transaction_items';
			// $d->pks = ['TransactionId'];
			// $d->pk_values = [$id];
			// $d->build_query();
			// $aQuerys[] = $d;

			$d = new deleteq();
			$d->table = 't_transaction';
			$d->pks = ['TransactionId'];
			$d->pk_values = [$id];
			$d->build_query();
			$aQuerys[] = $d;

			$res = exec_query($aQuerys, $UserId, $lan);
			$success = ($res['msgType'] == 'success') ? 1 : 0;
			$status = ($res['msgType'] == 'success') ? 200 : 500;

			$returnData = [
				"success" => $success,
				"status" => $status,
				"UserId" => $UserId,
				"message" => $res['msg']
			];
		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}

		return $returnData;
	}
}




function ConvertFile($base64_string, $prefix, $extention = null)
{

	$path = "../../../image/transaction/" . $prefix;

	if (!file_exists($path)) {
		mkdir($path, 0777, true);
	}

	$targetDir = '../../../image/transaction/' . $prefix;
	$exploded = explode(',', $base64_string, 2);
	if (!$extention) {
		$extention = explode(';', explode('/', $exploded[0])[1])[0];
	}
	$decoded = base64_decode($exploded[1]);
	$output_file = $prefix . "_cover_" . date("Y_m_d_H_i_s") . "_" . rand(1, 9999) . "." . $extention;
	file_put_contents($targetDir . "/" . $output_file, $decoded);
	return $output_file;
}


function ConvertImage($base64_string, $prefix)
{

	$path = "../../../image/transaction/" . $prefix;

	if (!file_exists($path)) {
		mkdir($path, 0777, true);
	}

	$targetDir = '../../../image/transaction/' . $prefix;
	$exploded = explode(',', $base64_string, 2);
	$extention = explode(';', explode('/', $exploded[0])[1])[0];
	$decoded = base64_decode($exploded[1]);
	$output_file = $prefix . "_" . date("Y_m_d_H_i_s") . "_" . rand(1, 9999) . "." . $extention;
	// $output_file = date("Y_m_d_H_i_s") . rand(1, 9999) . "." . $extention;
	/**Image file name */
	file_put_contents($targetDir . "/" . $output_file, $decoded);
	return $output_file;
}
