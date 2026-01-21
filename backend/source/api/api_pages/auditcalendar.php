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
		$EndDate = trim($data->EndDate) . " 23:59:59";
		// $StartDate = "2025-10-01";
		// $EndDate = "2025-10-31 23:59:59";

		///////////get auditor list
		$query = "SELECT a.`AuditorId`,a.`AuditorCode`,a.`AuditorName`,a.`PhoneNo`, '' as DayType, '' as Msg
		FROM `t_auditor` a
		WHERE (a.InActiveDate>='$StartDate' OR a.InActiveDate IS NULL)
		order by a.`AuditorName` asc;";
		$resultdata = $dbh->query($query);
		$AuditorList = array();
		foreach ($resultdata as $row) {
			$AuditorList[$row['AuditorId']] = $row;
		}

		$sdate = date('Y-m-d', strtotime($StartDate));
		$edate = date('Y-m-d', strtotime($EndDate));
		$dataMatrix = array();
		while ($sdate <= $edate) {

			$row = array();
			foreach ($AuditorList as $AuditorId => $Auditor) {
				$row[$AuditorId] = $Auditor;
			}

			$idx =  date('Y-m-d', strtotime($sdate));
			$dataMatrix[$idx] = $row;
			$sdate = date('Y-m-d', strtotime($sdate . ' +1 day'));
		}


		///////////get audit list
		$query = "SELECT a.`TransactionId`,a.`ProgramId`,b.`ProgramName`,c.FactoryName,a.FactoryAddress,a.`LeadAuditorId`,
		REPLACE(a.TeamAuditorIds, '" . '"' . "', '') as TeamAuditorIds,
		a.`AuditStartDate`,`AuditEndDate`
		FROM `t_transaction` a
		INNER JOIN `t_program` b ON a.ProgramId=b.ProgramId
		INNER JOIN `t_factory` c ON a.FactoryId=c.FactoryId
		WHERE a.AuditStartDate <= '$EndDate'
  		AND a.AuditEndDate >='$StartDate'
		AND (a.`LeadAuditorId` IS NOT NULL);";
		// AND (a.`LeadAuditorId` IS NOT NULL OR a.`TeamAuditorIds` <> '[]');";
		$resultdata = $dbh->query($query);
		foreach ($resultdata as $row) {

			$TransactionId = $row["TransactionId"];
			$ProgramName = $row["ProgramName"];
			$FactoryName = $row["FactoryName"];
			$FactoryAddress = $row["FactoryAddress"];

			$LeadAuditorId = $row["LeadAuditorId"];
			$TeamAuditorIds = $row["TeamAuditorIds"];

			$AuditorIds = array();
			if ($LeadAuditorId) {
				$AuditorIds[] = $LeadAuditorId;
			}

			// if ($TeamAuditorIds != '[]') {
			// 	$TeamAuditorIds = json_decode($TeamAuditorIds);
			// 	$AuditorIds = array_merge($AuditorIds, $TeamAuditorIds);
			// }
			
			//$AuditorIds = array_unique($AuditorIds);


			$asdate = date('Y-m-d', strtotime($row["AuditStartDate"]));
			$aedate = date('Y-m-d', strtotime($row["AuditEndDate"]));
			while ($asdate <= $aedate) {
				$idx =  date('Y-m-d', strtotime($asdate));

				foreach ($AuditorIds as $AuditorId) {
					$dataMatrix[$idx][$AuditorId]["Msg"] = $ProgramName . ', ' . $FactoryName . ', ' . $FactoryAddress;
				}

				$asdate = date('Y-m-d', strtotime($asdate . ' +1 day'));
			}





			
			///////////get team auditor list under this audit
			$query9 = "SELECT a.AuditorId, a.AssignDate
			FROM `t_transaction_auditor_assign` a
			WHERE a.TransactionId=$TransactionId;";
			$resultdata9 = $dbh->query($query9);
			foreach ($resultdata9 as $row9) {
				// $AuditorIds[$row9['AuditorId']] = $row9['AssignDate'];
				$idx =  date('Y-m-d', strtotime($row9['AssignDate']));

				$dataMatrix[$idx][$row9['AuditorId']]["Msg"] = $ProgramName . ', ' . $FactoryName . ', ' . $FactoryAddress;
			}

		}




		///////////get holiday/leave list
		$query = "SELECT a.`HoliDate`,a.`DayType`,a.`AuditorId`,a.`LeaveStatusId`,b.`LeaveStatusName`,a.Comments
		FROM `t_holiday` a
		LEFT JOIN `t_leavestatus` b ON a.LeaveStatusId=b.LeaveStatusId
		WHERE (a.HoliDate >= '$StartDate' AND a.HoliDate <= '$EndDate');";
		$resultdata = $dbh->query($query);
		$HoliDayList = array();
		$LeaveDayList = array();
		foreach ($resultdata as $row) {

			if($row['DayType'] == "holiday"){
				$HoliDayList[$row['HoliDate']] = $row;
			}else{
				$LeaveDayList[$row['HoliDate']."_".$row['AuditorId']] = $row;
			}
		}

		$columnlist = array();
		$columnlist[] = ["field" => "Serial", "title" => "SL", "align" => "center", "width" => 20, "frozen"=>true];
		$columnlist[] = ["field" => "Date", "title" => "Date", "filter" => true, "width" => 100, "frozen"=>true];
		$columnlist[] = ["field" => "Day", "title" => "Day", "filter" => true, "width" => 70, "frozen"=>true];
		//$width = 87 / count($AuditorList) . '%';
		foreach ($AuditorList as $auditorId => $auditorInfo) {
			$columnlist[] = ["field" => "A_" . $auditorId, "title" => $auditorInfo['AuditorName'],  "width" => 120];
		}

		$dataList = array();
		$serial = 0;
		foreach ($dataMatrix as $date => $rowobj) {

			$row = [];
			$row["Date"] = date('d-M-Y', strtotime($date));
			$row["Day"] = date('D', strtotime($date));
			foreach ($rowobj as $obj) {

				$Msg = $obj['Msg'];

				if($Msg == ""){
					if (array_key_exists($date, $HoliDayList)) {
						$Msg = "Offday";
					}else if (array_key_exists($date."_".$obj['AuditorId'], $LeaveDayList)) {
						$Msg = $LeaveDayList[$date."_".$obj['AuditorId']]['LeaveStatusName'];
					}
				}

				$row["A_" . $obj['AuditorId']] = $Msg;
			}


			$row["Serial"] = ++$serial;
			$dataList[] = $row;
		}

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => [
				"column" => $columnlist,
				"data" => $dataList
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}
