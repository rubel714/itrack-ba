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
		a.Window,a.WindowEnd, a.PaymentStatus, a.ReportWriterId, a.NoOfEmployee, a.AuditFee, a.OPE,a.OthersAmount, a.PINo, a.RevenueBDT, 
		a.AttachedDocuments, a.IsSendMail, a.ReportReleaseStatus,

		a.InvoiceTo, a.NameofApplicant, a.InvoiceAddress, a.InvoiceEmail, a.InvoiceMobile, a.Discount
		 ,a.IsReportReceivedFromWriter,a.ReportReceivedDate,a.`LocalReviewerId`,q.UserName as LocalReviewer,
		 a.StandardTAT,a.StrategicTAT, a.`ReportReleasedStatusId`,r.ReportReleasedStatus,
		 a.OverseasSendingDate,a.AuditorLogInTime,a.AduditorLogOutTime,a.ReportResult
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
	   
	   LEFT JOIN `t_users` q ON a.`LocalReviewerId` = q.`UserId`
	   LEFT JOIN `t_releasedstatus` r ON a.`ReportReleasedStatusId` = r.`ReportReleasedStatusId`
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

		$IsReportReceivedFromWriter = $data->rowData->IsReportReceivedFromWriter ? $data->rowData->IsReportReceivedFromWriter : null;
		$ReportReceivedDate = $data->rowData->ReportReceivedDate ? $data->rowData->ReportReceivedDate : null;
		$LocalReviewerId = $data->rowData->LocalReviewerId ? $data->rowData->LocalReviewerId : null;
		$StandardTAT = $data->rowData->StandardTAT ? $data->rowData->StandardTAT : null;
		$StrategicTAT = $data->rowData->StrategicTAT ? $data->rowData->StrategicTAT : null;
		$ReportReleaseStatus = $data->rowData->ReportReleaseStatus ? $data->rowData->ReportReleaseStatus : null;
		$ReportReleasedStatusId = $data->rowData->ReportReleasedStatusId ? $data->rowData->ReportReleasedStatusId : null;
		$OverseasSendingDate = $data->rowData->OverseasSendingDate ? $data->rowData->OverseasSendingDate : null;
		$AuditorLogInTime = $data->rowData->AuditorLogInTime ? $data->rowData->AuditorLogInTime : null;
		$AduditorLogOutTime = $data->rowData->AduditorLogOutTime ? $data->rowData->AduditorLogOutTime : null;
		$ReportResult = $data->rowData->ReportResult ? $data->rowData->ReportResult : null;
		
		try {
			$aQuerys = array();

			$u = new updateq();
			$u->table = 't_transaction';
			$u->columns = ['IsReportReceivedFromWriter','ReportReceivedDate','LocalReviewerId','StandardTAT','StrategicTAT','ReportReleaseStatus','ReportReleasedStatusId','OverseasSendingDate','AuditorLogInTime','AduditorLogOutTime','ReportResult'];
			$u->values = [$IsReportReceivedFromWriter,$ReportReceivedDate,$LocalReviewerId,$StandardTAT,$StrategicTAT,$ReportReleaseStatus,$ReportReleasedStatusId,$OverseasSendingDate,$AuditorLogInTime,$AduditorLogOutTime,$ReportResult];
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




// function ConvertFile($base64_string, $prefix, $extention = null)
// {

// 	$path = "../../../image/transaction/" . $prefix;

// 	if (!file_exists($path)) {
// 		mkdir($path, 0777, true);
// 	}

// 	$targetDir = '../../../image/transaction/' . $prefix;
// 	$exploded = explode(',', $base64_string, 2);
// 	if (!$extention) {
// 		$extention = explode(';', explode('/', $exploded[0])[1])[0];
// 	}
// 	$decoded = base64_decode($exploded[1]);
// 	$output_file = $prefix . "_cover_" . date("Y_m_d_H_i_s") . "_" . rand(1, 9999) . "." . $extention;
// 	file_put_contents($targetDir . "/" . $output_file, $decoded);
// 	return $output_file;
// }


// function ConvertImage($base64_string, $prefix)
// {

// 	$path = "../../../image/transaction/" . $prefix;

// 	if (!file_exists($path)) {
// 		mkdir($path, 0777, true);
// 	}

// 	$targetDir = '../../../image/transaction/' . $prefix;
// 	$exploded = explode(',', $base64_string, 2);
// 	$extention = explode(';', explode('/', $exploded[0])[1])[0];
// 	$decoded = base64_decode($exploded[1]);
// 	$output_file = $prefix . "_" . date("Y_m_d_H_i_s") . "_" . rand(1, 9999) . "." . $extention;
// 	// $output_file = date("Y_m_d_H_i_s") . rand(1, 9999) . "." . $extention;
// 	/**Image file name */
// 	file_put_contents($targetDir . "/" . $output_file, $decoded);
// 	return $output_file;
// }
