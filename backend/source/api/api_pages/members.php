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
		$query = "SELECT MemberId AS id, MemberCode,MemberName,Email,Address,PhoneNo,IsActive,
		t_member.DepartmentId, t_department.DepartmentName
		FROM t_member 
		Inner Join t_department on t_department.DepartmentId=t_member.DepartmentId
		ORDER BY `MemberCode` ASC;";

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
		// $ClientId = trim($data->ClientId); 
		//$BranchId = trim($data->BranchId); 

		$MemberId = $data->rowData->id;
		$MemberCode = $data->rowData->MemberCode;
		$MemberName = $data->rowData->MemberName;
		$Email = $data->rowData->Email?$data->rowData->Email:null;
		$Address = $data->rowData->Address?$data->rowData->Address:null;
		$PhoneNo = $data->rowData->PhoneNo;
		$DepartmentId = $data->rowData->DepartmentId;
		$IsActive = 1; // $data->rowData->IsActive;

		try {

			$dbh = new Db();
			$aQuerys = array();
			if (!$MemberCode) {
				$MemberCode = time();
			}

			if ($MemberId == "") {

				$q = new insertq();
				$q->table = 't_member';
				$q->columns = ['MemberCode', 'MemberName','DepartmentId', 'Email', 'Address', 'PhoneNo', 'IsActive'];
				$q->values = [$MemberCode, $MemberName,$DepartmentId, $Email, $Address, $PhoneNo, $IsActive];
				$q->pks = ['MemberId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q);
			} else {
				$u = new updateq();
				$u->table = 't_member';
				$u->columns = ['MemberCode', 'MemberName','DepartmentId', 'Email', 'Address', 'PhoneNo', 'IsActive'];
				$u->values = [$MemberCode, $MemberName,$DepartmentId, $Email, $Address, $PhoneNo, $IsActive];
				$u->pks = ['MemberId'];
				$u->pk_values = [$MemberId];
				$u->build_query();
				$aQuerys = array($u);
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

		$MemberId = $data->rowData->id;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		try {

			// $dbh = new Db();

			$d = new deleteq();
			$d->table = 't_member';
			$d->pks = ['MemberId'];
			$d->pk_values = [$MemberId];
			$d->build_query();
			$aQuerys = array($d);

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
