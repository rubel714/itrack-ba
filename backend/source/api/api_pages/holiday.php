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
// $date = "2025-09-20"; // your date
// $dayName = date("l", strtotime($date));
// echo $dayName; // Output: Saturday
	
	try{
		$dbh = new Db();
		$query = "SELECT HolyDayId AS id, HoliDate, Year(HoliDate) YearName, DATE_FORMAT(HoliDate, '%M') MonthName, DATE_FORMAT(HoliDate, '%W') DayName
		FROM t_holiday 
		ORDER BY `HoliDate` DESC;";		
		
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
		$HolyDayId = $data->rowData->id;
		$HoliDate = $data->rowData->HoliDate;

		try{

			$dbh = new Db();
			$aQuerys = array();

			if($HolyDayId == ""){
				$q = new insertq();
				$q->table = 't_holiday';
				$q->columns = ['HoliDate'];
				$q->values = [$HoliDate];
				$q->pks = ['HolyDayId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_holiday';
				$u->columns = ['HoliDate'];
				$u->values = [$HoliDate];
				$u->pks = ['HolyDayId'];
				$u->pk_values = [$HolyDayId];
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
		
		$HolyDayId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			// $dbh = new Db();
			$d = new deleteq();
            $d->table = 't_holiday';
            $d->pks = ['HolyDayId'];
            $d->pk_values = [$HolyDayId];
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