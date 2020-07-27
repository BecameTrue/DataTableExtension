(function () {
  $(document).ready(function () {
    $("#show").on("click", () => loadData());
  });

  /* 
    <a> </a> 태그를 이루는 문자열 반환
    매개변수로
    {
      href: "http://sameple.com",   - 필수
      tagClass: "primary",             - 없어도 됨
      tagStyle: "display: none;",       - 없어도 됨
      inside: "샘플 닷컴으로 이동"
    }
    을 담아줘야 함
  */
  var anchorTag = (info) => {
    const _start = "<a ";
    const _href = "href='" + info.href + "' ";
    const _class =
      info.tagClass !== null ? "class='" + info.tagClass + "' " : "";
    const _style =
      info.tagStyle !== null ? "style='" + info.tagStyle + "'>" : "";
    const _end = "</a>";

    return _start + _href + _class + _style + info.inside + _end;
  };

  /* 
    <img/> 태그를 이루는 문자열 반환
    매개변수로
    {
      src: "http://sameple.com/asdf.jpg",   - 필수
      tagClass: "primary",             - 없어도 됨
      tagStyle: "display: none;"       - 없어도 됨
    }
    을 담아줘야 함
  */
  var imageTag = (info) => {
    const _start = "<img ";
    const _src = "src='" + info.src + "' ";
    const _class =
      info.tagClass !== null ? "class='" + info.tagClass + "' " : "";
    const _style =
      info.tagStyle !== null ? "style='" + info.tagStyle + "'/>" : "/>";

    return _start + _src + _class + _style;
  };

  /*
    데이터 로드 후 DataTables 초기 설정 및 데이터 렌더링
  */
  var loadData = () => {
    // ajax 통신 부분은 추후 Tableau 라이브러리를 통해
    // 데이터를 받아오는 것으로 교체 되어야 함
    $.ajax({
      type: "get",
      url: "http://mirs.co.kr:8083/predict?shopcode=1234&id=58086",
      dataType: "json",
      // 데이터를 받아오는 것에 성공하면
      success: function (response) {
        /* 
          response[0]을 한 이유?
            mirs API가 이미 배열인 것을 한번 더 배열로 감싸 보내주기 때문에
            풀어준 것. 일반적으로는 response 그대로 사용해도 될 것임
        */
        var dataFromAPI = response[0];

        // console.log(dataFromAPI);

        $("#data-table").DataTable({
          // 테이블에 데이터 삽입
          data: dataFromAPI,
          // 테이블과 페이지 버튼, 부가 기능 버튼 등
          // 배치를 어떻게 할 것인지 작성한 것
          dom: '<"top"fR>t<"bottom"p><"clear"B>',
          // Column Visualization(컬럼 표시 / 미표시) 기능
          // excel : 엑셀로 다운로드 기능
          buttons: ["colvis", "excel"],
          // 한 행을 선택할 수 있음 - 선택한다고 뭐가 일어나진 않음
          select: true,
          columns: [
            { data: "GOODS_CODE" },
            {
              data: "GOODS_NAME",
              render: function (data, type, row) {
                return anchorTag({
                  href: row["GOODS_URL"],
                  inside: data,
                });
                // return "<a href='" + row["GOODS_URL"] + "'>" + data + "</a>";
              },
            },
            {
              data: "GOODS_IMG_URL",
              render: function (data, type, row) {
                // console.log("data is : ", data);
                // console.log("type is : ", type);
                // console.log("row is : ", row);
                return anchorTag({
                  href: row["GOODS_URL"],
                  inside: imageTag({
                    src: data,
                    tagStyle: "height: 80px;",
                  }),
                });

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
