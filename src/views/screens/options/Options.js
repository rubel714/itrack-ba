import React from "react";
import { Button } from "../../../components/CustomControl/Button";

import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

const Options = (props) => {
  const serverpage = "options";
  const permissionType = props.permissionType;

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState({
    id: "",
    PoundRate: "",
  });
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();
  const { data: dataList, ExecuteQuery } = ExecuteQueryHook();

  React.useEffect(() => {
    if (dataList.length > 0) {
      setCurrentRow(dataList[0]);
    }
  }, [dataList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;
    setCurrentRow(data);
    setErrorObject({ ...errorObject, [name]: null });
  };

  const validateForm = () => {
    let errorData = {};
    let isValid = true;

    if (
      currentRow.PoundRate === "" ||
      currentRow.PoundRate === null ||
      currentRow.PoundRate === undefined
    ) {
      errorData.PoundRate = "validation-style";
      isValid = false;
    }

    setErrorObject(errorData);
    return isValid;
  };

  function addEditAPICall() {
    if (validateForm()) {
      let params = {
        action: "dataAddEdit",
        lan: language(),
        UserId: UserInfo.UserId,
        ClientId: UserInfo.ClientId,
        rowData: currentRow,
      };

      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        props.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });
      });
    }
  }

  if (bFirst) {
    getDataList();
    setBFirst(false);
  }

  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
    };

    ExecuteQuery(serverpage, params);
  }

  return (
    <>
      <div class="bodyContainer">
        <div class="topHeader">
          <h4>Home ❯ Settings ❯ Options</h4>
        </div>

        <div class="usersProfile">
          <div className="App">
            <div class="contactmodalBody pt-10">
              <label>Pound Rate</label>
              <input
                type="number"
                id="PoundRate"
                name="PoundRate"
                disabled={permissionType == 1}
                class={errorObject.PoundRate}
                placeholder="Enter Pound Rate"
                value={currentRow.PoundRate}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div class="modalItem">
              <Button
                label={"Update"}
                class={"btnUpdate"}
                disabled={permissionType}
                onClick={addEditAPICall}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Options;
