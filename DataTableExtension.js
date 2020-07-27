(function () {
  $(document).ready(function () {
    $("#show").on("click", () => showTable());
  });

  var showTable = () => {
    $.ajax({
      type: "get",
      url: "http://mirs.co.kr:8083/predict?shopcode=1234&id=58086",
      dataType: "json",
      success: function (response) {
        var dataFromAPI = response[0];
        console.log(dataFromAPI);
        $("#data-table").DataTable({
          data: dataFromAPI,
          select: true,
          columns: [
            { data: "GOODS_CODE" },
            {
              data: "GOODS_NAME",
              render: function (data, type, row) {
                return "<a href='" + row["GOODS_URL"] + "'>" + data + "</a>";
              },
            },
            {
              data: "GOODS_IMG_URL",
              render: function (data, type, row) {
                // console.log("data is : ");
                // console.log(data);
                // console.log("type is : ");
                // console.log(type);
                // console.log("row is : ");
                // console.log(row);
                return (
                  "<a href='" +
                  row["GOODS_URL"] +
                  "'>" +
                  "<img src=' " +
                  data +
                  "' style='height: 80px;'>" +
                  "</a>"
                );
              },
            },
            { data: "rating" },
          ],
        });
      },
    });
  };
})();
