<?php

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES) && count($_FILES)>0) {
	$targetDir = "./../../../image/transaction/";

	if (!is_dir($targetDir)) {
		mkdir($targetDir, 0755, true);
	}


	$chk = 1;
	foreach($_FILES as $key=>$FILE){
		$fileName = $key . "_" . basename($FILE["name"]);
		$targetFilePath = $targetDir . $fileName;

		if(!(move_uploaded_file($FILE["tmp_name"], $targetFilePath))){
			$chk = 0;
		}
	}
	

	if ($chk == 1) {
		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "File uploaded successfully.",
			"filename" =>  ""//$fileName
		];
	} else {
		$returnData = [
			"success" => 0,
			"status" => 401,
			"message" => "Error uploading file.",
			"filename" =>  ""//$fileName
		];
	}
} else {
	$returnData = [
		"success" => 0,
		"status" => 401,
		"message" => "Invalid request.",
		"filename" =>  ""
	];
}
