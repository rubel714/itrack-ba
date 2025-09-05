<?php

function apiLogWrite($logText)
{

	$logFileName = "../../../media/log/apilog" . date('Y') . ".txt";
	file_put_contents($logFileName, $logText . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function recordNotFoundMsg($SysValue = 0, $SysMessage = "No record found")
{
	$dList = array(["SysValue" => $SysValue, "SysMessage" => $SysMessage]);
	return $dList;
}

function checkNull($value)
{
	return $value ? $value : null;
}

function convertAppToDBDate($appDate)
{
	if ($appDate) {
		$DateConvert = DateTime::createFromFormat('d-M-Y', $appDate);
		$DateConvertDB = $DateConvert->format('Y-m-d');
		return $DateConvertDB;
	} else {
		return $appDate;
	}
}

function convertAppToDBDateTime($appDate)
{
	if ($appDate) {
		$DateConvert = DateTime::createFromFormat('d-M-Y h:i A', $appDate);
		$DateConvertDB = $DateConvert->format('Y-m-d H:i');
		return $DateConvertDB;
	} else {
		return $appDate;
	}
}




function ConvertFileAPI($base64_string, $prefix, $extention = null)
{

	$path = "../../../image/transaction/" . $prefix;

	if (!file_exists($path)) {
		mkdir($path, 0777, true);
	}

	$targetDir = '../../../image/transaction/' . $prefix;
	$exploded = explode(',', $base64_string, 2);
	if (!$extention) {
		$extention = explode(';', explode('/', $exploded[0])[1])[0];
	}
	$decoded = base64_decode($exploded[1]);
	$output_file = $prefix . "_cover_" . date("Y_m_d_H_i_s") . "_" . rand(1, 9999) . "." . $extention;
	file_put_contents($targetDir . "/" . $output_file, $decoded);
	return $output_file;
}


function ConvertImageAPI($base64_string, $prefix, $extention = null)
{

	$path = "../../../image/transaction/" . $prefix;

	if (!file_exists($path)) {
		mkdir($path, 0777, true);
	}

	$targetDir = '../../../image/transaction/' . $prefix;
	$exploded = explode(',', $base64_string, 2);
	if (!$extention) {
		$extention = explode(';', explode('/', $exploded[0])[1])[0];
	}
	$decoded = base64_decode($exploded[1]);
	$output_file = $prefix . "_" . date("Y_m_d_H_i_s") . "_" . rand(1, 9999) . "." . $extention;
	// $output_file = date("Y_m_d_H_i_s") . rand(1, 9999) . "." . $extention;
	/**Image file name */
	file_put_contents($targetDir . "/" . $output_file, $decoded);
	return $output_file;
}
