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
		$query = "SELECT AuditorId AS id, AuditorCode,AuditorName,Email,Address,PhoneNo,IsActive
		FROM t_auditor 
		ORDER BY `AuditorCode` ASC;";		
		
		$dataList = $dbh->query($query);

		$resultdata = array();
		foreach($dataList as $key => $row) {


			$query1 = "SELECT ProgramId FROM t_auditor_lead_program where AuditorId = ".$row['id'].";";		
			$LeadListResult = $dbh->query($query1);
			$LeadList = array();
			foreach($LeadListResult as $r1) {
				$LeadList[] = $r1['ProgramId'];
			}
			$row['LeadAuditorProgram'] = $LeadList;

			$query1 = "SELECT ProgramId FROM t_auditor_member_program where AuditorId = ".$row['id'].";";		
			$TeamMemberListResult = $dbh->query($query1);
			$TeamMemberList = array();
			foreach($TeamMemberListResult as $r1) {
				$TeamMemberList[] = $r1['ProgramId'];
			}
			$row['TeamAuditorProgram'] = $TeamMemberList;
			
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
		$AuditorId = $data->rowData->id;
		$AuditorCode = $data->rowData->AuditorCode;
		$AuditorName = $data->rowData->AuditorName;
		$Email = $data->rowData->Email;
		$Address = $data->rowData->Address;
		$PhoneNo = $data->rowData->PhoneNo;
		$IsActive = 1;// $data->rowData->IsActive;

		$LeadAuditorProgram = $data->rowData->LeadAuditorProgram;
		$TeamAuditorProgram = $data->rowData->TeamAuditorProgram;


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
				$aQuerys[] = $u;

				$d = new deleteq();
				$d->table = 't_auditor_lead_program';
				$d->pks = ['AuditorId'];
				$d->pk_values = [$AuditorId];
				$d->build_query();
				$aQuerys[] = $d;

				$d = new deleteq();
				$d->table = 't_auditor_member_program';
				$d->pks = ['AuditorId'];
				$d->pk_values = [$AuditorId];
				$d->build_query();
				$aQuerys[] = $d;


				if($LeadAuditorProgram && count($LeadAuditorProgram)>0){
					foreach($LeadAuditorProgram as $p){
						$q = new insertq();
						$q->table = 't_auditor_lead_program';
						$q->columns = ['AuditorId','ProgramId'];
						$q->values = [$AuditorId,$p];
						$q->pks = ['AuditorLeadProgramId'];
						$q->bUseInsetId = false;
						$q->build_query();
						$aQuerys[] = $q; 
					}
				}
				if($TeamAuditorProgram && count($TeamAuditorProgram)>0){
					foreach($TeamAuditorProgram as $p){
						$q = new insertq();
						$q->table = 't_auditor_member_program';
						$q->columns = ['AuditorId','ProgramId'];
						$q->values = [$AuditorId,$p];
						$q->pks = ['AuditorMemberProgramId'];
						$q->bUseInsetId = false;
						$q->build_query();
						$aQuerys[] = $q; 
					}
				}

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
		$aQuerys = array();

		try{
			

			$d = new deleteq();
			$d->table = 't_auditor_lead_program';
			$d->pks = ['AuditorId'];
			$d->pk_values = [$AuditorId];
			$d->build_query();
			$aQuerys[] = $d;

			$d = new deleteq();
			$d->table = 't_auditor_member_program';
			$d->pks = ['AuditorId'];
			$d->pk_values = [$AuditorId];
			$d->build_query();
			$aQuerys[] = $d;

            $d = new deleteq();
            $d->table = 't_auditor';
            $d->pks = ['AuditorId'];
            $d->pk_values = [$AuditorId];
            $d->build_query();
            $aQuerys[] = $d;

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