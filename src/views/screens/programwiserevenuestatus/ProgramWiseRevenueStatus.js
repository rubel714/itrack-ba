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

const ProgramWiseRevenueStatus = (props) => {
  const serverpage = "programwiserevenuestatus"; // this is .php server page
  const tableRefByProgram = useRef(null);
  const tableRefByBuyer = useRef(null);
  const tableRefYTDStatus = useRef(null);
  const tableRefLostRevenue = useRef(null);

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  // const [toggle, setToggle] = useState(true); //true=show tabel, false= show add/edit form

  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [StartDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  // const [EndDate, setEndDate] = useState(
  //   moment().add(30, "days").format("YYYY-MM-DD")
  // );

  const [columnList, setColumnList] = useState([]); // Table column list

  // handleChangeWidthHeight
  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const {
    isLoading: isLoading1,
    data: dataListMTDStatusRevenue,
    error1,
    ExecuteQuery: ExecuteQueryByBuyer,
  } = ExecuteQueryHook(); //Fetch data
  const {
    isLoading: isLoading2,
    data: dataListYTDStatus,
    error2,
    ExecuteQuery: ExecuteQueryYTDStatus,
  } = ExecuteQueryHook(); //Fetch data
  const {
    isLoading: isLoading3,
    data: dataListLostRevenue,
    error3,
    ExecuteQuery: ExecuteQueryLostRevenue,
  } = ExecuteQueryHook(); //Fetch data

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  // Export Tabulator data to Excel
  const exportToExcelTodayStatus = () => {
    try {
      // Get the sorted data from the Tabulator instance
      if (!tableRefByProgram.current) {
        alert("Table not initialized");
        return;
      }

      const exportData = tableRefByProgram.current.table.getData("active"); // Gets data in current sorted/filtered order
      const columns = columnListTodayStatus || [];

      if (exportData.length === 0) {
        alert("No data to export");
        return;
      }

      // Prepare data for export
      const worksheetData = [];

      // Add title row
      const titleRow = [
        `Today Status (${moment(StartDate).format(
          "MMM DD, YYYY",
        )})`,
      ];
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
        if (col.bottomCalc === "avg") {
          // Calculate average for this column
          const values = exportData.map(
            (row) => parseFloat(row[col.field]) || 0,
          );
          const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
          return parseFloat(avg.toFixed(2));
        }
        // Handle custom bottomCalc functions
        if (typeof col.bottomCalc === "function") {
          const values = exportData.map((row) => parseFloat(row[col.field]) || 0);
          return col.bottomCalc(values, exportData, col.bottomCalcParams || {});
        }
        return col.field === "ProgramName" ? "Total:" : ""; // Add "Total:" label in first text column
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

        // Right align data rows for numeric columns
        for (let row = 2; row < totalRowIndex; row++) {
          const dataCell = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[dataCell] && col > 0) {
            ws[dataCell].s = { alignment: { horizontal: "right" } };
          }
        }

        // Bold totals row (last row) with right alignment
        const totalCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
        if (ws[totalCell]) {
          ws[totalCell].s = {
            font: { bold: true },
            alignment: { horizontal: col === 0 ? "left" : "right" },
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
      const fileName = `Program_wise_Revenue_Status_${moment().format(
        "YYYY-MM-DD-H-m-s",
      )}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting to Excel: " + error.message);
    }
  };

  const exportToExcelMTDStatusRevenue = () => {
    try {
      // Get the sorted data from the Tabulator instance
      if (!tableRefByBuyer.current) {
        alert("Table not initialized");
        return;
      }

      const exportData = tableRefByBuyer.current.table.getData("active"); // Gets data in current sorted/filtered order
      const columns = columnListMTDStatusRevenue || [];

      if (exportData.length === 0) {
        alert("No data to export");
        return;
      }

      // Prepare data for export
      const worksheetData = [];

      // Add title row
      const titleRow = [
        `MTD Status (Revenue) (${moment(StartDate).format(
          "MMM DD, YYYY",
        )})`,
      ]; 
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
        if (col.bottomCalc === "avg") {
          // Calculate average for this column
          const values = exportData.map(
            (row) => parseFloat(row[col.field]) || 0,
          );
          const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
          return parseFloat(avg.toFixed(2));
        }
        // Handle custom bottomCalc functions
        if (typeof col.bottomCalc === "function") {
          const values = exportData.map((row) => parseFloat(row[col.field]) || 0);
          return col.bottomCalc(values, exportData, col.bottomCalcParams || {});
        }
        return col.field === "BuyerName" ? "Total:" : ""; // Add "Total:" label in first text column
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

        // Right align data rows for numeric columns
        for (let row = 2; row < totalRowIndex; row++) {
          const dataCell = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[dataCell] && col > 0) {
            ws[dataCell].s = { alignment: { horizontal: "right" } };
          }
        }

        // Bold totals row (last row) with right alignment
        const totalCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
        if (ws[totalCell]) {
          ws[totalCell].s = {
            font: { bold: true },
            alignment: { horizontal: col === 0 ? "left" : "right" },
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
      const fileName = `MTD_Status_Revenue_${moment().format(
        "YYYY-MM-DD-H-m-s",
      )}.xlsx`;

      // Save file
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting to Excel: " + error.message);
    }
  };

  const exportToExcelYTDStatus = () => {
    try {
      if (!tableRefYTDStatus.current) {
        alert("Table not initialized");
        return;
      }

      const exportData = tableRefYTDStatus.current.table.getData("active");
      const columns = columnListYTDStatus || [];

      if (exportData.length === 0) {
        alert("No data to export");
        return;
      }

      const worksheetData = [];

      const titleRow = [`YTD Status (${moment(StartDate).format("MMM DD, YYYY")})` ];
      worksheetData.push(titleRow);

      const headers = columns.map((col) => col.title || col.field || "");
      worksheetData.push(headers);

      exportData.forEach((row) => {
        const rowData = columns.map((col) => {
          const field = col.field;
          return row[field] !== undefined ? row[field] : "";
        });
        worksheetData.push(rowData);
      });

      const totalsRow = columns.map((col) => {
        if (col.bottomCalc === "sum") {
          const sum = exportData.reduce((acc, row) => {
            const value = parseFloat(row[col.field]) || 0;
            return acc + value;
          }, 0);
          return sum;
        }
        if (col.bottomCalc === "avg") {
          const values = exportData.map((row) => parseFloat(row[col.field]) || 0);
          const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
          return parseFloat(avg.toFixed(2));
        }
        if (typeof col.bottomCalc === "function") {
          const values = exportData.map((row) => parseFloat(row[col.field]) || 0);
          return col.bottomCalc(values, exportData, col.bottomCalcParams || {});
        }
        return col.field === "ProgramCategoryName" ? "Total:" : "";
      });
      worksheetData.push(totalsRow);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      const range = XLSX.utils.decode_range(ws["!ref"]);
      const totalRowIndex = worksheetData.length - 1;
      const lastColIndex = range.e.c;

      const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
      if (ws[titleCell]) {
        ws[titleCell].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: lastColIndex } }];

      for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: 1, c: col });
        if (ws[headerCell]) {
          ws[headerCell].s = { font: { bold: true } };
        }
        // Right align data rows for numeric columns
        for (let row = 2; row < totalRowIndex; row++) {
          const dataCell = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[dataCell] && col > 0) {
            ws[dataCell].s = { alignment: { horizontal: "right" } };
          }
        }
        const totalCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
        if (ws[totalCell]) {
          ws[totalCell].s = {
            font: { bold: true },
            alignment: { horizontal: col === 0 ? "left" : "right" },
          };
        }
      }

      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const fileName = `YTD_Status_${moment().format("YYYY-MM-DD-H-m-s")}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting to Excel: " + error.message);
    }
  };

  const exportToExcelLostRevenue = () => {
    try {
      if (!tableRefLostRevenue.current) {
        alert("Table not initialized");
        return;
      }

      const exportData = tableRefLostRevenue.current.table.getData("active");
      const columns = columnListLostRevenue || [];

      if (exportData.length === 0) {
        alert("No data to export");
        return;
      }

      const worksheetData = [];

      const titleRow = [`Lost Revenue (${moment(StartDate).format("MMM DD, YYYY")})` ];
      worksheetData.push(titleRow);

      const headers = columns.map((col) => col.title || col.field || "");
      worksheetData.push(headers);

      exportData.forEach((row) => {
        const rowData = columns.map((col) => {
          const field = col.field;
          return row[field] !== undefined ? row[field] : "";
        });
        worksheetData.push(rowData);
      });

      const totalsRow = columns.map((col) => {
        if (col.bottomCalc === "sum") {
          const sum = exportData.reduce((acc, row) => {
            const value = parseFloat(row[col.field]) || 0;
            return acc + value;
          }, 0);
          return sum;
        }
        if (col.bottomCalc === "avg") {
          const values = exportData.map((row) => parseFloat(row[col.field]) || 0);
          const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
          return parseFloat(avg.toFixed(2));
        }
        if (typeof col.bottomCalc === "function") {
          const values = exportData.map((row) => parseFloat(row[col.field]) || 0);
          return col.bottomCalc(values, exportData, col.bottomCalcParams || {});
        }
        return col.field === "ProgramCategoryName" ? "Total:" : "";
      });
      worksheetData.push(totalsRow);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      const range = XLSX.utils.decode_range(ws["!ref"]);
      const totalRowIndex = worksheetData.length - 1;
      const lastColIndex = range.e.c;

      const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
      if (ws[titleCell]) {
        ws[titleCell].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: lastColIndex } }];

      for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: 1, c: col });
        if (ws[headerCell]) {
          ws[headerCell].s = { font: { bold: true } };
        }
        // Right align data rows for numeric columns
        for (let row = 2; row < totalRowIndex; row++) {
          const dataCell = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[dataCell] && col > 0) {
            ws[dataCell].s = { alignment: { horizontal: "right" } };
          }
        }
        const totalCell = XLSX.utils.encode_cell({ r: totalRowIndex, c: col });
        if (ws[totalCell]) {
          ws[totalCell].s = {
            font: { bold: true },
            alignment: { horizontal: col === 0 ? "left" : "right" },
          };
        }
      }

      XLSX.utils.book_append_sheet(wb, ws, "Data");
      const fileName = `Lost_Revenue_${moment().format("YYYY-MM-DD-H-m-s")}.xlsx`;
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
  };

  const columnListTodayStatus = [
    // { field: "rownumber", label: "SL", align: "center", width: "3%" },

    {
      field: "ProgramCategoryName",
      title: "Programs Category",
      hozAlign: "left",
      headerHozAlign: "left",
      // filter: true,
      width: "160",
    },
    {
      field: "RevenueGBPK",
      title: "Revenue (GBPK)",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "150",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "NoOfJobs",
      title: "No. of Jobs",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "120",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "NoOfMDs",
      title: "No. of MDs",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "130",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
  ];

  const columnListMTDStatusRevenue = [
    // { field: "rownumber", label: "SL", align: "center", width: "3%" },

    {
      field: "ProgramCategoryName",
      title: "Programs Category ",
      hozAlign: "left",
      headerHozAlign: "left",
      // filter: true,
      width: "140",
    },
    {
      field: "PerformedRevenue",
      title: "Performed Revenue",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "110",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "ConfirmedRevenue",
      title: "Confirmed Revenue",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "110",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "InprogressRevenue",
      title: "In-progress Revenue",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "110",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "TotalRevenue",
      title: "Total Revenue",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "85",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
  ];

  const columnListYTDStatus = [
    {
      field: "ProgramCategoryName",
      title: "Programs Category",
      hozAlign: "left",
      headerHozAlign: "left",
      width: "140",
    },
    {
      field: "PerformedRevenue",
      title: "Performed Revenue",
      hozAlign: "right",
      headerHozAlign: "right",
      width: "150",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "PerformedJobs",
      title: "Performed Jobs",
      hozAlign: "right",
      headerHozAlign: "right",
      width: "150",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "PerformedManday",
      title: "Performed Manday",
      hozAlign: "right",
      headerHozAlign: "right",
      width: "150",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
  ];



  
  const columnListLostRevenue = [
    {
      field: "ProgramCategoryName",
      title: "Programs Category",
      hozAlign: "left",
      headerHozAlign: "left",
      width: "130",
    },
    {
      field: "MTDNoOfJob",
      title: "MTD Jobs",
      hozAlign: "right",
      headerHozAlign: "right",
      width: "105",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "MTDRevenueBDT",
      title: "MTD Revenue",
      hozAlign: "right",
      headerHozAlign: "right",
      width: "120",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "YTDNoOfJob",
      title: "YTD Jobs",
      hozAlign: "right",
      headerHozAlign: "right",
      width: "100",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "YTDRevenueBDT",
      title: "YTD Revenue",
      hozAlign: "right",
      headerHozAlign: "right",
      width: "120",
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
  ];
  
  React.useEffect(() => {}, []);

  if (bFirst) {
    /**First time call for datalist */
    getDataList();
    getDataMTDStatusRevenueList();
    getYTDStatusList();
    getLostRevenueList();
    setBFirst(false);
  }

  useEffect(() => {
    getDataList();
    getDataMTDStatusRevenueList();
    getYTDStatusList();
    getLostRevenueList();
  }, [StartDate]);

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      StartDate: StartDate,
    };

    ExecuteQuery(serverpage, params);
  }

  /**Get data for table list */
  function getDataMTDStatusRevenueList() {
    let params = {
      action: "getDataMTDStatusRevenueList",
      lan: language(),
      UserId: UserInfo.UserId,
      StartDate: StartDate,
    };

    ExecuteQueryByBuyer(serverpage, params);
  }

  /**Get data for YTD Status table */
  function getYTDStatusList() {
    let params = {
      action: "getYTDStatusList",
      lan: language(),
      UserId: UserInfo.UserId,
      StartDate: StartDate,
    };

    ExecuteQueryYTDStatus(serverpage, params);
  }

  /**Get data for Lost Revenue table */
  function getLostRevenueList() {
    let params = {
      action: "getLostRevenueList",
      lan: language(),
      UserId: UserInfo.UserId,
      StartDate: StartDate,
    };

    ExecuteQueryLostRevenue(serverpage, params);
  }

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Dashboard ❯ Program Wise Revenue Status</h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd">
          <div>
            <label>Date</label>
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
                <span>Today Status</span>

                <button
                  onClick={() => exportToExcelTodayStatus()}
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
              data={dataList.data ? dataList.data : []}
              columns={columnListTodayStatus}
              height="220px"
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
                <span>MTD Status (Revenue)</span>
                <button
                  onClick={() => exportToExcelMTDStatusRevenue()}
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
              data={dataListMTDStatusRevenue.data ? dataListMTDStatusRevenue.data : []}
              columns={columnListMTDStatusRevenue}
              height="220px"
              layout="fitData"
              initialSort={[
                //set the initial sort order of the data
                { column: "AuditCount", dir: "desc" },
              ]}
            />
          </div>
        </div>

        {/* <!-- ####---SECOND ROW OF TABLES---#### --> */}
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
                <span>YTD Status</span>
                <button
                  onClick={() => exportToExcelYTDStatus()}
                  style={{
                    padding: "0px 16px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Export to Excel
                </button>
              </div>
            </div>
            <ReactTabulator
              ref={tableRefYTDStatus}
              data={dataListYTDStatus.data ? dataListYTDStatus.data : []}
              columns={columnListYTDStatus}
              height="220px"
              layout="fitData"
              initialSort={[
                { column: "PerformedRevenue", dir: "desc" },
              ]}
            />
          </div>

          <div>
            {/* Placeholder for 2nd table */}
            <div class="searchAdd">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <span>Lost (Revenue)</span>
                <button
                  onClick={() => exportToExcelLostRevenue()}
                  style={{
                    padding: "0px 16px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Export to Excel
                </button>
              </div>
            </div>
            <ReactTabulator
              ref={tableRefLostRevenue}
              data={dataListLostRevenue.data ? dataListLostRevenue.data : []}
              columns={columnListLostRevenue}
              height="220px"
              layout="fitData"
              initialSort={[
                { column: "YTDRevenue", dir: "desc" },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramWiseRevenueStatus;
