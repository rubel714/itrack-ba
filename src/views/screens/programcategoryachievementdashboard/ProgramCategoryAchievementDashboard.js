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

      // Title row
      worksheetData.push([
        `Program Category Achievement Dashboard - ${monthName} ${currYearName}`,
      ]);

      // Header rows (2 rows for merged column groups)
      worksheetData.push([
        "#",
        "Program Category",
        "ReCertification Revenue",
        "",
        "New Certification Revenue",
        "",
        "Total",
        "",
      ]);
      worksheetData.push([
        "",
        "",
        "Target",
        "Achievement",
        "Target",
        "Achievement",
        "Target",
        "Achievement",
      ]);

      // Data rows
      exportData.forEach((row, idx) => {
        worksheetData.push([
          idx + 1,
          row.ProgramCategoryName || "",
          row.ReCertTarget || 0,
          row.ReCertAchievement || 0,
          row.NewCertTarget || 0,
          row.NewCertAchievement || 0,
          row.TotalCertTarget || 0,
          row.TotalCertAchievement || 0,
        ]);
      });

      // Totals row
      const sum = (field) =>
        exportData.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0);
      worksheetData.push([
        "Total",
        "",
        parseFloat(sum("ReCertTarget").toFixed(2)),
        parseFloat(sum("ReCertAchievement").toFixed(2)),
        parseFloat(sum("NewCertTarget").toFixed(2)),
        parseFloat(sum("NewCertAchievement").toFixed(2)),
        parseFloat(sum("TotalCertTarget").toFixed(2)),
        parseFloat(sum("TotalCertAchievement").toFixed(2)),
      ]);

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      const totalRows = worksheetData.length;
      const lastCol = 7; // 0-indexed, column H

      // Merges
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: lastCol } }, // title
        { s: { r: 1, c: 0 }, e: { r: 2, c: 0 } },       // #
        { s: { r: 1, c: 1 }, e: { r: 2, c: 1 } },       // Program Category
        { s: { r: 1, c: 2 }, e: { r: 1, c: 3 } },       // ReCert group
        { s: { r: 1, c: 4 }, e: { r: 1, c: 5 } },       // NewCert group
        { s: { r: 1, c: 6 }, e: { r: 1, c: 7 } },       // Total group
      ];

      // Style title
      if (ws["A1"]) {
        ws["A1"].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }

      // Style header rows
      for (let c = 0; c <= lastCol; c++) {
        ["B", "C"].forEach((rowLabel, rowOffset) => {
          const cell = XLSX.utils.encode_cell({ r: 1 + rowOffset, c });
          if (ws[cell]) {
            ws[cell].s = {
              font: { bold: true },
              alignment: { horizontal: "center" },
              fill: { fgColor: { rgb: "D3E4F5" } },
            };
          }
        });
      }

      // Style totals row
      const totalRowIdx = totalRows - 1;
      for (let c = 0; c <= lastCol; c++) {
        const cell = XLSX.utils.encode_cell({ r: totalRowIdx, c });
        if (ws[cell]) {
          ws[cell].s = {
            font: { bold: true },
            alignment: { horizontal: c === 0 ? "left" : "right" },
          };
        }
      }

      // Column widths
      ws["!cols"] = [
        { wch: 6 },
        { wch: 26 },
        { wch: 14 },
        { wch: 14 },
        { wch: 16 },
        { wch: 16 },
        { wch: 12 },
        { wch: 14 },
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

  const columnList = [
    {
      field: "rownumber",
      title: "#",
      hozAlign: "center",
      headerHozAlign: "center",
      width: 55,
      formatter: "rownum",
    },
    {
      field: "ProgramCategoryName",
      title: "Program Category",
      hozAlign: "left",
      headerHozAlign: "left",
      width: 200,
    },
    {
      title: "ReCertification Revenue",
      hozAlign: "center",
      headerHozAlign: "center",
      columns: [
        {
          field: "ReCertTarget",
          title: "Target",
          hozAlign: "right",
          headerHozAlign: "right",
          width: 130,
          bottomCalc: "sum",
        },
        {
          field: "ReCertAchievement",
          title: "Achievement",
          hozAlign: "right",
          headerHozAlign: "right",
          width: 130,
          bottomCalc: "sum",
          formatter: "money",
          formatterParams: { precision: 2 },
          bottomCalcFormatter: "money",
          bottomCalcFormatterParams: { precision: 2 },
        },
      ],
    },
    {
      title: "New Certification Revenue",
      hozAlign: "center",
      headerHozAlign: "center",
      columns: [
        {
          field: "NewCertTarget",
          title: "Target",
          hozAlign: "right",
          headerHozAlign: "right",
          width: 130,
          bottomCalc: "sum",
        },
        {
          field: "NewCertAchievement",
          title: "Achievement",
          hozAlign: "right",
          headerHozAlign: "right",
          width: 130,
          bottomCalc: "sum",
          formatter: "money",
          formatterParams: { precision: 2 },
          bottomCalcFormatter: "money",
          bottomCalcFormatterParams: { precision: 2 },
        },
      ],
    },
    {
      title: "Total",
      hozAlign: "center",
      headerHozAlign: "center",
      columns: [
        {
          field: "TotalCertTarget",
          title: "Target",
          hozAlign: "right",
          headerHozAlign: "right",
          width: 130,
          bottomCalc: "sum",
        },
        {
          field: "TotalCertAchievement",
          title: "Achievement",
          hozAlign: "right",
          headerHozAlign: "right",
          width: 130,
          bottomCalc: "sum",
          formatter: "money",
          formatterParams: { precision: 2 },
          bottomCalcFormatter: "money",
          bottomCalcFormatterParams: { precision: 2 },
        },
      ],
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
