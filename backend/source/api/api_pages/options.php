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

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){

	$ClientId = isset($data->ClientId) && $data->ClientId !== "" ? trim($data->ClientId) : 1;

	try{
		$dbh = new Db();

		$query = "SELECT a.ClientId AS id, a.PoundRate
		FROM t_client a
		WHERE a.ClientId = $ClientId
		LIMIT 1;";
		
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
		$ClientId = isset($data->rowData->id) && $data->rowData->id !== "" ? $data->rowData->id : (isset($data->ClientId) && $data->ClientId !== "" ? $data->ClientId : 1);
		$PoundRate = isset($data->rowData->PoundRate) && $data->rowData->PoundRate !== "" ? $data->rowData->PoundRate : 0;

		try{

			$dbh = new Db();
			$aQuerys = array();

			$u = new updateq();
			$u->table = 't_client';
			$u->columns = ['PoundRate'];
			$u->values = [$PoundRate];
			$u->pks = ['ClientId'];
			$u->pk_values = [$ClientId];
			$u->build_query();
			$aQuerys[] = $u;
			
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
