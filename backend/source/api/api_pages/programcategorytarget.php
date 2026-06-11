<?php

if (!isset($data)) {
	$data = json_decode(file_get_contents('php://input'));
}

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
		$YearId = isset($data->YearId) ? $data->YearId : date('Y');
		$MonthId = isset($data->MonthId) ? $data->MonthId : date('n');

		$dbh = new Db();

		$query = "SELECT 
			pc.ProgramCategoryId AS id,
			pc.ProgramCategoryName,
			pct.ReCertification,
			pct.NewCertification,
			pct.TotalCertification,
			pct.ProgramCategoryTargetId
		FROM t_programcategory pc
		LEFT JOIN t_programcategory_wise_target pct ON pct.ProgramCategoryId = pc.ProgramCategoryId
			AND pct.YearId = $YearId
			AND pct.MonthId = $MonthId
		ORDER BY pc.ProgramCategoryName ASC;";

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

function normalizeTargetValue($value)
{
	if ($value === null || $value === '' || $value === '0') {
		return null;
	}

	if (is_numeric($value) && (float)$value === 0.0) {
		return null;
	}

	return $value;
}

function saveTargets($data)
{
	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return msg(0, 404, 'Page Not Found!');
	}

	$lan = trim($data->lan);
	$UserId = trim($data->UserId);
	$YearId = isset($data->YearId) ? (int)$data->YearId : 0;
	$MonthId = isset($data->MonthId) ? (int)$data->MonthId : 0;
	$targets = $data->targets;

	try {
		$dbh = new Db();
		$aQuerys = array();
		$nextProgramCategoryTargetId = (int) $dbh->single("SELECT COALESCE(MAX(ProgramCategoryTargetId), 0) + 1 FROM t_programcategory_wise_target");

		foreach ($targets as $target) {
			$ProgramCategoryId = $target->id;
			$ReCertification = normalizeTargetValue(isset($target->ReCertification) ? $target->ReCertification : null);
			$NewCertification = normalizeTargetValue(isset($target->NewCertification) ? $target->NewCertification : null);
			$TotalCertification = ($ReCertification === null && $NewCertification === null)
				? null
				: (int)($ReCertification ?? 0) + (int)($NewCertification ?? 0);
			$ProgramCategoryTargetId = isset($target->ProgramCategoryTargetId) ? $target->ProgramCategoryTargetId : null;

			if (empty($ProgramCategoryTargetId)) {
				$ProgramCategoryTargetId = $nextProgramCategoryTargetId;
				$nextProgramCategoryTargetId++;
				$q = new insertq();
				$q->table = 't_programcategory_wise_target';
				$q->columns = ['ProgramCategoryTargetId', 'ProgramCategoryId', 'YearId', 'MonthId', 'ReCertification', 'NewCertification', 'TotalCertification'];
				$q->values = [$ProgramCategoryTargetId, $ProgramCategoryId, $YearId, $MonthId, $ReCertification, $NewCertification, $TotalCertification];
				$q->pks = ['ProgramCategoryTargetId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys[] = $q;
			} else {
				$u = new updateq();
				$u->table = 't_programcategory_wise_target';
				$u->columns = ['ReCertification', 'NewCertification', 'TotalCertification'];
				$u->values = [$ReCertification, $NewCertification, $TotalCertification];
				$u->pks = ['ProgramCategoryTargetId'];
				$u->pk_values = [$ProgramCategoryTargetId];
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
