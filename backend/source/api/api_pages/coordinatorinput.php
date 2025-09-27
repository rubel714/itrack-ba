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

		$query = "SELECT a.TransactionId AS id,a.TransactionTypeId,DATE(a.`TransactionDate`) TransactionDate,
		a.InvoiceNo,a.ActivityId,b.ActivityName,a.FactoryId,c.FactoryName,c.Address as FactoryAddress,d.FactoryGroupName,
		a.ProgramId,e.ProgramName,a.ExpireDate,a.OpportunityDate,a.TentativeOfferPrice,
		a.CertificateBody,a.CoordinatorId,f.UserName as CoordinatorName, a.AuditStageId, g.AuditStageName,
		a.LeadStatusId, h.LeadStatusName,a.ManDay,a.BuyerId,i.BuyerName,a.NextFollowupDate,
		a.DepartmentId,j.DepartmentName,a.MemberId,k.MemberName,a.Remarks
		, a.AssessmentNo, a.AuditStartDate, a.AuditEndDate, a.CountryId, a.LeadAuditorId, a.TeamAuditorId, a.AuditTypeId, 
		a.Window, a.PaymentStatus, a.ReportWriterId, a.NoOfEmployee, a.AuditFee, a.OPE, a.PINo, a.RevenueBDT, 
		a.AttachedDocuments, a.IsSendMail, a.ReportReleaseStatus
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

		$AssessmentNo = $data->rowData->AssessmentNo ? $data->rowData->AssessmentNo : null;
		$AuditStartDate = $data->rowData->AuditStartDate ? $data->rowData->AuditStartDate : null;
		$AuditEndDate = $data->rowData->AuditEndDate ? $data->rowData->AuditEndDate : null;
		$CountryId = $data->rowData->CountryId ? $data->rowData->CountryId : null;
		$LeadAuditorId = $data->rowData->LeadAuditorId ? $data->rowData->LeadAuditorId : null;
		$TeamAuditorId = $data->rowData->TeamAuditorId ? $data->rowData->TeamAuditorId : null;
		$AuditTypeId = $data->rowData->AuditTypeId ? $data->rowData->AuditTypeId : null;
		$Window = $data->rowData->Window ? $data->rowData->Window : null;
		$PaymentStatus = $data->rowData->PaymentStatus ? $data->rowData->PaymentStatus : "No";
		$ReportWriterId = $data->rowData->ReportWriterId ? $data->rowData->ReportWriterId : null;
		$NoOfEmployee = $data->rowData->NoOfEmployee ? $data->rowData->NoOfEmployee : null;
		$AuditFee = $data->rowData->AuditFee ? $data->rowData->AuditFee : null;
		$OPE = $data->rowData->OPE ? $data->rowData->OPE : null;
		$PINo = $data->rowData->PINo ? $data->rowData->PINo : null;
		$RevenueBDT = $data->rowData->RevenueBDT ? $data->rowData->RevenueBDT : null;
		$AttachedDocuments = $data->rowData->AttachedDocuments ? $data->rowData->AttachedDocuments : null;
		$IsSendMail = $data->rowData->IsSendMail ? $data->rowData->IsSendMail : 0;
		$ReportReleaseStatus = $data->rowData->ReportReleaseStatus ? $data->rowData->ReportReleaseStatus : "No";

		try {
			$aQuerys = array();

			$u = new updateq();
			$u->table = 't_transaction';
			$u->columns = ["AssessmentNo", "AuditStartDate", "AuditEndDate", "CountryId", "LeadAuditorId", "TeamAuditorId", "AuditTypeId", "Window", "PaymentStatus", "ReportWriterId", "NoOfEmployee", "AuditFee", "OPE", "PINo", "RevenueBDT", "AttachedDocuments", "IsSendMail", "ReportReleaseStatus"];
			$u->values = [$AssessmentNo,$AuditStartDate,$AuditEndDate,$CountryId,$LeadAuditorId,$TeamAuditorId,$AuditTypeId,$Window,$PaymentStatus,$ReportWriterId,$NoOfEmployee,$AuditFee,$OPE,$PINo,$RevenueBDT,$AttachedDocuments,$IsSendMail,$ReportReleaseStatus];
			$u->pks = ['TransactionId'];
			$u->pk_values = [$id];
			$u->build_query();
			$aQuerys[] = $u;

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
