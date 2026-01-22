<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;
	case "getMemberDateAssignDataList":
		$returnData = getMemberDateAssignDataList($data);
		break;
	case "dataAddEdit":
		$returnData = dataAddEdit($data);
		break;
	case "MemberDateAssignDataAddEdit":
		$returnData = MemberDateAssignDataAddEdit($data);
		break;
	case "deleteData":
		$returnData = deleteData($data);
		break;
	case "deleteMemberDateAssignData":
		$returnData = deleteMemberDateAssignData($data);
		break;


	case "FilesUpload":
		$returnData = FilesUpload($data);
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

		$StartDate = trim($data->StartDate);
		$EndDate = trim($data->EndDate) . " 23-59-59";
		
		//REPLACE(a.TeamAuditorIds, '" . '"' . "', '') as TeamAuditorId,
		
		$query = "SELECT a.TransactionId AS id,a.TransactionTypeId,DATE(a.`TransactionDate`) TransactionDate,
		a.InvoiceNo,a.ActivityId,b.ActivityName,a.FactoryId,c.FactoryName,
		a.FactoryAddress,a.FactoryContactPerson,a.FactoryContactPersonPhone,a.FactoryContactPersonEmail,ifnull(a.FactoryHoliday,'') FactoryHoliday,		
		d.FactoryGroupName,	a.ProgramId,e.ProgramName,a.ExpireDate,a.OpportunityDate,a.TentativeOfferPrice,
		a.CertificateBody,a.CoordinatorId,f.UserName as CoordinatorName, a.AuditStageId, g.AuditStageName,
		a.LeadStatusId, h.LeadStatusName,a.ManDay,a.BuyerId,i.BuyerName,a.NextFollowupDate,
		a.DepartmentId,j.DepartmentName,a.MemberId,k.MemberName,a.Remarks,a.Comments,l.UserName as SalesEntryUserName
		, a.AssessmentNo, a.AuditStartDate, a.AuditEndDate, a.CountryId, a.LeadAuditorId, 
		
		(SELECT CONCAT('[',IFNULL(GROUP_CONCAT(`AuditorId`),''),']')  FROM `t_transaction_auditor_assign` m 
		WHERE m.`TransactionId` = a.`TransactionId`) TeamAuditorId,
	
		
		a.AuditTypeId, 
		a.Window,a.WindowEnd, a.PaymentStatus, a.ReportWriterId,a.ReportWritingDate, a.NoOfEmployee, a.AuditFee, a.OPE,a.OthersAmount, a.PINo, a.RevenueBDT, 
		a.AuditBook, a.AttachedDocuments, a.IsSendMail,a.StateId,m.StateName,a.FileUploaded,a.ReportSentToCustomer,a.Discount
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

	   where ((a.AuditStartDate between '$StartDate' and '$EndDate') OR (a.AuditStartDate is null))
	   AND a.StatusId = 5
	   AND (a.CoordinatorId = $UserId OR $UserId=0)
	   ORDER BY a.`TransactionDate` DESC, a.InvoiceNo ASC;";

		$resultdata = $dbh->query($query);

		$dList = array();
		foreach ($resultdata as $key => $obj) {
			$obj['AttachedDocuments'] = json_decode($obj['AttachedDocuments']);

			// [8,11,46]


			$dList[] = $obj;
		}

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dList
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function getMemberDateAssignDataList($data)
{
	try {
		$dbh = new Db();

		$TransactionId = trim($data->TransactionId);

		$query = "SELECT a.`Id`, a.`TransactionId`, a.`AuditorId`, DATE(a.`AssignDate`) as `AssignDate`, a.`StartTime`, a.`EndTime`,b.AuditorName
	   FROM `t_transaction_auditor_assign` a
	   INNER JOIN `t_auditor` b ON a.`AuditorId` = b.`AuditorId`

	   where a.TransactionId = $TransactionId
	   ORDER BY a.`AssignDate` ASC, a.`Id` ASC;";
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
		$dbh = new Db();

		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		$id = $data->rowData->id;


		//////////////////////////////////Sales input//////////////////////////////////////////////
		$ActivityId = $data->rowData->ActivityId;
		$FactoryId = $data->rowData->FactoryId;
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

		////////////////////////////////////Co ordinator////////////////////////////////////////////////////

		$FactoryAddress = $data->rowData->FactoryAddress ? $data->rowData->FactoryAddress : null;
		$FactoryContactPerson = $data->rowData->FactoryContactPerson ? $data->rowData->FactoryContactPerson : null;
		$FactoryContactPersonPhone = $data->rowData->FactoryContactPersonPhone ? $data->rowData->FactoryContactPersonPhone : null;
		$FactoryContactPersonEmail = $data->rowData->FactoryContactPersonEmail ? $data->rowData->FactoryContactPersonEmail : null;
		$FactoryHoliday = $data->rowData->FactoryHoliday ? $data->rowData->FactoryHoliday : null;

		$AssessmentNo = $data->rowData->AssessmentNo ? $data->rowData->AssessmentNo : null;
		$AuditStartDate = $data->rowData->AuditStartDate ? $data->rowData->AuditStartDate : null;
		$AuditEndDate = $data->rowData->AuditEndDate ? $data->rowData->AuditEndDate : null;
		$CountryId = $data->rowData->CountryId ? $data->rowData->CountryId : null;
		$LeadAuditorId = $data->rowData->LeadAuditorId ? $data->rowData->LeadAuditorId : null;
		// $TeamAuditorId = $data->rowData->TeamAuditorId ? $data->rowData->TeamAuditorId : null;
		$TeamAuditorId = $data->rowData->TeamAuditorId ? $data->rowData->TeamAuditorId : [];
		$AuditTypeId = $data->rowData->AuditTypeId ? $data->rowData->AuditTypeId : null;
		$Window = $data->rowData->Window ? $data->rowData->Window : null;
		$WindowEnd = $data->rowData->WindowEnd ? $data->rowData->WindowEnd : null;
		$PaymentStatus = $data->rowData->PaymentStatus ? $data->rowData->PaymentStatus : "No";
		$ReportWriterId = $data->rowData->ReportWriterId ? $data->rowData->ReportWriterId : null;
		$ReportWritingDate = $data->rowData->ReportWritingDate ? $data->rowData->ReportWritingDate : null;
		$NoOfEmployee = $data->rowData->NoOfEmployee ? $data->rowData->NoOfEmployee : null;
		$AuditFee = $data->rowData->AuditFee ? $data->rowData->AuditFee : null;
		$OPE = $data->rowData->OPE ? $data->rowData->OPE : null;
		$OthersAmount = $data->rowData->OthersAmount ? $data->rowData->OthersAmount : null;
		$PINo = $data->rowData->PINo ? $data->rowData->PINo : null;
		$RevenueBDT = $data->rowData->RevenueBDT ? $data->rowData->RevenueBDT : null;
		$Discount = $data->rowData->Discount ? $data->rowData->Discount : null;
		$AttachedDocuments = $data->rowData->AttachedDocuments ? $data->rowData->AttachedDocuments : [];
		$IsSendMail = $data->rowData->IsSendMail ? $data->rowData->IsSendMail : 0;
		$StateId = $data->rowData->StateId ? $data->rowData->StateId : null;
		$FileUploaded = $data->rowData->FileUploaded ? $data->rowData->FileUploaded : 0;
		$ReportSentToCustomer = $data->rowData->ReportSentToCustomer ? $data->rowData->ReportSentToCustomer : 0;
		$AuditBook = $data->rowData->AuditBook ? $data->rowData->AuditBook : "No";

		// $ReportReleaseStatus = $data->rowData->ReportReleaseStatus ? $data->rowData->ReportReleaseStatus : "No";


		$StandardTAT = date("Y-m-d");
		$StrategicTAT = date("Y-m-d");

		if ($AuditEndDate) {
			$sql = "select TATDayTypeId, ifnull(StandardTATDay,1) StandardTATDay, ifnull(StrategiceTATDay,1) StrategiceTATDay 
			from t_program where ProgramId=$ProgramId";
			$resultdata = $dbh->query($sql);
			$TATDayTypeId = $resultdata[0]['TATDayTypeId'];	//1=Calendar, 2=Working
			$StandardTATDay = $resultdata[0]['StandardTATDay'];
			$StrategiceTATDay = $resultdata[0]['StrategiceTATDay'];

			if ($TATDayTypeId == 1) {
				//Calendar day
				$StandardTATDate = date_create($AuditEndDate);
				date_add($StandardTATDate, date_interval_create_from_date_string("$StandardTATDay days"));
				$StandardTAT = date_format($StandardTATDate, "Y-m-d");

				$StrategicTATDate = date_create($AuditEndDate);
				date_add($StrategicTATDate, date_interval_create_from_date_string("$StrategiceTATDay days"));
				$StrategicTAT = date_format($StrategicTATDate, "Y-m-d");
			} else if ($TATDayTypeId == 2) {
				//working day

				//================== Start for StandardTATDay==========================
				$date = $AuditEndDate; // date('Y-m-d');
				$workingDays = 1;
				$dayCount = 0;
				while ($workingDays <= $StandardTATDay) {
					$dayCount++;

					// Move to next day
					$date = date('Y-m-d', strtotime($date . ' +1 day'));

					// Check if weekend
					// $dayOfWeek = date('N', strtotime($date)); // 6 = Saturday, 7 = Sunday
					// if ($dayOfWeek == 6 || $dayOfWeek == 7) {
					// 	continue;
					// }

					// Check if holiday
					// $sql = "SELECT COUNT(*) as cnt FROM holidays WHERE HoliDate = '$date'";
					// $result = $conn->query($sql);
					// $row = $result->fetch_assoc();

					$sql = "select COUNT(*) as cnt	from t_holiday where DayType='holiday' and HoliDate = '$date';";
					$resultdata1 = $dbh->query($sql);
					if ($resultdata1[0]['cnt'] > 0) {
						continue; // skip holiday
					}

					// Count valid working day
					$workingDays++;
				}

				$StandardTATDate = date_create($AuditEndDate);
				date_add($StandardTATDate, date_interval_create_from_date_string("$dayCount days"));
				$StandardTAT = date_format($StandardTATDate, "Y-m-d");
				//================== End for StandardTATDay==========================




				//================== Start for StrategicTAT==========================
				$date = $AuditEndDate; // date('Y-m-d');
				$workingDays = 1;
				$dayCount = 0;
				while ($workingDays <= $StrategiceTATDay) {
					$dayCount++;

					// Move to next day
					$date = date('Y-m-d', strtotime($date . ' +1 day'));

					// Check if weekend
					// $dayOfWeek = date('N', strtotime($date)); // 6 = Saturday, 7 = Sunday
					// if ($dayOfWeek == 6 || $dayOfWeek == 7) {
					// 	continue;
					// }

					// Check if holiday
					// $sql = "SELECT COUNT(*) as cnt FROM holidays WHERE HoliDate = '$date'";
					// $result = $conn->query($sql);
					// $row = $result->fetch_assoc();

					$sql = "select COUNT(*) as cnt	from t_holiday where HoliDate = '$date';";
					$resultdata1 = $dbh->query($sql);
					if ($resultdata1[0]['cnt'] > 0) {
						continue; // skip holiday
					}

					// Count valid working day
					$workingDays++;
				}

				$StrategicTATDate = date_create($AuditEndDate);
				date_add($StrategicTATDate, date_interval_create_from_date_string("$dayCount days"));
				$StrategicTAT = date_format($StrategicTATDate, "Y-m-d");
				//================== End for StrategicTAT==========================


				// echo "StandardTAT: $StandardTAT, StrategicTAT: $StrategicTAT";
			}
		}

		if ($AuditStartDate && $AuditEndDate) {

			$$ids = [];
			if (is_string($TeamAuditorId)) {
				$ids = json_decode($TeamAuditorId);
			} else {
				$ids = (array)$TeamAuditorId;
			}


			if ($LeadAuditorId) {
				$ids[] = $LeadAuditorId;
			}

			$ids = array_unique($ids);

			$DupMsg = "";
			foreach ($ids as $TAuditorId) {
				if ($TAuditorId == "[]") {
					continue;
				}
				$query = "
					 SELECT a.TransactionId,b.ProgramName,c.FactoryName,a.AuditStartDate,a.AuditEndDate
					FROM t_transaction a
					inner join t_program b on a.ProgramId = b.ProgramId
					inner join t_factory c on a.FactoryId = c.FactoryId
					where a.TransactionId !=$id 
					AND a.AuditStartDate <= '$AuditEndDate'
					AND a.AuditEndDate >='$AuditStartDate'
					AND a.LeadAuditorId = '$TAuditorId'

					union all
					 
					 SELECT a.TransactionId,b.ProgramName,c.FactoryName,a.AuditStartDate,a.AuditEndDate
					FROM t_transaction a
					inner join t_program b on a.ProgramId = b.ProgramId
					inner join t_factory c on a.FactoryId = c.FactoryId
					where a.TransactionId !=$id 
					AND a.AuditStartDate <= '$AuditEndDate'
					AND a.AuditEndDate >='$AuditStartDate'
					AND JSON_CONTAINS(REPLACE(a.TeamAuditorIds, '" . '"' . "', ''), '$TAuditorId');";

				$resultdata = $dbh->query($query);
				if (count($resultdata) > 0) {
					$DuplicateTransactionId = $resultdata[0]["TransactionId"];
					$DuplicateProgramName = $resultdata[0]["ProgramName"];
					$DuplicateFactoryName = $resultdata[0]["FactoryName"];
					$DuplicateAuditStartDate = $resultdata[0]["AuditStartDate"];
					$DuplicateAuditEndDate = $resultdata[0]["AuditEndDate"];

					$sql1 = "select AuditorName from t_auditor where AuditorId='$TAuditorId'";

					$resultdata1 = $dbh->query($sql1);
					$DuplicateAuditorName = $resultdata1[0]["AuditorName"];

					if ($DupMsg != "") {
						$DupMsg .= "; ";
					}
					$DupMsg .= $DuplicateAuditorName . ' is already assigned ' . $DuplicateProgramName . ", " . $DuplicateFactoryName . " ($DuplicateAuditStartDate, $DuplicateAuditEndDate)";
					// return $returnData = msg(0, 404, $DuplicateAuditorName.' is already assigned ' . $DuplicateProgramName . ", " . $DuplicateFactoryName . " ($DuplicateAuditStartDate, $DuplicateAuditEndDate)");
				}
			}

			if ($DupMsg != "") {
				return $returnData = msg(0, 404, $DupMsg);
			}
		}


		$AttachedDocumentsArr = array();
		foreach ($AttachedDocuments as $key => $row) {
			$row->file = ""; //file string empty
			$row->status = ""; //status empty
			$AttachedDocumentsArr[] = (array)$row;
		}

		try {
			$aQuerys = array();

			$u = new updateq();
			$u->table = 't_transaction';
			$u->columns = [
				'ActivityId',
				'FactoryId',
				'FactoryAddress',
				'FactoryContactPerson',
				'FactoryContactPersonPhone',
				'FactoryContactPersonEmail',
				'FactoryHoliday',
				'ProgramId',
				'ExpireDate',
				'OpportunityDate',
				'TentativeOfferPrice',
				'CertificateBody',
				'CoordinatorId',
				'AuditStageId',
				'LeadStatusId',
				'ManDay',
				'BuyerId',
				'NextFollowupDate',
				'DepartmentId',
				'MemberId',
				'Remarks',
				'Comments',
				"AssessmentNo",
				"AuditStartDate",
				"AuditEndDate",
				"CountryId",
				"LeadAuditorId",
				"TeamAuditorIds",
				"AuditTypeId",
				"Window",
				"WindowEnd",
				"PaymentStatus",
				"ReportWriterId",
				"ReportWritingDate",
				"NoOfEmployee",
				"AuditFee",
				"OPE",
				"OthersAmount",
				"PINo",
				"RevenueBDT",
				"Discount",
				"AttachedDocuments",
				"AuditBook",
				"IsSendMail",
				"FileUploaded",
				"ReportSentToCustomer",
				"StateId",
				"StandardTAT",
				"StrategicTAT",
				"LastCoordinatorInputUpdateUserId",
				"LastUpdateUserId"
			];
			$u->values = [
				$ActivityId,
				$FactoryId,
				$FactoryAddress,
				$FactoryContactPerson,
				$FactoryContactPersonPhone,
				$FactoryContactPersonEmail,
				$FactoryHoliday,
				$ProgramId,
				$ExpireDate,
				$OpportunityDate,
				$TentativeOfferPrice,
				$CertificateBody,
				$CoordinatorId,
				$AuditStageId,
				$LeadStatusId,
				$ManDay,
				$BuyerId,
				$NextFollowupDate,
				$DepartmentId,
				$MemberId,
				$Remarks,
				$Comments,
				$AssessmentNo,
				$AuditStartDate,
				$AuditEndDate,
				$CountryId,
				$LeadAuditorId,
				json_encode($TeamAuditorId),
				$AuditTypeId,
				$Window,
				$WindowEnd,
				$PaymentStatus,
				$ReportWriterId,
				$ReportWritingDate,
				$NoOfEmployee,
				$AuditFee,
				$OPE,
				$OthersAmount,
				$PINo,
				$RevenueBDT,
				$Discount,
				json_encode($AttachedDocumentsArr),
				$AuditBook,
				$IsSendMail,
				$FileUploaded,
				$ReportSentToCustomer,
				$StateId,
				$StandardTAT,
				$StrategicTAT,
				$UserId,
				$UserId
			];
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



function MemberDateAssignDataAddEdit($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	} else {
		$dbh = new Db();

		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		$Id = $data->rowData->Id ? $data->rowData->Id : "";
		$TransactionId = $data->rowData->TransactionId;
		$AssignDate = $data->rowData->AssignDate;
		$AuditorId = $data->rowData->AuditorId;
		$StartTime = $data->rowData->StartTime;
		$EndTime = $data->rowData->EndTime;


		try {

			$sql = "SELECT a.TransactionId, b.ProgramName, c.FactoryName, a.AuditStartDate, a.AuditEndDate, e.AuditorName,d.AssignDate
					FROM t_transaction a
					inner join t_program b on a.ProgramId = b.ProgramId
					inner join t_factory c on a.FactoryId = c.FactoryId
					inner join t_transaction_auditor_assign d on a.TransactionId = d.TransactionId 
							and d.AuditorId = $AuditorId and d.AssignDate = '$AssignDate'
							AND d.StartTime <= '$EndTime'
							AND d.EndTime >='$StartTime'
					inner join t_auditor e on d.AuditorId = e.AuditorId;";

			$resultdata = $dbh->query($sql);
			if (count($resultdata) > 0) {
				$DuplicateTransactionId = $resultdata[0]["TransactionId"];
				$DuplicateProgramName = $resultdata[0]["ProgramName"];
				$DuplicateFactoryName = $resultdata[0]["FactoryName"];
				$DuplicateAssignDate = $resultdata[0]["AssignDate"];
				$DuplicateAuditorName = $resultdata[0]["AuditorName"];

				$DupMsg = $DuplicateAuditorName . ' is already assigned ' . $DuplicateProgramName . ", " . $DuplicateFactoryName . " ($DuplicateAssignDate)";
				$returnData = msg(0, 500, $DupMsg);
			} else {

				$aQuerys = array();
				if ($Id == "") {
					$q = new insertq();
					$q->table = 't_transaction_auditor_assign';
					$q->columns = [
						'TransactionId',
						'AuditorId',
						'AssignDate',
						'StartTime',
						'EndTime'
					];
					$q->values = [
						$TransactionId,
						$AuditorId,
						$AssignDate,
						$StartTime,
						$EndTime
					];
					$q->pks = ['Id'];
					$q->bUseInsetId = true;
					$q->build_query();
					$aQuerys[] = $q;
				} else {
					$u = new updateq();
					$u->table = 't_transaction_auditor_assign';
					$u->columns = ['AuditorId', 'AssignDate', 'StartTime', 'EndTime'];
					$u->values = [$AuditorId, $AssignDate, $StartTime, $EndTime];
					$u->pks = ['Id'];
					$u->pk_values = [$Id];
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
			}
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



function deleteMemberDateAssignData($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif (!isset($data->rowData->Id)) {
		$fields = ['fields' => ['Id']];
		return $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
	} else {

		$Id = $data->rowData->Id;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		try {

			$dbh = new Db();

			$d = new deleteq();
			$d->table = 't_transaction_auditor_assign';
			$d->pks = ['Id'];
			$d->pk_values = [$Id];
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



function FilesUpload($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	} else {

		$lan = trim($data->lan);
		$UserId = trim($data->UserId);
		$rowData = $data->rowData;

		// echo "<pre>";
		// print_r($FileNameString);
		// exit;

		$TransactionId = $data->TransactionId;

		try {


			foreach ($rowData as $fileobj) {
				if ($fileobj->status == "new") {
					ConvertCSVFile($TransactionId, $fileobj->name, $fileobj->extention, $fileobj->file);
				}
			}

			$success = 1;
			$status = 200;
			$message = "Uploaded successfully";

			$returnData = [
				"success" => $success,
				"status" => $status,
				"message" => $message
			];
		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}

		return $returnData;
	}
}



function ConvertCSVFile($TransactionId, $name, $extention, $filebase64_string)
{
	$targetDir = '../../../image/transaction/' . $TransactionId;

	if (!file_exists($targetDir)) {
		mkdir($targetDir, 0777, true);
	}

	$exploded = explode(',', $filebase64_string, 2);
	// echo "<pre>";
	// print_r($exploded);
	// $extention = "csv"; // explode(';', explode('/', $exploded[0])[1])[0];
	$decoded = base64_decode($exploded[1]);
	// $output_file = $prefix . "_cover_" . date("Y_m_d_H_i_s") . "_" . rand(1, 9999) . "." . $extention;
	// $output_file = date("Y_m_d_H_i_s") . "_" . rand(1, 9999) ."_".$name. "." . $extention;
	// $output_file = date("Y_m_d_H_i_s") . "_" . rand(1, 9999) . "_" . $name;
	$output_file = $name;
	file_put_contents($targetDir . "/" . $output_file, $decoded);
	return $output_file;
}
