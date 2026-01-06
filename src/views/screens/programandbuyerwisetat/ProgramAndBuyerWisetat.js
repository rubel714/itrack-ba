import React, { forwardRef, useRef, useEffect } from "react";
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

// react-tabulator
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { ReactTabulator, reactFormatter } from "react-tabulator";
import * as XLSX from "xlsx-js-style";

const ProgramAndBuyerWisetat = (props) => {
  const serverpage = "programandbuyerwisetat"; // this is .php server page
  const tableRefByProgram = useRef(null);
  const tableRefByBuyer = useRef(null);

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  // const [toggle, setToggle] = useState(true); //true=show tabel, false= show add/edit form

  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [StartDate, setStartDate] = useState(moment().format("YYYY-MM-01"));
  const [EndDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  // const [EndDate, setEndDate] = useState(
  //   moment().add(30, "days").format("YYYY-MM-DD")
  // );

  const [columnList, setColumnList] = useState([]); // Table column list

  // handleChangeWidthHeight
  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const {
    isLoading: isLoading1,
    data: dataListByBuyer,
    error1,
    ExecuteQuery: ExecuteQueryByBuyer,
  } = ExecuteQueryHook(); //Fetch data

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  
    // Export Tabulator data to Excel
    const exportToExcelProgramWiseTAT = () => {
      try {
        // Get the sorted data from the Tabulator instance
        if (!tableRefByProgram.current) {
          alert("Table not initialized");
          return;
        }
  
        const exportData = tableRefByProgram.current.table.getData("active"); // Gets data in current sorted/filtered order
        const columns = columnListByProgram || [];
  
        if (exportData.length === 0) {
          alert("No data to export");
          return;
        }
  
        // Prepare data for export
        const worksheetData = [];
  
        // Add title row
        const titleRow = [`Program wise TAT Day (${moment(StartDate).format("MMM DD, YYYY")} - ${moment(EndDate).format("MMM DD, YYYY")})`];
        // const titleRow = ["Program wise TAT Day"];
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
        // for (let row = 2; row < totalRowIndex; row++) {
        //   // Skip title, header and totals row
        //   const cellAddress = XLSX.utils.encode_cell({ r: row, c: lastColIndex });
        //   if (ws[cellAddress]) {
        //     ws[cellAddress].s = {
        //       font: { bold: true },
        //       // fill: { fgColor: { rgb: "FFFF00" } },
        //     };
        //   }
        // }
  
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Data");
  
        // Generate file name with date
        const fileName = `Program_wise_TAT_Day_${moment().format(
          "YYYY-MM-DD-H-m-s"
        )}.xlsx`;
  
        // Save file
        XLSX.writeFile(wb, fileName);
      } catch (error) {
        console.error("Export error:", error);
        alert("Error exporting to Excel: " + error.message);
      }
    };
  



     const exportToExcelBuyerWiseTATDay = () => {
      try {
        // Get the sorted data from the Tabulator instance
        if (!tableRefByProgram.current) {
          alert("Table not initialized");
          return;
        }
  
        const exportData = tableRefByBuyer.current.table.getData("active"); // Gets data in current sorted/filtered order
        const columns = columnListByBuyer || [];
  
        if (exportData.length === 0) {
          alert("No data to export");
          return;
        }
  
        // Prepare data for export
        const worksheetData = [];
  
        // Add title row
        const titleRow = [`Buyer wise TAT Day (${moment(StartDate).format("MMM DD, YYYY")} - ${moment(EndDate).format("MMM DD, YYYY")})`];
        // const titleRow = ["Buyer wise TAT Day"];
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
        // for (let row = 2; row < totalRowIndex; row++) {
        //   // Skip title, header and totals row
        //   const cellAddress = XLSX.utils.encode_cell({ r: row, c: lastColIndex });
        //   if (ws[cellAddress]) {
        //     ws[cellAddress].s = {
        //       font: { bold: true },
        //       // fill: { fgColor: { rgb: "FFFF00" } },
        //     };
        //   }
        // }
  
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Data");
  
        // Generate file name with date
        const fileName = `Buyer_wise_TAT_Day_${moment().format(
          "YYYY-MM-DD-H-m-s"
        )}.xlsx`;
  
        // Save file
        XLSX.writeFile(wb, fileName);
      } catch (error) {
        console.error("Export error:", error);
        alert("Error exporting to Excel: " + error.message);
      }
    };
  
  // const PrintPDFExcelExportFunction = (reportType) => {
  //   let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

  //   window.open(
  //     finalUrl +
  //       "?action=ReportReviewDashboardByReleaseDateExport" +
  //       "&reportType=excel" +
  //       "&StartDate=" +
  //       StartDate +
  //       "&EndDate=" +
  //       EndDate +
  //       "&UserId=" +
  //       UserInfo.UserId +
  //       "&RoleId=" +
  //       UserInfo.RoleId[0] +
  //       "&TimeStamp=" +
  //       Date.now()
  //   );
  // };

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

  const columnListByProgram = [
    // { field: "rownumber", label: "SL", align: "center", width: "3%" },

    {
      field: "ProgramName",
      title: "Program",
      hozAlign: "left",
      headerHozAlign: "left",
      // filter: true,
      width: "200",
    },
    {
      field: "ReportReleased",
      title: "Report Released",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "150",
      bottomCalc: "sum",
    },
    {
      field: "CurrentTAT",
      title: "Current TAT",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "120",
      bottomCalc: "sum",
           bottomCalcFormatter: function (cell) {
        let value = cell.getValue();
        return value ? value.toFixed(2) : "0.00";
    }
    },
    {
      field: "StandardTATDay",
      title: "Standard TAT",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "130",
      bottomCalc: "sum",
           bottomCalcFormatter: function (cell) {
        let value = cell.getValue();
        return value ? value.toFixed(2) : "0.00";
    }
    },
  ];

  const columnListByBuyer = [
    // { field: "rownumber", label: "SL", align: "center", width: "3%" },

    {
      field: "BuyerName",
      title: "Buyer Name",
      hozAlign: "left",
      headerHozAlign: "left",
      // filter: true,
      width: "200",
    },
    {
      field: "ReportReleased",
      title: "Report Released",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "150",
      bottomCalc: "sum",
    },
    {
      field: "CurrentTAT",
      title: "Current TAT",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "120",
      bottomCalc: "sum",
      bottomCalcFormatter: function (cell) {
        let value = cell.getValue();
        return value ? value.toFixed(2) : "0.00";
    }
    },
    {
      field: "StandardTATDay",
      title: "Standard TAT",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "130",
      bottomCalc: "sum",
           bottomCalcFormatter: function (cell) {
        let value = cell.getValue();
        return value ? value.toFixed(2) : "0.00";
    }
    },
  ];

  React.useEffect(() => {}, []);

  if (bFirst) {
    /**First time call for datalist */
    getDataList();
    getDataByBuyerList();
    setBFirst(false);
  }

  useEffect(() => {
    getDataList();
    getDataByBuyerList();
  }, [StartDate, EndDate]);

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      StartDate: StartDate,
      EndDate: EndDate,
    };

    ExecuteQuery(serverpage, params);
  }

  /**Get data for table list */
  function getDataByBuyerList() {
    let params = {
      action: "getDataByBuyerList",
      lan: language(),
      UserId: UserInfo.UserId,
      StartDate: StartDate,
      EndDate: EndDate,
    };

    ExecuteQueryByBuyer(serverpage, params);
  }

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Dashboard ❯ Program And Buyer Wise TAT</h4>
        </div>

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
        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID---####s --> */}

        <div class="tableTwoColumn">
          <div>
            <div class="searchAdd">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <span>Program wise TAT Day</span>

                <button
                  onClick={() => exportToExcelProgramWiseTAT()}
                  style={{
                    padding: "0px 16px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    // marginTop: "20px",
                  }}
                >
                  Export to Excel
                </button>
              </div>
            </div>
            <ReactTabulator
              ref={tableRefByProgram}
              data={dataList ? dataList : []}
              columns={columnListByProgram}
              height="530px"
              layout="fitData"
              initialSort={[
                //set the initial sort order of the data
                { column: "AuditCount", dir: "desc" },
              ]}
            />
          </div>

          <div>
            <div class="searchAdd">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <span>Buyer wise TAT Day</span>
                <button
                  onClick={() => exportToExcelBuyerWiseTATDay()}
                  style={{
                    padding: "0px 16px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    // marginTop: "20px",
                  }}
                >
                  Export to Excel
                </button>
              </div>
            </div>
            <ReactTabulator
              ref={tableRefByBuyer}
              data={dataListByBuyer ? dataListByBuyer : []}
              columns={columnListByBuyer}
              height="530px"
              layout="fitData"
              initialSort={[
                //set the initial sort order of the data
                { column: "AuditCount", dir: "desc" },
              ]}
            />
          </div>

        </div>

      </div>
    </>
  );
};

export default ProgramAndBuyerWisetat;
