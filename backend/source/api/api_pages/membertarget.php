<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;

	case "saveTargets":
		$returnData = saveTargets($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{
	try {
		$YearId = isset($data->YearName) ? $data->YearName : date('Y');
		$MonthId = isset($data->MonthId) ? $data->MonthId : date('n');
		$DepartmentId = isset($data->DepartmentId) ? $data->DepartmentId : 0;

		$dbh = new Db();
		
		// Get all members with their targets for the selected year/month
		$query = "SELECT 
			m.MemberId AS id, 
			m.MemberCode,
			m.MemberName,
			mt.OnSiteTarget,
			mt.OffSiteTarget,
			mt.RevenueTarget,
			mt.MemberTargetId
		FROM t_member m
		LEFT JOIN t_member_target mt ON mt.MemberId = m.MemberId 
			AND mt.YearId = $YearId
			AND mt.MonthId = $MonthId
		WHERE m.IsActive = 1 
        and (m.DepartmentId = $DepartmentId OR $DepartmentId = 0)
		ORDER BY m.MemberName ASC;";

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

function saveTargets($data)
{
	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}

	$lan = trim($data->lan);
	$UserId = trim($data->UserId);
	$YearId = $data->YearName;
	$MonthId = $data->MonthId;
	$targets = $data->targets;

	try {
		$dbh = new Db();
		$aQuerys = array();

		foreach ($targets as $target) {
			$MemberId = $target->id;
			$OnSiteTarget = isset($target->OnSiteTarget) ? $target->OnSiteTarget : null;
			$OffSiteTarget = isset($target->OffSiteTarget) ? $target->OffSiteTarget : null;
			$RevenueTarget = isset($target->RevenueTarget) ? $target->RevenueTarget : null;
			$MemberTargetId = isset($target->MemberTargetId) ? $target->MemberTargetId : null;

			if (empty($MemberTargetId)) {
				// Insert new record
				$q = new insertq();
				$q->table = 't_member_target';
				$q->columns = ['MemberId', 'YearId', 'MonthId', 'OnSiteTarget', 'OffSiteTarget', 'RevenueTarget'];
				$q->values = [$MemberId, $YearId, $MonthId, $OnSiteTarget, $OffSiteTarget, $RevenueTarget];
				$q->pks = ['MemberTargetId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys[] = $q;
			} else {
				// Update existing record
				$u = new updateq();
				$u->table = 't_member_target';
				$u->columns = ['OnSiteTarget', 'OffSiteTarget', 'RevenueTarget'];
				$u->values = [$OnSiteTarget, $OffSiteTarget, $RevenueTarget];
				$u->pks = ['MemberTargetId'];
				$u->pk_values = [$MemberTargetId];
				$u->build_query();
				$aQuerys[] = $u;
			}
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
