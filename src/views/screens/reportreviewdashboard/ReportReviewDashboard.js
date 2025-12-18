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
import * as XLSX from "xlsx";

const ReportReviewDashboard = (props) => {
  const serverpage = "reportreviewdashboard"; // this is .php server page
  const tableRef = useRef(null);

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  // const [toggle, setToggle] = useState(true); //true=show tabel, false= show add/edit form

  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [ProgramList, setProgramList] = useState(null);
  const [currProgramId, setCurrProgramId] = useState(null);

  const [AuditorList, setAuditorList] = useState(null);
  const [currReportWriterId, setCurrReportWriterId] = useState(null);

  const [StartDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [EndDate, setEndDate] = useState(
    moment().add(30, "days").format("YYYY-MM-DD")
  );

  const [columnList, setColumnList] = useState([]); // Table column list

  // handleChangeWidthHeight
  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  // const UserInfo = LoginUserInfo();
  const [selectedDate, setSelectedDate] = useState(
    //new Date()
    moment().format("YYYY-MM-DD")
  );

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  // const PrintPDFExcelExportFunction = (reportType) => {
  //   let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    // window.open(
    //   finalUrl +
    //     "?action=CoordinatorInputExport" +
    //     "&reportType=excel" +
    //     "&StartDate=" +
    //     StartDate +
    //     "&EndDate=" +
    //     EndDate +
    //     "&TimeStamp=" +
    //     Date.now()
    // );
  // };

  // Export Tabulator data to Excel
  const exportToExcel = () => {
    try {
      // Get the data from dataList
      const exportData = dataList.data || [];
      const columns = dataList.column || [];

      if (exportData.length === 0) {
        alert("No data to export");
        return;
      }

      // Prepare data for export
      const worksheetData = [];

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

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

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

  React.useEffect(() => {
    // getProgramList("");
    // getAuditorList("");
  }, []);
 
  if (bFirst) {
    /**First time call for datalist */
    getDataList();
    setBFirst(false);
  }

  useEffect(() => {
    getDataList();
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
            <label>Start Date</label>
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
            <label>End Date</label>
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

        {/*  <CustomTable
          columns={dataList.column ? dataList.column : []}
          rows={dataList.data ? dataList.data : {}}
          ispagination={false}
        />*/}

        <ReactTabulator
          ref={tableRef}
          data={dataList.data ? dataList.data : []}
          columns={dataList.column ? dataList.column : []}
          height="600px"
          layout="fitData"
          
        />
      </div>
      {/* <!-- BODY CONTAINER END --> */}
    </>
  );
};

export default ReportReviewDashboard;
