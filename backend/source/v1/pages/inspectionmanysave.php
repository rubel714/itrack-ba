<?php
try {

	apiLogWrite("\n\n========$PageName=======Called (" . date('Y_m_d_H_i_s') . ")===================");
	apiLogWrite("Params (" . date('Y_m_d_H_i_s') . "): " . json_encode($data));

	$db = new Db();
	$TransactionId = isset($data['TransactionId']) ? checkNull($data['TransactionId']) : "";
	$TransactionItemId = isset($data['TransactionItemId']) ? checkNull($data['TransactionItemId']) : "";
	$CheckName = isset($data['CheckName']) ? checkNull($data['CheckName']) : "";
	$RowNo = isset($data['RowNo']) ? checkNull($data['RowNo']) : "";
	$ColumnNo = isset($data['ColumnNo']) ? checkNull($data['ColumnNo']) : "";
	$ManyImgPrefix = isset($data['ManyImgPrefix']) ? checkNull($data['ManyImgPrefix']) : "";
	// $CoverFileUrl = isset($data['CoverFileUrl']) ? checkNull($data['CoverFileUrl']) : null; /////////////////
	// $PhotoUrl = "placeholder.jpg"; // isset($data['PhotoUrl']) ? ConvertImageAPI($data['PhotoUrl'], $ManyImgPrefix) : $data['PhotoUrl'];
	// $PhotoUrl = isset($data['PhotoUrl']) ? ConvertImageAPI($data['PhotoUrl'], $ManyImgPrefix) : $data['PhotoUrl'];
	$PhotoUrl = isset($data['PhotoUrl']) ? checkNull($data['PhotoUrl']) : "";;
	$SortOrder = isset($data['SortOrder']) ? checkNull($data['SortOrder']) : "";


	if ($TransactionId == "") {
		$apiResponse = json_encode(recordNotFoundMsg(0, "TransactionId param is missing"));
		apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
		echo $apiResponse;
		return;
	}

	if ($RowNo == "") {
		$apiResponse = json_encode(recordNotFoundMsg(0, "Row style param is missing"));
		apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
		echo $apiResponse;
		return;
	}

	if ($ColumnNo == "") {
		$apiResponse = json_encode(recordNotFoundMsg(0, "Column style param is missing"));
		apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
		echo $apiResponse;
		return;
	}

	if ($ManyImgPrefix == "") {
		$apiResponse = json_encode(recordNotFoundMsg(0, "ManyImgPrefix param is missing"));
		apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
		echo $apiResponse;
		return;
	}



	if ($PhotoUrl) {
		$PhotoUrl = $PhotoUrl ? ConvertImageAPI($PhotoUrl, $ManyImgPrefix) : $PhotoUrl;
	}

	if ($TransactionItemId == "") {

		if ($SortOrder == "") {
			$apiResponse = json_encode(recordNotFoundMsg(0, "Sort Order param is missing"));
			apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
			echo $apiResponse;
			return;
		}
		

		$query = "INSERT INTO t_transaction_items (TransactionId,CheckName,RowNo,ColumnNo,PhotoUrl,SortOrder) 
		VALUES (:TransactionId, :CheckName, :RowNo, :ColumnNo, :PhotoUrl, :SortOrder);";

		$pList = array(
			'TransactionId' => $TransactionId,
			'CheckName' => $CheckName,
			'RowNo' => $RowNo,
			'ColumnNo' => $ColumnNo,
			'PhotoUrl' => $PhotoUrl,
			'SortOrder' => $SortOrder
		);
	} else {
		//, SortOrder=:SortOrder
		//	'SortOrder' => $SortOrder,
		
		$query = "UPDATE t_transaction_items set CheckName=:CheckName, RowNo=:RowNo, ColumnNo=:ColumnNo, 
			PhotoUrl=:PhotoUrl WHERE TransactionItemId=:TransactionItemId;";

		$pList = array(
			'CheckName' => $CheckName,
			'RowNo' => $RowNo,
			'ColumnNo' => $ColumnNo,
			'PhotoUrl' => $PhotoUrl,
			'TransactionItemId' => $TransactionItemId
		);
	}



	/**Delete item first */
	// foreach ($currentRowDelete as $DelItem) {
	// 	if ($DelItem->TransactionItemId) {
	// 		$query = "DELETE FROM t_transaction_items where TransactionItemId=:TransactionItemId;";
	// 		$pList = array(
	// 			'TransactionItemId' => $TransactionItemId
	// 		);
	// 		$db->bindMore($pList);
	// 		$resultdata = $db->query($query);
	// 	}
	// }



	// echo $query;
	// print_r($pList);

	$db->bindMore($pList);
	$resultdata = $db->query($query);

	if (is_object($resultdata)) {
		$errormsg = $resultdata->errorInfo;
		$apiResponse = json_encode(recordNotFoundMsg(0, $errormsg[2]));
		apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
		echo $apiResponse;
	} else {

		if ($TransactionItemId == "") {
			$TransactionItemId = $db->lastInsertId();
		}

		$response = array(["SysValue" => 1, "SysMessage" => "Data has been saved successfully", "TransactionItemId" => $TransactionItemId]);
		$apiResponse = json_encode($response);
		echo $apiResponse;
		apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
	}
} catch (PDOException $e) {
	$apiResponse = json_encode(recordNotFoundMsg(0, $e->getMessage()));
	apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
	echo $apiResponse;
}
