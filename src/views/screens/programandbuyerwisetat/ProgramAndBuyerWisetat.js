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
      // cssClass: "bold-total",
      bottomCalc: "sum",
    },
    {
      field: "CurrentTAT",
      title: "Current TAT",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "120",
      // cssClass: "bold-total",
      bottomCalc: "sum",
    },
    {
      field: "StandardTATDay",
      title: "Standard TAT",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "130",
      // cssClass: "bold-total",
      bottomCalc: "sum",
    },
  ];

  const columnListByBuyer = [
    // { field: "rownumber", label: "SL", align: "center", width: "3%" },

    {
      field: "ProgramName",
      title: "Buyer Name",
      hozAlign: "left",
      headerHozAlign: "left",
      // filter: true,
      width: "200",
    },
    {
      field: "AuditCount",
      title: "Report Released",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "150",
      // cssClass: "bold-total",
      bottomCalc: "sum",
    },
    {
      field: "AuditCount",
      title: "Current TAT",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "120",
      // cssClass: "bold-total",
      bottomCalc: "sum",
    },
    {
      field: "AuditCount",
      title: "Standard TAT",
      hozAlign: "right",
      headerHozAlign: "right",
      // filter: true,
      width: "130",
      // cssClass: "bold-total",
      bottomCalc: "sum",
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
                  onClick={() => PrintPDFExcelExportFunction("excel")}
                  style={{
                    padding: "8px 16px",
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
                  onClick={() => PrintPDFExcelExportFunction("excel")}
                  style={{
                    padding: "8px 16px",
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
