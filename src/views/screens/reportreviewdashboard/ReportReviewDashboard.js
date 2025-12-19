import React, { forwardRef, useRef, useEffect } from "react";
import swal from "sweetalert";
import {
  DeleteOutline,
  Edit,
  AddAPhoto,
  PictureAsPdf,
} from "@material-ui/icons";
import { Button } from "../../../components/CustomControl/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";
import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiCallReport,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import moment from "moment";
import "../../../assets/css/audit.css";

import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
} from "@material-ui/core";
// react-tabulator
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { ReactTabulator, reactFormatter } from "react-tabulator";
import * as XLSX from "xlsx-js-style";

const ReportReviewDashboard = (props) => {
  const serverpage = "reportreviewdashboard"; // this is .php server page
  const tableRef = useRef(null);
  const tableRefByReleaseDate = useRef(null);

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  // const [toggle, setToggle] = useState(true); //true=show tabel, false= show add/edit form

  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();
 
  const [StartDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
    const [EndDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  // const [EndDate, setEndDate] = useState(
  //   moment().add(30, "days").format("YYYY-MM-DD")
  // );

  const [columnList, setColumnList] = useState([]); // Table column list

  // handleChangeWidthHeight
  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const { isLoading:isLoading1, data: dataListByReleaseDate, error1, ExecuteQuery:ExecuteQueryByReleaseDate } = ExecuteQueryHook(); //Fetch data
 
  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=ReportReviewDashboardByReleaseDateExport" +
        "&reportType=excel" +
        "&StartDate=" +
        StartDate +
        "&EndDate=" +
        EndDate +
        "&UserId=" +
        UserInfo.UserId +
        "&RoleId=" +
        UserInfo.RoleId[0] +
        "&TimeStamp=" +
        Date.now()
    );
  };



  // Export Tabulator data to Excel
  const exportToExcel = () => {
    try {
      // Get the sorted data from the Tabulator instance
      if (!tableRef.current) {
        alert("Table not initialized");
        return;
      }

      const exportData = tableRef.current.table.getData("active"); // Gets data in current sorted/filtered order
      const columns = dataList.column || [];

      if (exportData.length === 0) {
        alert("No data to export");
        return;
      }

      // Prepare data for export
      const worksheetData = [];

      // Add title row
      // const titleRow = [`Report Review Dashboard (${moment(StartDate).format("MMM DD, YYYY")} - ${moment(EndDate).format("MMM DD, YYYY")})`];
      const titleRow = ["Report Review Dashboard"];
      worksheetData.push(titleRow);

      // Add headers
      const headers = columns.map((col) => col.title || col.field || "");
      worksheetData.push(headers);

      // Add data rows
      exportData.forEach((row) => {
        const rowData = columns.map((col) => {
          const field = col.field;
          return row[field] !== undefined ? row[field] : "";
        });
        worksheetData.push(rowData);
      });

      // Calculate and add totals row
      const totalsRow = columns.map((col) => {
        if (col.bottomCalc === "sum") {
          // Calculate sum for this column
          const sum = exportData.reduce((acc, row) => {
            const value = parseFloat(row[col.field]) || 0;
            return acc + value;
          }, 0);
          return sum;
        }
        return col.field === "ReportWriter" ? "Total:" : ""; // Add "Total:" label in first text column
      });
      worksheetData.push(totalsRow);

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      // Apply formatting
      const range = XLSX.utils.decode_range(ws["!ref"]);
      const totalRowIndex = worksheetData.length - 1;
      const lastColIndex = range.e.c; // Last column index

      // Style title row (row 0) - merged cell
      const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
      if (ws[titleCell]) {
        ws[titleCell].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
      // Merge title across all columns
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: lastColIndex } }];

      for (let col = range.s.c; col <= range.e.c; col++) {
        // Bold header row (row 1)
        const headerCell = XLSX.utils.encode_cell({ r: 1, c: col });
        if (ws[headerCell]) {
          ws[headerCell].s = {
            font: { bold: true },
            // fill: { fgColor: { rgb: "D3D3D3" } },
          };
        }

        // Bold totals row (last row)
        const totalCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
        if (ws[totalCell]) {
          ws[totalCell].s = {
            font: { bold: true },
            // fill: { fgColor: { rgb: "FFFF00" } },
          };
        }
      }

      // Bold and color last column (Grand Total column) for all data rows
      for (let row = 2; row < totalRowIndex; row++) {
        // Skip title, header and totals row
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: lastColIndex });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true },
            // fill: { fgColor: { rgb: "FFFF00" } },
          };
        }
      }

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Data");

      // Generate file name with date
      const fileName = `report_review_dashboard_${moment().format(
        "YYYY-MM-DD-H-m-s"
      )}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting to Excel: " + error.message);
    }
  };

 
  /* =====End of Excel Export Code==== */

  const handleChangeFilterDate = (e) => {
    const { name, value } = e.target;
    if (name === "StartDate") {
      setStartDate(value);
    }

    if (name === "EndDate") {
      setEndDate(value);
    }
  };


  
  const columnListByReleaseDate = [
    // { field: "rownumber", label: "SL", align: "center", width: "3%" },
 
    {
      field: "ProgramName",
      title: "Program",
      hozAlign: "left",
      headerHozAlign: "left",
      // filter: true,
      width: "400",
    },
    {
      field: "AuditCount",
      title: "No of Reports",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "180",
      cssClass: "bold-total", 
      bottomCalc: "sum"
    }
  ];


  React.useEffect(() => {
  }, []);

  if (bFirst) {
    /**First time call for datalist */
    getDataList();
    setBFirst(false);
  }

  useEffect(() => {
    getDataByReleaseDateList();
  }, [StartDate, EndDate]);

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      // StartDate: StartDate,
      // EndDate: EndDate,
    };

    ExecuteQuery(serverpage, params);
  }



  /**Get data for table list */
  function getDataByReleaseDateList() {
    let params = {
      action: "getDataByReleaseDateList",
      lan: language(),
      UserId: UserInfo.UserId,
      StartDate: StartDate,
      EndDate: EndDate,
    };

    ExecuteQueryByReleaseDate(serverpage, params);
  }
  


  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Dashboard ❯ Report Review Dashboard</h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd">
          <div>
            <button
              onClick={exportToExcel}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Export to Excel
            </button>
          </div>
        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID---####s --> */}


        <ReactTabulator
          ref={tableRef}
          data={dataList.data ? dataList.data : []}
          columns={dataList.column ? dataList.column : []}
          height="200px"
          layout="fitData"
          initialSort={[
            //set the initial sort order of the data
            { column: "RowTotal", dir: "desc" },
          ]}
        />


{/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd">
          <div>
            <label>Release Start Date</label>
            <div class="">
              <input
                type="date"
                id="StartDate"
                name="StartDate"
                value={StartDate}
                onChange={(e) => handleChangeFilterDate(e)}
              />
            </div>
          </div>

          <div>
            <label>Release End Date</label>
            <div class="">
              <input
                type="date"
                id="EndDate"
                name="EndDate"
                value={EndDate}
                onChange={(e) => handleChangeFilterDate(e)}
              />
            </div>
          </div>

          <div>
            <button
              onClick={() => PrintPDFExcelExportFunction('excel')}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Export to Excel
            </button>
          </div>
        </div>
        <ReactTabulator
          ref={tableRefByReleaseDate}
          data={dataListByReleaseDate ? dataListByReleaseDate : []}
          columns={columnListByReleaseDate  }
          height="330px"
          layout="fitData"
          initialSort={[
            //set the initial sort order of the data
            { column: "AuditCount", dir: "desc" },
          ]}
        />
      </div>
      {/* <!-- BODY CONTAINER END --> */}
    </>
  );
};

export default ReportReviewDashboard;
