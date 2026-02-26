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

const SalesDashboard = (props) => {
  const serverpage = "salesdashboard"; // this is .php server page
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
    isLoading: isLoadingOverall,
    data: overallData,
    error: errorOverall,
    ExecuteQuery: ExecuteQueryOverall,
  } = ExecuteQueryHook(); //Fetch overall summary data

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
      const titleRow = [
        `Program wise TAT Day (${moment(StartDate).format(
          "MMM DD, YYYY",
        )} - ${moment(EndDate).format("MMM DD, YYYY")})`,
      ];
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
          const values = exportData.map(
            (row) => parseFloat(row[col.field]) || 0,
          );
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
      const fileName = `Program_wise_TAT_Day_${moment().format(
        "YYYY-MM-DD-H-m-s",
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

  const columnListByProgram = [
    {
      field: "ProgramName",
      title: "Sales Person",
      hozAlign: "left",
      headerHozAlign: "left",
      width: "150",
    },
    {
      title: "Today Status", // Spanning header

      hozAlign: "center",
      headerHozAlign: "center",
      columns: [
        {
          field: "ReportReleased",
          title: "Onsite<br/>Activity",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "90",
        },
        {
          field: "CurrentTAT",
          title: "Offsite<br/>Activity",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "90",
        },
        {
          field: "CurrentTAT",
          title: "Perform<br/>Jobs",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "88",
        },
        {
          field: "CurrentTAT",
          title: "Perform<br/>Mandays",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "95",
        },
        {
          field: "CurrentTAT",
          title: "Revenue",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "93", 
        },
      ],
    },
    {
      title: "MTD Activity", // Another spanning header
      hozAlign: "center",
      headerHozAlign: "center",
       columns: [
        {
          field: "ReportReleased",
          title: "Onsite<br/>Activity",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "90",
        },
        {
          field: "CurrentTAT",
          title: "Offsite<br/>Activity",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "90",
        },
        {
          field: "CurrentTAT",
          title: "Perform<br/>Jobs",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "88",
        },
        {
          field: "CurrentTAT",
          title: "Perform<br/>Mandays",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "95",
        },
        {
          field: "CurrentTAT",
          title: "Revenue",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "93", 
        },
      ],
    },
    {
      title: "Target", // Another spanning header
      hozAlign: "center",
      headerHozAlign: "center",
      columns: [
        {
          field: "StandardTATDay",
          title: "Onsite<br/>Activity",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "90",
        },
        {
          field: "StandardTATDay",
          title: "Offsite<br/>Activity",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "90",
        },
        {
          field: "StandardTATDay",
          title: "Revenue",
          hozAlign: "right",
          headerHozAlign: "right",
          // width: "93",
        },
      ],
    },
  ];

  React.useEffect(() => {}, []);

  if (bFirst) {
    /**First time call for datalist */
    getDataList();
    getOverallSummary();
    setBFirst(false);
  }

  useEffect(() => {
    getDataList();
    getOverallSummary();
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

  /**Get overall summary data */
  function getOverallSummary() {
    let params = {
      action: "getOverallSummary",
      lan: language(),
      UserId: UserInfo.UserId,
      StartDate: StartDate,
      EndDate: EndDate,
    };

    ExecuteQueryOverall(serverpage, params);
  }

  // Helper function to calculate percentage
  const calcPercentage = (value, target) => {
    if (!target || target === 0) return 0;
    return Math.round((value / target) * 100);
  };

  // Helper function to get progress bar color
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return "#1cc88a";
    if (percentage >= 50) return "#f6c23e";
    return "#e74a3b";
  };

  // Safe accessor for overallData to prevent undefined errors
  const overall = overallData || {};

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Dashboard ❯ Sales Dashboard</h4>
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

        {/* <!-- ####---OVERALL SUMMARY TABLE---#### --> */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: "rgb(246, 194, 62)",
              color: "#fff",
              padding: "12px 20px",
              fontSize: "16px",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Overall
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              {/* Row 1 - Onsite Activity */}
              <tr
                style={{
                  backgroundColor: "#f8f9fc",
                  transition: "background-color 0.2s",
                }}
              >
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    width: "20%",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    Todays Onsite Activity
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    width: "10%",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#4e73df",
                      fontSize: "16px",
                    }}
                  >
                    {overall.TodaysOnsiteActivity || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    width: "20%",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    MTD Onsite Activity
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    width: "10%",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#1cc88a",
                      fontSize: "16px",
                    }}
                  >
                    {overall.MTDOnsiteActivity || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    width: "15%",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    Target
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    width: "10%",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#858796",
                      fontSize: "16px",
                    }}
                  >
                    {overall.TargetOnsiteActivity || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    width: "15%",
                  }}
                >
                  {(() => {
                    const pct = calcPercentage(
                      overall.MTDOnsiteActivity,
                      overall.TargetOnsiteActivity,
                    );
                    const color = getProgressColor(pct);
                    return (
                      <>
                        <div
                          style={{
                            width: "100%",
                            backgroundColor: "#e9ecef",
                            borderRadius: "4px",
                            height: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: color,
                              borderRadius: "4px",
                              height: "8px",
                              transition: "width 0.5s ease",
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: "11px", color: color }}>
                          {pct}%
                        </span>
                      </>
                    );
                  })()}
                </td>
              </tr>

              {/* Row 2 - Offsite Activity */}
              <tr
                style={{
                  backgroundColor: "#fff",
                  transition: "background-color 0.2s",
                }}
              >
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    Todays Offsite Activity
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#4e73df",
                      fontSize: "16px",
                    }}
                  >
                    {overall.TodaysOffsiteActivity || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    MTD Offsite Activity
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#1cc88a",
                      fontSize: "16px",
                    }}
                  >
                    {overall.MTDOffsiteActivity || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    Target
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#858796",
                      fontSize: "16px",
                    }}
                  >
                    {overall.TargetOffsiteActivity || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  {(() => {
                    const pct = calcPercentage(
                      overall.MTDOffsiteActivity,
                      overall.TargetOffsiteActivity,
                    );
                    const color = getProgressColor(pct);
                    return (
                      <>
                        <div
                          style={{
                            width: "100%",
                            backgroundColor: "#e9ecef",
                            borderRadius: "4px",
                            height: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: color,
                              borderRadius: "4px",
                              height: "8px",
                              transition: "width 0.5s ease",
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: "11px", color: color }}>
                          {pct}%
                        </span>
                      </>
                    );
                  })()}
                </td>
              </tr>

              {/* Row 3 - Perform Jobs */}
              <tr
                style={{
                  backgroundColor: "#f8f9fc",
                  transition: "background-color 0.2s",
                }}
              >
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    Todays Perform Jobs
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#4e73df",
                      fontSize: "16px",
                    }}
                  >
                    {overall.TodaysPerformJobs || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    MTD Perform Jobs
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#1cc88a",
                      fontSize: "16px",
                    }}
                  >
                    {overall.MTDPerformJobs || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}></span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#858796",
                      fontSize: "16px",
                    }}
                  >
                    -
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#858796" }}>
                    No Target
                  </span>
                </td>
              </tr>

              {/* Row 4 - Perform Mandays */}
              <tr
                style={{
                  backgroundColor: "#fff",
                  transition: "background-color 0.2s",
                }}
              >
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    Todays Perform Mandays
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#4e73df",
                      fontSize: "16px",
                    }}
                  >
                    {overall.TodaysPerformMandays || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    MTD Perform Mandays
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#1cc88a",
                      fontSize: "16px",
                    }}
                  >
                    {overall.MTDPerformMandays || 0}
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}></span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                    textAlign: "right",
                  }}
                >
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#858796",
                      fontSize: "16px",
                    }}
                  >
                    -
                  </span>
                </td>
                <td
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid #e3e6f0",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#858796" }}>
                    No Target
                  </span>
                </td>
              </tr>

              {/* Row 5 - Revenue */}
              <tr
                style={{
                  backgroundColor: "#f8f9fc",
                  transition: "background-color 0.2s",
                }}
              >
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    Todays Revenue
                  </span>
                </td>
                <td style={{ padding: "12px 20px", textAlign: "right" }}>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#4e73df",
                      fontSize: "16px",
                    }}
                  >
                    {overall.TodaysRevenue || 0}
                  </span>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    MTD Revenue
                  </span>
                </td>
                <td style={{ padding: "12px 20px", textAlign: "right" }}>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#1cc88a",
                      fontSize: "16px",
                    }}
                  >
                    {overall.MTDRevenue || 0}
                  </span>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{ color: "#5a5c69", fontSize: "14px" }}>
                    Target
                  </span>
                </td>
                <td style={{ padding: "12px 20px", textAlign: "right" }}>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#858796",
                      fontSize: "16px",
                    }}
                  >
                    {overall.TargetRevenue || 0}
                  </span>
                </td>
                <td style={{ padding: "12px 20px" }}>
                  {(() => {
                    const pct = calcPercentage(
                      overall.MTDRevenue,
                      overall.TargetRevenue,
                    );
                    const color = getProgressColor(pct);
                    return (
                      <>
                        <div
                          style={{
                            width: "100%",
                            backgroundColor: "#e9ecef",
                            borderRadius: "4px",
                            height: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: color,
                              borderRadius: "4px",
                              height: "8px",
                              transition: "width 0.5s ease",
                            }}
                          ></div>
                        </div>
                        <span style={{ fontSize: "11px", color: color }}>
                          {pct}%
                        </span>
                      </>
                    );
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID---####s --> */}

        <div className="tableContainer">
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
                <span>By Sales Person</span>

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
              data={dataList.data ? dataList.data : []}
              columns={columnListByProgram}
              height="530px"
              layout="fitData"
              options={{
                headerWordWrap: true, // Apply to all headers
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesDashboard;
