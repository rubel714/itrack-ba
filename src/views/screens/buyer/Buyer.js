import React, { forwardRef, useRef } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import { Button } from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

import BuyerAddEditModal from "./BuyerAddEditModal";

const Buyer = (props) => {
  const serverpage = "buyer"; // this is .php server page

  const permissionType = props.permissionType;
  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = () => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=BuyerExport" +
        "&reportType=excel" +

        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "BuyerName",
      label: "Buyer",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "ClientType",
      label: "Client Type",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "Country",
      label: "Country",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "SunCode",
      label: "Sun Code",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "EbitzCode",
      label: "Ebitz Code",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "ItsCode",
      label: "ITS Code",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "RegisterNo",
      label: "Register No",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "CustomerCode",
      label: "Customer Code",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "custom",
      label: "Action",
      width: "7%",
      align: "center",
      visible: true,
      sort: false,
      filter: false,
    },
  ];

  if (bFirst) {
    /**First time call for datalist */
    getDataList();
    setBFirst(false);
  }

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  /** Action from table row buttons*/
  function actioncontrol(rowData) {
    return (
      <>
        {permissionType === 0 && (
          <Edit
            className={"table-edit-icon"}
            onClick={() => {
              editData(rowData);
            }}
          />
        )}

        {permissionType === 0 && (
          <DeleteOutline
            className={"table-delete-icon"}
            onClick={() => {
              deleteData(rowData);
            }}
          />
        )}
      </>
    );
  }

  const addData = () => {
    // console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    setCurrentRow({
      id: "",
      BuyerName: "",
      ClientType: "",
      Country: "",
      SunCode: "",
      EbitzCode: "",
      ItsCode: "",
      RegisterNo: "",
      CustomerCode: "",
    });
    openModal();
  };

  const editData = (rowData) => {
    setCurrentRow(rowData);
    openModal();
  };

  function openModal() {
    setShowModal(true); //true=modal show, false=modal hide
  }

  function modalCallback(response) {
    //response = close, addedit
    // console.log('response: ', response);
    getDataList();
    setShowModal(false); //true=modal show, false=modal hide
  }

  const deleteData = (rowData) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((allowAction) => {
      if (allowAction) {
        deleteApi(rowData);
      }
    });
  };

  function deleteApi(rowData) {
    let params = {
      action: "deleteData",
      lan: language(),
      UserId: UserInfo.UserId,
      rowData: rowData,
    };

    // apiCall.post("productgroup", { params }, apiOption()).then((res) => {
    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log('res: ', res);
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList();
    });
  }

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
            <a href="javascript:void(0)" onClick={() => props.history.push("/home")}>Home</a> ❯ Basic Setup ❯ Buyer
          </h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd">
          <Button
            label={"Export"}
            class={"btnPrint"}
            onClick={PrintPDFExcelExportFunction}
          />
          <Button
            disabled={permissionType}
            label={"ADD"}
            class={"btnAdd"}
            onClick={addData}
          />
        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID PRODUCT INFORMATION---####s --> */}
        {/* <div class="subContainer tableHeight">
          <div className="App"> */}
        <CustomTable
          columns={columnList}
          rows={dataList ? dataList : {}}
          actioncontrol={actioncontrol}
        />
        {/* </div>
        </div> */}
      </div>
      {/* <!-- BODY CONTAINER END --> */}

      {showModal && (
        <BuyerAddEditModal
          masterProps={props}
          currentRow={currentRow}
          modalCallback={modalCallback}
        />
      )}
    </>
  );
};

export default Buyer;
