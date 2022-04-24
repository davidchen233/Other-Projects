$(document).ready(function () {
  let data = [];
  const ajaxobj = new AjaxObject("json/personalInfo_data.json", "json");
  ajaxobj.getall().then((getData) => {
    data = getData;
  });

  // searchData
  $("#confirmSearch").on("click", () => {
    const cnname = $("#searchcnname").val();
    const enname = $("#searchenname").val();
    const ajaxobj = new AjaxObject("json/personalInfo_data.json", "json");
    ajaxobj.search(cnname, enname);
    $("#searchDataModal").modal("hide");
  });

  // addData
  $("#confirmAdd").on("click", () => {
    const id = `${data.length + 1 < 10 ? 0 : ""}${data.length + 1}`;
    const cnname = $("#addcnname").val();
    const enname = $("#addenname").val();
    const sex = $('input:radio:checked[name="addsex"]').val();
    const phone = $("#addphone").val();
    const email = $("#addemail").val();

    const ajaxobj = new AjaxObject("json/personalInfo_data.json", "json");
    ajaxobj.id = id;
    ajaxobj.cnname = cnname;
    ajaxobj.enname = enname;
    ajaxobj.sex = sex;
    ajaxobj.phone = phone;
    ajaxobj.email = email;

    ajaxobj.add(data);

    $("#addDataModal").modal("hide");
    $("#addform")[0].reset();
  });

  // initModifyData
  $("#cardtable").on("click", ".modifybutton", function () {
    const targetid = $(this).attr("id").replace("modifybutton", "");
    const target = data.find((item) => {
      return item.s_sn === targetid;
    });
    $("#modifyid").val(targetid);
    $("#modifycnname").val(target.cnname);
    $("#modifyenname").val(target.enname);
    $(`input[name="modifysex"][value=${target.sex}]`).prop("checked", true);
    $("#modifyphone").val(target.phone);
    $("#modifyemail").val(target.email);
  });

  // confirmModify
  $("#modifyDataForm").on("click", "#confirmModify", () => {
    const ajaxobj = new AjaxObject("json/personalInfo_data.json", "json");
    ajaxobj.id = $("#modifyid").val();
    ajaxobj.cnname = $("#modifycnname").val();
    ajaxobj.enname = $("#modifyenname").val();
    ajaxobj.sex = $('input:radio:checked[name="modifysex"]').val();
    ajaxobj.phone = $("#modifyphone").val();
    ajaxobj.email = $("#modifyemail").val();

    ajaxobj.modify(data);

    $("#modifyDataForm").modal("hide");
  });

  // deleteData
  $("#cardtable").on("click", ".deletebutton", function () {
    if (window.confirm("確定刪除?")) {
      const deleteid = $(this).attr("id").replace("deletebutton", "");
      const ajaxobj = new AjaxObject("json/personalInfo_data.json", "json");
      ajaxobj.id = deleteid;
      ajaxobj.delete(deleteid);
    }
  });
});

// Fetch Data
const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Fetch Error: ", error);
  }
};

// Refresh Table
const refreshTable = (newData) => {
  data = newData;
  $("#cardtable tbody").empty();
  for (let item of newData) {
    const strsex = +item.sex === 0 ? "男" : "女";
    $("#cardtable tbody").append(`
    <tr>
      <td data-toggle="tooltip" title="[${strsex}] ${item.cnname} (${item.enname})">${item.cnname}</td>
      <td>${item.enname}</td>
      <td>${strsex}</td>
      <td data-toggle="popover" title="聯絡方式: ${item.phone}" class="pointer">${item.phone}</td>
      <td>${item.email}</td>
      <td>
        <button id="modifybutton${item.s_sn}" class="modifybutton custom-button"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#modifyDataForm"
        data-bs-whatever="@mdo"">
        <span><i class="fa-solid fa-user-pen"></i></span> 修改
        </button>
      </td>
      <td>
       <button id="deletebutton${item.s_sn}" class="deletebutton custom-button">
       <span><i class="fa-solid fa-trash-can"></i></span> 刪除
        </button>
      </td>
    </tr>
  `);
  }
  $('[data-toggle="tooltip"] ').tooltip();
  $('[data-toggle="popover"]').popover();
};

// filter Table
const filterTable = (newData) => {
  $("#cardtable tbody").empty();
  for (let item of newData) {
    const strsex = +item.sex === 0 ? "男" : "女";
    $("#cardtable tbody").append(`
    <tr>
      <td data-toggle="tooltip" title="Hooray!>${item.cnname}</td>
      <td>${item.enname}</td>
      <td>${strsex}</td>
      <td>${item.phone}</td>
      <td>${item.email}</td>
      <td>
        <button id="modifybutton${item.s_sn}" class="modifybutton custom-button" 
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#modifyDataForm"
        data-bs-whatever="@mdo"">
        <span><i class="fa-solid fa-user-pen"></i></span> 修改
        </button>
      </td>
      <td>
       <button id="deletebutton${item.s_sn}" class="deletebutton custom-button">
       <span><i class="fa-solid fa-trash-can"></i></span> 刪除
        </button>
      </td>
    </tr>
  `);
  }
};

/**
 * @param {string} url - url 呼叫 controller 的 url
 * @param {string} datatype - datatype 資料傳回格式
 * @uses refreshTable - 利用 ajax 傳回資料更新 Table
 */
function AjaxObject(url, datatype) {
  this.url = url;
  this.datatype = datatype;
}

// AjaxObject Properties
AjaxObject.prototype.id = 0;
AjaxObject.prototype.cnname = "";
AjaxObject.prototype.enname = "";
AjaxObject.prototype.sex = "";
AjaxObject.prototype.phone = "";
AjaxObject.prototype.email = "";

// AjaxObject Methods
AjaxObject.prototype.getall = async function () {
  const defaultData = await fetchData(this.url);
  refreshTable(defaultData);
  return defaultData;
};
AjaxObject.prototype.add = function (oldData) {
  const newData = {
    s_sn: this.id,
    cnname: this.cnname,
    enname: this.enname,
    sex: this.sex,
    phone: this.phone,
    email: this.email,
  };

  oldData.push(newData);
  refreshTable(data);
};
AjaxObject.prototype.modify = function (oldData) {
  const newData = {
    s_sn: this.id,
    cnname: this.cnname,
    enname: this.enname,
    sex: this.sex,
    phone: this.phone,
    email: this.email,
  };

  data[
    oldData.findIndex((item) => {
      return item.s_sn === newData.s_sn;
    })
  ] = newData;
  refreshTable(data);
};
AjaxObject.prototype.delete = function (deleteid) {
  const index = data.findIndex((item) => {
    return item.s_sn === deleteid;
  });
  data.splice(index, 1);
  console.log(data);
  refreshTable(data);
};
AjaxObject.prototype.search = function (cnname, enname) {
  const searchData = data
    .filter((item) => {
      return item.cnname.includes(cnname) && item.enname.includes(enname);
    })
    .filter((item) => {
      return item.cnname.includes(cnname);
    });
  cnname || enname ? filterTable(searchData) : filterTable(data);
};
