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

const SalesPersonInputReport = (props) => {
  const serverpage = "salespersoninputreport"; // this is .php server page
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
    moment().add(-30, "days").format("YYYY-MM-DD")
  );
  const [EndDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=SalesPersonInputExport" +
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

  const columnList = [
    {
      field: "rownumber",
      title: "SL",
      hozAlign: "center",
      width: "3%",
      formatter: "rownum",
    },
    {
      field: "ActivityName",
      title: "Activity",
      hozAlign: "left",
      width: "100",
      //   headerFilter:"input"
    },
    {
      field: "TransactionDate",
      title: "Input Date",
      hozAlign: "left",
      hozAlign: "left",
      width: "105",
      // headerFilter:"input"
    },
    {
      field: "SalesEntryUserName",
      title: "Input User",

      hozAlign: "left",
      width: "115",
      // headerFilter:"input"
    },
    {
      field: "FactoryName",
      title: "Factory Name",
      hozAlign: "left",
      width: "160",
      //   headerFilter:"input"
    },
    {
      field: "FactoryGroupName",
      title: "Factory Group",
      hozAlign: "left",
      width: "160",
      //  headerFilter:"input"
    },
    {
      field: "FactoryAddress",
      title: "Factory Address",
      hozAlign: "left",
      width: "160",
      //  headerFilter:"input"
    },
    {
      field: "StateName",
      title: "State",
      hozAlign: "left",
      width: "100",
      //  headerFilter:"input"
    },
    {
      field: "FactoryContactPerson",
      title: "Factory Contact Person",
      hozAlign: "left",
      width: "200",
      //   headerFilter:"input"
    },
    {
      field: "FactoryContactPersonPhone",
      title: "Factory Contact Person Phone",
      hozAlign: "left",
      width: "230",
      //   headerFilter:"input"
    },
    {
      field: "FactoryContactPersonEmail",
      title: "Factory Contact Person Email",
      hozAlign: "left",
      width: "230",
      //  headerFilter:"input"
    },
    {
      field: "ProgramName",
      title: "Program",
      hozAlign: "left",
      width: "100",
      //  headerFilter:"input"
    },

    {
      field: "ExpireDate",
      title: "Expire Date",
      hozAlign: "left",
      width: "115",
      //   headerFilter:"input"
    },
    {
      field: "OpportunityDate",
      title: "Opportunity Date",
      hozAlign: "left",
      width: "160",
      //   headerFilter:"input"
    },
    {
      field: "TentativeOfferPrice",
      title: "Tentative Offer Price",
      hozAlign: "right",
      width: "160",
      //   headerFilter:"input"
    },
    {
      field: "CertificateBody",
      title: "Certificate Body",
      hozAlign: "left",
      width: "120",
      //   headerFilter:"input"
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
      field: "LeadStatusName",
      title: "Lead Status",
      hozAlign: "left",
      width: "115",
      //   headerFilter:"input"
    },

    {
      field: "ManDay",
      title: "Man Day",
      hozAlign: "right",
      width: "100",
      //  headerFilter:"input"
    },
    {
      field: "BuyerName",
      title: "Buyer",
      hozAlign: "left",
      width: "100",
      //headerFilter:"input"
    },
    {
      field: "DepartmentName",
      title: "Lead Generated by (Department)",
      hozAlign: "left",
      width: "250",
      // headerFilter:"input"
    },
    {
      field: "MemberName",
      title: "Lead Generated by (Person)",
      hozAlign: "left",
      width: "230",
      // headerFilter:"input"
    },
    {
      field: "NextFollowupDate",
      title: "Next Followup Date",
      hozAlign: "left",
      width: "170",
      // headerFilter:"input"
    },
    {
      field: "Remarks",
      title: "Business Type",
      hozAlign: "left",
      width: "140",
      // headerFilter:"input"
    },
    {
      field: "Comments",
      title: "Comments",
      hozAlign: "left",
      width: "130",
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
          <h4>Home ❯ Reports ❯ Sales Person Input Report</h4>
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

export default SalesPersonInputReport;
