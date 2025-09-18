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
		$query = "SELECT BuyerId AS id, BuyerName ,Phone,Email,Address,
		 `ClientType`, `Country`, `SunCode`, `EbitzCode`, `ItsCode`, `RegisterNo`, `CustomerCode`
		FROM t_buyer 
		ORDER BY `BuyerName` ASC;";

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

		$BuyerId = $data->rowData->id;
		$BuyerName = $data->rowData->BuyerName;
		$ClientType = $data->rowData->ClientType ? $data->rowData->ClientType : null;
		$Country = $data->rowData->Country ? $data->rowData->Country : null;
		$SunCode = $data->rowData->SunCode ? $data->rowData->SunCode : null;
		$EbitzCode = $data->rowData->EbitzCode ? $data->rowData->EbitzCode : null;
		$ItsCode = $data->rowData->ItsCode ? $data->rowData->ItsCode : null;
		$RegisterNo = $data->rowData->RegisterNo ? $data->rowData->RegisterNo : null;
		$CustomerCode = $data->rowData->CustomerCode ? $data->rowData->CustomerCode : null;

		// $Phone = $data->rowData->Phone;
		// $Email = $data->rowData->Email;
		// $Address = $data->rowData->Address;


		try {

			$dbh = new Db();
			$aQuerys = array();

			if ($BuyerId == "") {

				$q = new insertq();
				$q->table = 't_buyer';
				$q->columns = ['BuyerName', 'ClientType', 'Country', 'SunCode','EbitzCode', 'ItsCode', 'RegisterNo', 'CustomerCode'];
				$q->values = [$BuyerName, $ClientType, $Country, $SunCode,$EbitzCode, $ItsCode, $RegisterNo, $CustomerCode];
				$q->pks = ['BuyerId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q);
			} else {
				$u = new updateq();
				$u->table = 't_buyer';
				$u->columns = ['BuyerName', 'ClientType', 'Country', 'SunCode','EbitzCode', 'ItsCode', 'RegisterNo', 'CustomerCode'];
				$u->values = [$BuyerName, $ClientType, $Country, $SunCode,$EbitzCode, $ItsCode, $RegisterNo, $CustomerCode];
				$u->pks = ['BuyerId'];
				$u->pk_values = [$BuyerId];
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

		$BuyerId = $data->rowData->id;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		try {

			$d = new deleteq();
			$d->table = 't_buyer';
			$d->pks = ['BuyerId'];
			$d->pk_values = [$BuyerId];
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
