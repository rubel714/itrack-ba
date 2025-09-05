<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;

	case "assignData":
		$returnData = assignData($data);
		break;

	// case "deleteData":
	// 	$returnData = deleteData($data);
	// 	break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{

	$TeamId = trim($data->TeamId);

	try {
		$dbh = new Db();
		$resultdata = array();
		if($TeamId > 0){
			$query = "SELECT a.`MemberId`,a.MemberCode,a.MemberName,a.Email,a.Address,a.PhoneNo,
					b.TeamMemberMapId,b.IsTeamLeader,
					case when b.TeamMemberMapId is null then 0 else 1 end IsAssigned
				FROM `t_member` a
				LEFT JOIN t_team_member_map b ON b.`MemberId` = a.`MemberId` AND b.TeamId = $TeamId
				ORDER BY IsAssigned DESC, a.MemberName ASC;";
			$resultdata = $dbh->query($query);
		}

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



function assignData($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}{
	
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);
		$TeamId = trim($data->TeamId);

		$TeamMemberMapId = $data->rowData->TeamMemberMapId;
		$IsAssigned = $data->rowData->IsAssigned;
		$MemberId = $data->rowData->MemberId;

		try {

			$dbh = new Db();
			$aQuerys = array();

			if($IsAssigned === 0){
				$q = new insertq();
				$q->table = 't_team_member_map';
				$q->columns = ['TeamId','MemberId','IsTeamLeader'];
				$q->values = [$TeamId,$MemberId,0];
				$q->pks = ['TeamMemberMapId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys[] = $q;

			}else if($IsAssigned === 1){
				$d = new deleteq();
				$d->table = 't_team_member_map';
				$d->pks = ['TeamMemberMapId'];
				$d->pk_values = [$TeamMemberMapId];
				$d->build_query();
				$aQuerys[] = $d;
			}
			
// echo "<pre>";
// print_r($aQuerys);
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