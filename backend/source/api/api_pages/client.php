<?php

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	
	case "getDataList":
		$returnData = getDataList($data);
	break;

	case "dataAddEdit":
		$returnData = dataAddEdit($data);
	break;
	
	case "deleteData":
		$returnData = deleteData($data);
	break;

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){


	try{
		$dbh = new Db();
		$query = "SELECT a.ClientId AS id, a.ClientName, a.ClientCode, a.PhoneNo, 
		a.Email, a.ClientAddress,a.ClientLogo,a.IsActive
		, case when a.IsActive=1 then 'Active' else 'In Active' end IsActiveName
		FROM t_client a
		ORDER BY a.ClientCode ASC;";		
		
		$resultdata = $dbh->query($query);
		
		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];

	}catch(PDOException $e){
		$returnData = msg(0,500,$e->getMessage());
	}
	
	return $returnData;
}



function dataAddEdit($data) {

	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}else{
		
		
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 
		//$ClientId = trim($data->ClientId); 
		//$BranchId = trim($data->BranchId); 

		$ClientId = $data->rowData->id;
		$ClientCode = $data->rowData->ClientCode;
		$ClientName = $data->rowData->ClientName;
		$PhoneNo = $data->rowData->PhoneNo;
		$ClientAddress = isset($data->rowData->ClientAddress) && ($data->rowData->ClientAddress !== "") ? $data->rowData->ClientAddress : NULL;
		$Email = isset($data->rowData->Email) && ($data->rowData->Email !== "")? $data->rowData->Email : NULL;
		$IsActive = 1;
		



		try{

			$dbh = new Db();
			$aQuerys = array();


			if($ClientId == ""){
				$q = new insertq();
				$q->table = 't_client';
				$q->columns = ['ClientId','ClientCode','ClientName','Email','PhoneNo','ClientAddress','IsActive'];
				$q->values = [$ClientId,$ClientCode,$ClientName,$Email,$PhoneNo,$ClientAddress,$IsActive];
				$q->pks = ['ClientId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 

			}else{
				$u = new updateq();
				$u->table = 't_client';
				$u->columns = ['ClientCode','ClientName','Email','PhoneNo','ClientAddress','IsActive'];
				$u->values = [$ClientCode,$ClientName,$Email,$PhoneNo,$ClientAddress,$IsActive];
				$u->pks = ['ClientId'];
				$u->pk_values = [$ClientId];
				$u->build_query();
				$aQuerys = array($u);
			}
			
			$res = exec_query($aQuerys, $UserId, $lan);  
			$success=($res['msgType']=='success')?1:0;
			$status=($res['msgType']=='success')?200:500;

			$returnData = [
			    "success" => $success ,
				"status" => $status,
				"UserId"=> $UserId,
				"message" => $res['msg']
			];

		}catch(PDOException $e){
			$returnData = msg(0,500,$e->getMessage());
		}
		
		return $returnData;
	}
}


function deleteData($data) {
 
	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif(!isset($data->rowData->id)){
		$fields = ['fields' => ['id']];
		return $returnData = msg(0,422,'Please Fill in all Required Fields!',$fields);
	}else{
		
		$ClientId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 
		//$ClientId = trim($data->ClientId); 
		//$BranchId = trim($data->BranchId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_client';
            $d->pks = ['ClientId'];
            $d->pk_values = [$ClientId];
            $d->build_query();
            $aQuerys = array($d);

			$res = exec_query($aQuerys, $UserId, $lan);  
			$success=($res['msgType']=='success')?1:0;
			$status=($res['msgType']=='success')?200:500;

			$returnData = [
				"success" => $success ,
				"status" => $status,
				"UserId"=> $UserId,
				"message" => $res['msg']
			];
			
		}catch(PDOException $e){
			$returnData = msg(0,500,$e->getMessage());
		}
		
		return $returnData;
	}
}


?>