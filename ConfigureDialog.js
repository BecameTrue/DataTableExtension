(function () {
  var selectedWorksheet;

  $(document).ready(function () {
    tableau.extensions.initializeDialogAsync().then(function (openPayload) {
      // openPayload에 부모가 담아준 값이 들어있지만 사용하지 않음

      const worksheets =
        tableau.extensions.dashboardContent.dashboard.worksheets;

      worksheets.forEach((sheet) => {
        let btn = makeButton(sheet.name, () => onSelectWorksheet(sheet.name));
        $("#select-worksheet-area").append(btn);
      });
    });
  });

  var makeButton = (name, onClickFunction) => {
    const button = $("<button></button>");
    button.attr("id", "sheet-" + name);
    button.text(name);
    button.addClass("btn btn-outline-primary btn-sm");
    button.on("click", onClickFunction);
    return button;
  };

  var onSelectWorksheet = (sheetName) => {
    selectedWorksheet = sheetName;
    $("button[id^='sheet-']").attr("class", "btn btn-outline-primary btn-sm");
    $("#sheet-" + sheetName).attr("class", "btn btn-primary btn-sm");
  };
})();
