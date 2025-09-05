<?php
try {

	apiLogWrite("\n\n========$PageName=======Called (" . date('Y_m_d_H_i_s') . ")===================");
	apiLogWrite("Params (" . date('Y_m_d_H_i_s') . "): " . json_encode($data));

	$db = new Db();
	// $TransactionId = isset($data['TransactionId']) ? checkNull($data['TransactionId']) : "";
	$TransactionItemId = isset($data['TransactionItemId']) ? checkNull($data['TransactionItemId']) : "";

	if ($TransactionItemId == "") {
		$apiResponse = json_encode(recordNotFoundMsg(0, "TransactionItemId param is missing"));
		apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
		echo $apiResponse;
		return;
	}

	$query = "DELETE FROM t_transaction_items WHERE TransactionItemId=:TransactionItemId;";

	$pList = array(
		'TransactionItemId' => $TransactionItemId
	);

	$db->bindMore($pList);
	$resultdata = $db->query($query);

	if (is_object($resultdata)) {
		$errormsg = $resultdata->errorInfo;
		$apiResponse = json_encode(recordNotFoundMsg(0, $errormsg[2]));
		apiLogWrite("Output (" . date('Y_m_d_H_i_s') . "): " . $apiResponse);
		echo $apiResponse;
	} else {
	
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
