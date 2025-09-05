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

	
	$ClientId = trim($data->ClientId); 
	//$BranchId = trim($data->BranchId); 

	try{
		$dbh = new Db();
		$query = "SELECT AuditorId AS id, AuditorCode,AuditorName,Email,Address,PhoneNo,IsActive
		FROM t_auditor 
		ORDER BY `AuditorCode` ASC;";		
		
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
		// $ClientId = trim($data->ClientId); 
		//$BranchId = trim($data->BranchId); 

		$AuditorId = $data->rowData->id;
		$AuditorCode = $data->rowData->AuditorCode;
		$AuditorName = $data->rowData->AuditorName;
		$Email = $data->rowData->Email;
		$Address = $data->rowData->Address;
		$PhoneNo = $data->rowData->PhoneNo;
		$IsActive = 1;// $data->rowData->IsActive;



		try{

			$dbh = new Db();
			$aQuerys = array();
				if(!$AuditorCode){
					$AuditorCode = time();
				}
			if($AuditorId == ""){

				$q = new insertq();
				$q->table = 't_auditor';
				$q->columns = ['AuditorCode','AuditorName','Email','Address','PhoneNo','IsActive'];
				$q->values = [$AuditorCode,$AuditorName,$Email,$Address,$PhoneNo,$IsActive];
				$q->pks = ['CheckId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_auditor';
				$u->columns = ['AuditorCode','AuditorName','Email','Address','PhoneNo','IsActive'];
				$u->values = [$AuditorCode,$AuditorName,$Email,$Address,$PhoneNo,$IsActive];
				$u->pks = ['AuditorId'];
				$u->pk_values = [$AuditorId];
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
		
		$AuditorId  = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{
			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_auditor';
            $d->pks = ['AuditorId'];
            $d->pk_values = [$AuditorId];
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