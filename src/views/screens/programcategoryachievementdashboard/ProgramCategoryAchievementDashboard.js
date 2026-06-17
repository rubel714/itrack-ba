import React, { useRef, useEffect } from "react";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import moment from "moment";
import "../../../assets/css/audit.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Typography, TextField } from "@material-ui/core";

// react-tabulator
import "react-tabulator/lib/styles.css";
import "react-tabulator/lib/css/tabulator.min.css";
import { ReactTabulator } from "react-tabulator";
import * as XLSX from "xlsx-js-style";

const ProgramCategoryAchievementDashboard = (props) => {
  const serverpage = "programcategoryachievementdashboard";
  const tableRef = useRef(null);

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);

  const UserInfo = LoginUserInfo();

  const [YearList, setYearList]   = useState([]);
  const [MonthList, setMonthList] = useState([]);

  const [currYearName, setCurrYearName] = useState(moment().format("YYYY"));
  const [currMonthId, setCurrMonthId]   = useState(parseInt(moment().format("M")));

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook();

  /* =====Start of Excel Export Code==== */
  const exportToExcel = () => {
    try {
      if (!tableRef.current) {
        alert("Table not initialized");
        return;
      }

      const exportData = tableRef.current.table.getData("active");

      if (exportData.length === 0) {
        alert("No data to export");
        return;
      }

      const selectedMonth = MonthList.find((m) => m.id === currMonthId);
      const monthName = selectedMonth ? selectedMonth.name : currMonthId;

      const wb = XLSX.utils.book_new();
      const worksheetData = [];

      // Total columns: 19 (0-indexed 0..18)
      const lastCol = 18;

      // Row 0: Title
      worksheetData.push([
        `Program Category Achievement Dashboard - ${monthName} ${currYearName}`,
      ]);

      // Row 1: Column group headers
      worksheetData.push([
        "#",                   // col 0
        "Program Category",    // col 1
        "Budget CM",           // col 2 (spans 2-4)
        "", "",
        "Actual PY",           // col 5 (spans 5-7)
        "", "",
        "Last Days\nConfirmation", // col 8
        "MTD Performed",       // col 9
        "CM Scheduled",        // col 10
        "CM Confirmed",        // col 11
        "In-progress",         // col 12
        "Pipeline",            // col 13
        "MTD Revenue",         // col 14 (spans 14-16)
        "", "",
        "MTG\n(Budget)",       // col 17
        "Budget vs\nMTD Ach",  // col 18
      ]);

      // Row 2: Sub-headers
      worksheetData.push([
        "",  // col 0
        "",  // col 1
        "Re-Cert",  "New-Cert", "Total",    // Budget CM
        "Re-Cert",  "New-Cert", "Total",    // Actual PY
        "",  // Last Days Confirmation
        "",  // MTD Performed
        "",  // CM Scheduled
        "",  // CM Confirmed
        "",  // In-progress
        "",  // Pipeline
        "Re-Cert",  "New-Cert", "Total",    // MTD Revenue
        "",  // MTG
        "",  // Budget vs MTD Ach
      ]);

      // Data rows
      exportData.forEach((row, idx) => {
        const ach = row.BudgetVsMTDAch != null ? row.BudgetVsMTDAch.toFixed(2) + "%" : "0.00%";
        worksheetData.push([
          idx + 1,
          row.ProgramCategoryName       || "",
          row.BudgetCMReCert            || 0,
          row.BudgetCMNewCert           || 0,
          row.BudgetCMTotal             || 0,
          row.ActualPYReCert            || 0,
          row.ActualPYNewCert           || 0,
          row.ActualPYTotal             || 0,
          row.LastDaysConfirmation      || 0,
          row.MTDPerformed              || 0,
          row.CMScheduled               || 0,
          row.CMConfirmed               || 0,
          row.InProgress                || 0,
          row.Pipeline                  || 0,
          row.MTDRevenueReCert          || 0,
          row.MTDRevenueNewCert         || 0,
          row.MTDRevenueTotal           || 0,
          row.MTGBudget                 || 0,
          ach,
        ]);
      });

      // Totals row
      const sumField = (field) =>
        exportData.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0);
      const totalMTDRevenue = sumField("MTDRevenueTotal");
      const totalBudgetCM   = sumField("BudgetCMTotal");
      const totalMTG        = totalMTDRevenue - totalBudgetCM;
      const totalAch        = totalBudgetCM > 0
        ? ((totalMTDRevenue / totalBudgetCM) * 100).toFixed(2) + "%"
        : "0.00%";

      worksheetData.push([
        "Total", "",
        parseFloat(sumField("BudgetCMReCert").toFixed(2)),
        parseFloat(sumField("BudgetCMNewCert").toFixed(2)),
        parseFloat(totalBudgetCM.toFixed(2)),
        parseFloat(sumField("ActualPYReCert").toFixed(2)),
        parseFloat(sumField("ActualPYNewCert").toFixed(2)),
        parseFloat(sumField("ActualPYTotal").toFixed(2)),
        parseFloat(sumField("LastDaysConfirmation").toFixed(2)),
        parseFloat(sumField("MTDPerformed").toFixed(2)),
        parseFloat(sumField("CMScheduled").toFixed(2)),
        parseFloat(sumField("CMConfirmed").toFixed(2)),
        parseFloat(sumField("InProgress").toFixed(2)),
        parseFloat(sumField("Pipeline").toFixed(2)),
        parseFloat(sumField("MTDRevenueReCert").toFixed(2)),
        parseFloat(sumField("MTDRevenueNewCert").toFixed(2)),
        parseFloat(totalMTDRevenue.toFixed(2)),
        parseFloat(totalMTG.toFixed(2)),
        totalAch,
      ]);

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const totalRows = worksheetData.length;

      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } }, // title
        { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } },       // #
        { s: { r: 1, c: 1 }, e: { r: 2, c: 1 } },       // Program Category
        { s: { r: 1, c: 2 }, e: { r: 1, c: 4 } },       // Budget CM group
        { s: { r: 1, c: 5 }, e: { r: 1, c: 7 } },       // Actual PY group
        { s: { r: 1, c: 8  }, e: { r: 2, c: 8  } },     // Last Days Confirmation
        { s: { r: 1, c: 9  }, e: { r: 2, c: 9  } },     // MTD Performed
        { s: { r: 1, c: 10 }, e: { r: 2, c: 10 } },     // CM Scheduled
        { s: { r: 1, c: 11 }, e: { r: 2, c: 11 } },     // CM Confirmed
        { s: { r: 1, c: 12 }, e: { r: 2, c: 12 } },     // In-progress
        { s: { r: 1, c: 13 }, e: { r: 2, c: 13 } },     // Pipeline
        { s: { r: 1, c: 14 }, e: { r: 1, c: 16 } },     // MTD Revenue group
        { s: { r: 1, c: 17 }, e: { r: 2, c: 17 } },     // MTG (Budget)
        { s: { r: 1, c: 18 }, e: { r: 2, c: 18 } },     // Budget vs MTD Ach
        { s: { r: totalRows - 1, c: 0 }, e: { r: totalRows - 1, c: 1 } }, // Totals label
      ];

      // Style: title
      if (ws["A1"]) {
        ws["A1"].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }

      // Style: header rows
      for (let c = 0; c <= lastCol; c++) {
        [1, 2].forEach((rowIdx) => {
          const cell = XLSX.utils.encode_cell({ r: rowIdx, c });
          if (ws[cell]) {
            ws[cell].s = {
              font: { bold: true },
              alignment: { horizontal: "center", vertical: "center", wrapText: true },
              fill: { fgColor: { rgb: "D3E4F5" } },
            };
          }
        });
      }

      // Style: totals row
      const totalRowIdx = totalRows - 1;
      for (let c = 0; c <= lastCol; c++) {
        const cell = XLSX.utils.encode_cell({ r: totalRowIdx, c });
        if (ws[cell]) {
          ws[cell].s = {
            font: { bold: true },
            alignment: { horizontal: c <= 1 ? "left" : "right" },
          };
        }
      }

      // Column widths
      ws["!cols"] = [
        { wch: 5  }, // #
        { wch: 22 }, // Program Category
        { wch: 14 }, // BudgetCM ReCert
        { wch: 14 }, // BudgetCM NewCert
        { wch: 14 }, // BudgetCM Total
        { wch: 14 }, // ActualPY ReCert
        { wch: 14 }, // ActualPY NewCert
        { wch: 14 }, // ActualPY Total
        { wch: 14 }, // Last Days Confirmation
        { wch: 14 }, // MTD Performed
        { wch: 14 }, // CM Scheduled
        { wch: 14 }, // CM Confirmed
        { wch: 14 }, // In-progress
        { wch: 12 }, // Pipeline
        { wch: 14 }, // MTDRevenue ReCert
        { wch: 14 }, // MTDRevenue NewCert
        { wch: 14 }, // MTDRevenue Total
        { wch: 14 }, // MTG (Budget)
        { wch: 14 }, // Budget vs MTD Ach
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Achievement");

      const fileName = `ProgramCategory_Achievement_Dashboard_${currYearName}_${String(currMonthId).padStart(2, "0")}_${moment().format("HHmmss")}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error("Export error:", err);
      alert("Error exporting to Excel: " + err.message);
    }
  };
  /* =====End of Excel Export Code==== */

  const moneyCol = (field, title, width = 130) => ({
    field,
    title,
    hozAlign: "right",
    headerHozAlign: "center",
    width,
    bottomCalc: "sum",
    formatter: "money",
    formatterParams: { precision: 2 },
    bottomCalcFormatter: "money",
    bottomCalcFormatterParams: { precision: 2 },
  });

  const columnList = [
    {
      field: "rownumber",
      title: "#",
      hozAlign: "center",
      headerHozAlign: "center",
      width: 50,
      formatter: "rownum",
      frozen: true,
    },
    {
      field: "ProgramCategoryName",
      title: "Program Category",
      hozAlign: "left",
      headerHozAlign: "left",
      width: 180,
      frozen: true,
    },
    {
      title: "Budget CM",
      hozAlign: "center",
      headerHozAlign: "center",
      columns: [
        moneyCol("BudgetCMReCert",  "Re-Cert", 90),
        moneyCol("BudgetCMNewCert", "New-Cert", 90),
        moneyCol("BudgetCMTotal",   "Total", 85),
      ],
    },
    {
      title: "Actual PY",
      hozAlign: "center",
      headerHozAlign: "center",
      columns: [
        moneyCol("ActualPYReCert",  "Re-Cert", 90),
        moneyCol("ActualPYNewCert", "New-Cert", 90),
        moneyCol("ActualPYTotal",   "Total", 85),
      ],
    },
    {
      field: "LastDaysConfirmation",
      title: "Last Days\nConfirmation",
      hozAlign: "right",
      headerHozAlign: "center",
      width: 120,
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    moneyCol("MTDPerformed", "MTD Performed", 130),
    moneyCol("CMScheduled",  "CM Scheduled",  130),
    moneyCol("CMConfirmed",  "CM Confirmed",  130),
    moneyCol("InProgress",   "In-progress",   130),
    moneyCol("Pipeline",     "Pipeline",      100),
    {
      title: "MTD Revenue",
      hozAlign: "center",
      headerHozAlign: "center",
      columns: [
        moneyCol("MTDRevenueReCert",  "Re-Cert", 90),
        moneyCol("MTDRevenueNewCert", "New-Cert", 90),
        moneyCol("MTDRevenueTotal",   "Total", 85),
      ],
    },
    {
      field: "MTGBudget",
      title: "MTG\n(Budget)",
      hozAlign: "right",
      headerHozAlign: "center",
      width: 130,
      bottomCalc: "sum",
      formatter: "money",
      formatterParams: { precision: 2 },
      bottomCalcFormatter: "money",
      bottomCalcFormatterParams: { precision: 2 },
    },
    {
      field: "BudgetVsMTDAch",
      title: "Budget vs\nMTD Ach",
      hozAlign: "right",
      headerHozAlign: "center",
      width: 120,
      formatter: (cell) => {
        const val = parseFloat(cell.getValue()) || 0;
        return val.toFixed(2) + "%";
      },
      bottomCalc: (values) => {
        const total = values.reduce((s, v) => s + (parseFloat(v) || 0), 0);
        return total > 0 ? (total / values.length).toFixed(2) + "%" : "0.00%";
      },
    },
  ];

  useEffect(() => {
    getYearList();
    getMonthList();
  }, []);

  if (bFirst) {
    getDataList();
    setBFirst(false);
  }

  useEffect(() => {
    getDataList();
  }, [currYearName, currMonthId]);

  function getYearList() {
    let params = {
      action: "YearList",
      lan: language(),
      UserId: UserInfo.UserId,
    };
    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setYearList(res.data.datalist || []);
    });
  }

  function getMonthList() {
    let params = {
      action: "MonthList",
      lan: language(),
      UserId: UserInfo.UserId,
    };
    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setMonthList(res.data.datalist || []);
    });
  }

  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      YearName: currYearName,
      MonthId: currMonthId,
    };
    ExecuteQuery(serverpage, params);
  }

  const handleChangeYear = (event, valueobj) => {
    if (valueobj) {
      setCurrYearName(valueobj.id);
    }
  };

  const handleChangeMonth = (event, valueobj) => {
    if (valueobj) {
      setCurrMonthId(valueobj.id);
    }
  };

  return (
    <>
      <div class="bodyContainer">
        {/* TOP HEADER */}
        <div class="topHeader">
          <h4>Home ❯ Dashboard ❯ Program Category Achievement Dashboard</h4>
        </div>

        {/* FILTERS */}
        <div class="searchAdd">
          <div>
            <label>Year</label>
            <div>
              <Autocomplete
                autoHighlight
                disableClearable
                className="chosen_dropdown"
                id="YearName"
                name="YearName"
                autoComplete
                options={YearList}
                getOptionLabel={(option) => option.name || ""}
                value={YearList.find((item) => item.id == currYearName) || null}
                onChange={handleChangeYear}
                renderOption={(option) => (
                  <Typography style={{ fontSize: "13px" }}>
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    size="small"
                  />
                )}
              />
            </div>
          </div>

          <div>
            <label>Month</label>
            <div>
              <Autocomplete
                autoHighlight
                disableClearable
                className="chosen_dropdown"
                id="MonthId"
                name="MonthId"
                autoComplete
                options={MonthList}
                getOptionLabel={(option) => option.name || ""}
                value={MonthList.find((item) => item.id === currMonthId) || null}
                onChange={handleChangeMonth}
                renderOption={(option) => (
                  <Typography style={{ fontSize: "13px" }}>
                    {option.name}
                  </Typography>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    size="small"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="tableContainer">
          <div class="searchAdd">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <span>By Program Category</span>
              <button
                onClick={exportToExcel}
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
            ref={tableRef}
            data={dataList?.data ? dataList.data : []}
            columns={columnList}
            height="500px"
            layout="fitData"
            options={{
              headerWordWrap: true,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ProgramCategoryAchievementDashboard;
