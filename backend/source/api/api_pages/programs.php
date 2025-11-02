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
		$query = "SELECT ProgramId AS id, ProgramName,TATDayType,StandardTATDay,StrategiceTATDay,
		t_program.TATDayTypeId,IsitMultiple,t_program.ProgramCategoryId,ProgramCategoryName
		FROM t_program 
		inner join t_tat_day_type on t_program.TATDayTypeId=t_tat_day_type.TATDayTypeId
		inner join t_programcategory on t_program.ProgramCategoryId=t_programcategory.ProgramCategoryId
		ORDER BY `ProgramName` ASC;";		
		
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

		$ProgramId = $data->rowData->id;
		$ProgramName = $data->rowData->ProgramName;
		$TATDayTypeId = $data->rowData->TATDayTypeId;
		$ProgramCategoryId = $data->rowData->ProgramCategoryId;
		$StandardTATDay = $data->rowData->StandardTATDay ? $data->rowData->StandardTATDay : null;
		$StrategiceTATDay = $data->rowData->StrategiceTATDay ? $data->rowData->StrategiceTATDay : null;
		$IsitMultiple = $data->rowData->IsitMultiple ? $data->rowData->IsitMultiple : null;

		try{

			$dbh = new Db();
			$aQuerys = array();

 

			if($ProgramId == ""){
				$q = new insertq();
				$q->table = 't_program';
				$q->columns = ['ProgramName','TATDayTypeId','StandardTATDay','StrategiceTATDay','ProgramCategoryId','IsitMultiple'];
				$q->values = [$ProgramName,$TATDayTypeId,$StandardTATDay,$StrategiceTATDay,$ProgramCategoryId,$IsitMultiple];
				$q->pks = ['ProgramId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_program';
				$u->columns = ['ProgramName','TATDayTypeId','StandardTATDay','StrategiceTATDay','ProgramCategoryId','IsitMultiple'];
				$u->values = [$ProgramName,$TATDayTypeId,$StandardTATDay,$StrategiceTATDay,$ProgramCategoryId,$IsitMultiple];
				$u->pks = ['ProgramId'];
				$u->pk_values = [$ProgramId];
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
		
		$ProgramId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_program';
            $d->pks = ['ProgramId'];
            $d->pk_values = [$ProgramId];
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