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
		$query = "SELECT a.FactoryId AS id,b.FactoryGroupName, a.FactoryGroupId,
		a.FactoryName,a.PhoneNo,a.Email,a.Address
		FROM t_factory a
		INNER JOIN t_factorygroup b on a.FactoryGroupId=b.FactoryGroupId
		ORDER BY b.FactoryGroupName,a.`FactoryName` ASC;";		
		
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
		$FactoryId = $data->rowData->id;
		$FactoryGroupId = $data->rowData->FactoryGroupId;
		$FactoryName = $data->rowData->FactoryName;
		$PhoneNo = $data->rowData->PhoneNo;
		$Email = $data->rowData->Email;
		$Address = $data->rowData->Address;

		try{

			$dbh = new Db();
			$aQuerys = array();

 

			if($FactoryId == ""){
				$q = new insertq();
				$q->table = 't_factory';
				$q->columns = ['FactoryGroupId','FactoryName','PhoneNo','Email','Address'];
				$q->values = [$FactoryGroupId,$FactoryName,$PhoneNo,$Email,$Address];
				$q->pks = ['FactoryId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_factory';
				$u->columns = ['FactoryGroupId','FactoryName','PhoneNo','Email','Address'];
				$u->values = [$FactoryGroupId,$FactoryName,$PhoneNo,$Email,$Address];
				$u->pks = ['FactoryId'];
				$u->pk_values = [$FactoryId];
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
		
		$FactoryId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_factory';
            $d->pks = ['FactoryId'];
            $d->pk_values = [$FactoryId];
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