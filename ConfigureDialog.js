(function () {
  var selectedWorksheet;

  $(document).ready(function () {
    tableau.extensions.initializeDialogAsync().then(function (openPayload) {
      // openPayload에 부모가 담아준 값이 들어있지만 사용하지 않음

      const worksheets =
        tableau.extensions.dashboardContent.dashboard.worksheets;

      worksheets.forEach((sheet, idx) => {
        let btn = makeButton(sheet.name, idx, () =>
          onSelectWorksheet(sheet.name, idx)
        );
        $("#select-worksheet-area").append(btn);
      });
    });
  });

  var makeButton = (name, idx, onClickFunction) => {
    const button = $("<input type='button'>");
    button.attr("id", "sheet-" + idx);
    button.val(name);
    button.addClass("btn btn-outline-primary btn-sm");
    button.on("click", () => onClickFunction());
    return button;
  };

  var onSelectWorksheet = (sheetName, idx) => {
    selectedWorksheet = sheetName;
    $("input[id^='sheet-']").attr("class", "btn btn-outline-primary btn-sm");
    $("#sheet-" + idx).attr("class", "btn btn-primary btn-sm");
    console.log("clicked " + sheetName);
  };
})();
