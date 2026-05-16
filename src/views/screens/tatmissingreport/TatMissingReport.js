import React, { forwardRef, useRef, useEffect } from "react";
import {
  apiCall,
  apiCallReport,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

import { Button } from "../../../components/CustomControl/Button";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import moment from "moment";
import "../../../assets/css/audit.css";

// react-tabulator
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { ReactTabulator, reactFormatter } from "react-tabulator";
import * as XLSX from "xlsx-js-style";

const TatMissingReport = (props) => {
  const serverpage = "tatmissingreport"; // this is .php server page
  const tableRefByProgram = useRef(null);
  const tableRefByBuyer = useRef(null);

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  // const [toggle, setToggle] = useState(true); //true=show tabel, false= show add/edit form

  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  // const [StartDate, setStartDate] = useState(moment().format("YYYY-MM-01"));
  // const [EndDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const [StartDate, setStartDate] = useState(
    moment().add(-30, "days").format("YYYY-MM-DD"),
  );
  const [EndDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=TatMissingReportExport" +
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
        Date.now(),
    );
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

  const columnList = [
    {
      field: "rownumber",
      title: "SL",
      hozAlign: "center",
      width: "3%",
      formatter: "rownum",
    },
    {
      field: "FactoryName",
      title: "Factory Name",
      hozAlign: "left",
      width: "150",
      //   headerFilter:"input"
    },
    {
      field: "ProgramName",
      title: "Program",
      hozAlign: "left",
      width: "100",
      //  headerFilter:"input"
    },

    {
      field: "CoordinatorName",
      title: "Coordinator",
      hozAlign: "left",
      width: "115",
      //   headerFilter:"input"
    },
    {
      field: "AuditStageName",
      title: "Audit Stage",
      hozAlign: "left",
      width: "115",
      //   headerFilter:"input"
    },
    {
      field: "BuyerName",
      title: "Buyer",
      hozAlign: "left",
      width: "140",
      //   headerFilter:"input"
    },
    {
      field: "AssessmentNo",
      title: "Assessment No",
      hozAlign: "left",
      width: "130",
      // headerFilter:"input"
    },
    {
      field: "AuditStartDate",
      title: "Audit Star Date",
      hozAlign: "left",
      width: "130",
      // headerFilter:"input"
    },
    {
      field: "AuditEndDate",
      title: "Audit End Date",
      hozAlign: "left",
      width: "130",
      // headerFilter:"input"
    },
    {
      field: "ReportWriter",
      title: "Report Writer",
      hozAlign: "left",
      width: "150",
      // headerFilter:"input"
    },
    {
      field: "ReportReceivedDate",
      title: "Report Received Date",
      hozAlign: "left",
      width: "140",
      // headerFilter:"input"
    },
    {
      field: "LocalReviewer",
      title: "Local Reviewer",
      hozAlign: "left",
      width: "145",
      // headerFilter:"input"
    },
    {
      field: "StandardTAT",
      title: "Standard TAT",
      hozAlign: "left",
      width: "125",
      // headerFilter:"input"
    }, 
    {
      field: "ReleaseDate",
      title: "Release Date",
      hozAlign: "left",
      width: "120",
      // headerFilter:"input"
    },
        {
      field: "OverdueDays",
      title: "Overdue Days",
      hozAlign: "center",
      width: "100",
      // headerFilter:"input"
    },
  ];

  React.useEffect(() => {}, []);

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
          <h4>Home ❯ Reports ❯ TAT Missing Report</h4>
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

          <Button
            label={"Export"}
            class={"btnPrint"}
            onClick={PrintPDFExcelExportFunction}
          />
        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID---####s --> */}

        <div>
          <ReactTabulator
            ref={tableRefByProgram}
            data={dataList ? dataList : []}
            columns={columnList}
            height="600px"
            layout="fitData"
            // initialSort={[
            //   //set the initial sort order of the data
            //   { column: "AuditCount", dir: "desc" },
            // ]}
          />
        </div>
      </div>
    </>
  );
};

export default TatMissingReport;
