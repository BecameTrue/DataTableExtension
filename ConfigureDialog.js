(function () {
  var selectedWorksheet;
  var columns = [];
  // var sheetData = [];

  $(document).ready(function () {
    tableau.extensions.initializeDialogAsync().then(function (openPayload) {
      // openPayload에 부모가 담아준 값이 들어있지만 사용하지 않음

      const worksheets =
        tableau.extensions.dashboardContent.dashboard.worksheets;

      worksheets.forEach((sheet, idx) => {
        let btn = makeButton(sheet.name, "sheet-", idx, () =>
          onSelectWorksheet(sheet.name, idx)
        );
        $("#select-worksheet-area").append(btn);
      });
    });

    $("#finish-btn").on("click", () => finishDialog());
  });

  var makeButton = (name, prefix, id, onClickFunction) => {
    const button = $("<input type='button'>");
    button.attr("id", prefix + id);
    button.val(name);
    button.addClass("btn btn-outline-primary btn-sm");
    button.on("click", () => onClickFunction());
    return button;
  };

  var onSelectWorksheet = (sheetName, idx) => {
    selectedWorksheet = sheetName;
    $("input[id^='sheet-']").attr("class", "btn btn-outline-primary btn-sm");
    $("#sheet-" + idx).attr("class", "btn btn-primary btn-sm");

    initializeColumns().then(() => {
      showSettingDetailsArea();
    });
  };

  var initializeColumns = async () => {
    const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    var worksheet = worksheets.find(
      (sheet) => sheet.name === selectedWorksheet
    );

    return await worksheet
      .getUnderlyingTablesAsync()
      .then(async (logicalTable) => {
        await worksheet
          .getUnderlyingTableDataAsync(logicalTable[0].id)
          .then((dataTable) => {
            dataTable.columns.forEach((column) => {
              columns.push({
                fieldName: column.fieldName,
                isImageURL: false,
                altText: null,
              });
            });
            // dataTable.data.forEach((row) => {
            //   var refinedRow = {};
            //   row.forEach((data, idx) => {
            //     refinedRow[columns[idx].fieldName] = data.formattedValue;
            //   });
            //   sheetData.push(refinedRow);
            // });
          });
      });
  };

  var showSettingDetailsArea = () => {
    $("#select-image-columns-area").show();
    $("#select-layout-area").show();
    generateColumnButtons(columns, $("#select-image-columns"));
  };

  var generateColumnButtons = (columns, targetArea) => {
    /*
      each column = {
        dataType : "string"
        fieldName : "GOODS_CODE"
        index : 0
        isReferenced : true
      }
    */
    columns.forEach((column, idx) => {
      let btn = makeButton(column.fieldName, "imgcol-", idx, () =>
        onSelectImageColumn(column.fieldName, idx)
      );
      targetArea.append(btn);
    });
  };

  var onSelectImageColumn = (fieldName, idx) => {
    $("input[id^='imgcol-']").attr("class", "btn btn-outline-primary btn-sm");
    $("#imgcol-" + idx).attr("class", "btn btn-primary btn-sm");
    columns.forEach((col) => {
      col.isImageURL = false;
    });
    var selectedColumn = columns.find((col) => col.fieldName === fieldName);
    selectedColumn.isImageURL = true;
  };

  var finishDialog = () => {
    if (!selectedWorksheet) {
      alert("워크시트를 선택하세요.");
    } else {
      var imgSize =
        $("#image-size").val() !== "" ? $("#image-size").val() : "60";
      var imgAltText = $("#alt-text").val();
      var imgColumn = columns.find((col) => col.isImageURL === true);

      if (imgColumn) {
        if (imgSize !== "") imgColumn.size = parseInt(imgSize);
        if (imgAltText !== "") imgColumn.altText = imgAltText;
      }

      var closePayload = {
        sheetName: selectedWorksheet,
        columns: columns,
        // data: sheetData,
      };
      tableau.extensions.ui.closeDialog(JSON.stringify(closePayload));
    }
  };
})();
