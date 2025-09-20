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
		$query = "SELECT a.FactoryId AS id,b.FactoryGroupName, a.FactoryGroupId,
		a.FactoryName,a.PhoneNo,a.Email,a.Address, a.FactoryCode,a.Locations,a.ContactInfo
		FROM t_factory a
		INNER JOIN t_factorygroup b on a.FactoryGroupId=b.FactoryGroupId
		ORDER BY a.`FactoryName` ASC;";		
		
		$resultdataresult = $dbh->query($query);
		$resultdata = array();
		foreach($resultdataresult as $key => $row){

			// $row["Locations"]= array("Dhaka","Jamalpur","Chittagong","Khulna","Rajshahi");
			// $ContactInfo = array();
			// $ContactInfo[] = array("ContactPerson" => "Rubel", "ContactNumber" => "01538198763", "Designation" => "NA", "Email" => "rubel714@gmail.com");
			// $ContactInfo[] = array("ContactPerson" => "Rubel01", "ContactNumber" => "01538198700", "Designation" => "NA1", "Email" => "1rubel714@gmail.com");
			// $ContactInfo[] = array("ContactPerson" => "Rubel02", "ContactNumber" => "01538198711", "Designation" => "NA1", "Email" => "2rubel714@gmail.com");
			// $row["ContactInfo"] = $ContactInfo;
			$row["Locations"] = $row["Locations"] ? json_decode($row["Locations"], true) : [];
			$row["ContactInfo"] = $row["ContactInfo"] ? json_decode($row["ContactInfo"], true) : [];
			$resultdata[] = $row;
		}
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
		$FactoryCode = $data->rowData->FactoryCode;
		// $Email = $data->rowData->Email;
		// $Address = $data->rowData->Address;

		$Locations = json_encode($data->rowData->Locations);
		$ContactInfo = json_encode($data->rowData->ContactInfo);

		// echo "<pre>";
		// echo json_encode($Locations);
		// exit;

		// $row["Locations"] = $row["Locations"] ? json_decode($row["Locations"], true) : [];
		// $row["ContactInfo"] = $row["ContactInfo"] ? json_decode($row["ContactInfo"], true) : [];
		// $resultdata[] = $row;


		try{

			// $dbh = new Db();
			$aQuerys = array();

 

			if($FactoryId == ""){
				$q = new insertq();
				$q->table = 't_factory';
				$q->columns = ['FactoryGroupId','FactoryName','FactoryCode','Locations','ContactInfo'];
				$q->values = [$FactoryGroupId,$FactoryName,$FactoryCode,$Locations,$ContactInfo];
				$q->pks = ['FactoryId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_factory';
				$u->columns = ['FactoryGroupId','FactoryName','FactoryCode','Locations','ContactInfo'];
				$u->values = [$FactoryGroupId,$FactoryName,$FactoryCode,$Locations,$ContactInfo];
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