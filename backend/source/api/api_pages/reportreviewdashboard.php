<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{
	try {
		$dbh = new Db();

		// $StartDate = trim($data->StartDate);
		// $EndDate = trim($data->EndDate) . " 23:59:59";

		//Report NOT submitted,LOCAL review,Auditor revision,GLOBAL Review,Final review	
		$query = "SELECT c.`LeadStatusName`, b.ProgramName, COUNT(a.`TransactionId`) AuditCount
			FROM `t_transaction` a
			INNER JOIN t_program b ON a.ProgramId=b.ProgramId
			INNER JOIN `t_leadstatus` c ON a.LeadStatusId=c.LeadStatusId
			WHERE a.`LeadStatusId` IN (20,12,14,13,15)
			GROUP BY c.`LeadStatusName`, b.ProgramName;";
		$resultdata = $dbh->query($query);

		// Pivot the data
		$pivotedData = pivotArray($resultdata, 'LeadStatusName', 'ProgramName', 'AuditCount');
 

		$dataList = array();
		$serial = 0;

		$columnlist = array();
		$columnlist[] = ["field" => "Serial", "title" => "SL", "align" => "center", "width" => 20, "frozen" => true];
		$columnlist[] = ["field" => "LeadStatusName", "title" => "Lead Status", "filter" => true, "width" => 120, "frozen" => true];
		foreach ($pivotedData as $status => $programs) {
			foreach ($programs as $programName => $auditCount) {
				// You can process each cell value here if needed
				$columnlist[] = ["field" => "P_" . str_replace(" ", "_", $programName), "title" => $programName,  "width" => 80, "align" => "center",  "bottomCalc" => "sum", "cssClass" => "total-column"];
			}
			break; // Just need the first row to get program names

		}
		// Add Total column at the end
		$columnlist[] = ["field" => "RowTotal", "title" => "Grand Total", "width" => 120, "align" => "center", "cssClass" => "bold-total", "bottomCalc" => "sum"];


		foreach ($pivotedData as $status => $programs) {
			$row = [];
			$row["Serial"] = ++$serial;
			$row["LeadStatusName"] = $status;
			
			$rowTotal = 0; // Initialize row total
			foreach ($programs as $programName => $auditCount) {
				$row["P_" . str_replace(" ", "_", $programName)] = $auditCount;
				$rowTotal += $auditCount; // Add to row total
			}
			$row["RowTotal"] = $rowTotal; // Add the total to the row
			
			$dataList[] = $row;
		}


		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => [
				"column" => $columnlist,
				"data" => $dataList,
			]
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}





/**
 * Pivot array data
 * @param array $data - Query result (array of associative arrays)
 * @param string $rowKey - Column name to use as rows
 * @param string $columnKey - Column name to use as columns
 * @param string $valueKey - Column name to use as values
 * @param mixed $defaultValue - Default value for empty cells
 * @return array - Pivoted data array
 */
function pivotArray($data, $rowKey, $columnKey, $valueKey, $defaultValue = 0)
{
	$pivoted = array();

	foreach ($data as $row) {
		$rowValue = $row[$rowKey];
		$colValue = $row[$columnKey];
		$cellValue = $row[$valueKey];

		if (!isset($pivoted[$rowValue])) {
			$pivoted[$rowValue] = array();
		}

		$pivoted[$rowValue][$colValue] = $cellValue;
	}

	// Fill missing cells with default value
	$allColumns = array();
	foreach ($pivoted as $row) {
		$allColumns = array_merge($allColumns, array_keys($row));
	}
	$allColumns = array_unique($allColumns);

	foreach ($pivoted as &$row) {
		foreach ($allColumns as $col) {
			if (!isset($row[$col])) {
				$row[$col] = $defaultValue;
			}
		}
		ksort($row); // Sort columns alphabetically
	}

	return $pivoted;
}
