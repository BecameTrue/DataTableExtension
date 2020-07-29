(function () {
  // HTML 문서가 준비되면 'show', 'destroy' id를 가진 버튼에 클릭 시 실행될 함수 연결
  $(document).ready(function () {
    // 태블로 라이브러리 초기화
    tableau.extensions.initializeAsync({ configure: configure }).then(
      function () {
        console.log("초기화 완료");
        // 초기화 완료되면 버튼에 클릭 이벤트 달기
        $("#configure-button").on("click", () => configure());
      },
      function (err) {
        // 태블로 초기화 중 에러 발생
        console.log(err);
      }
    );
  });

  // 구성 버튼을 눌렀을 때 구성 다이얼로그 호출
  var configure = () => {
    // 다이얼로그 HTML 파일 경로
    const dialogURL =
      "https://chash.in/DataTableExtension/ConfigureDialog.html";

    /* 
      다이얼로그에게 전달해주고 싶은 값(문자열만 가능!)
      전달할 게 없다면 " " 공백 하나를 넣어 보내면 되고,
      var myOpenPayload = " ";
    */
    var openPayload = " ";

    // 다이얼로그 관련 설정
    var dialogSetting = {
      height: 500,
      width: 500,
    };

    // 다이얼로그
    tableau.extensions.ui
      .displayDialogAsync(dialogURL, openPayload, dialogSetting)
      .then((closePayload) => {
        // 다이얼로그가 정상적으로 종료될 때 다이얼로그가 데이터(문자열만 가능!)를 매개변수에 담아줌
        // 해당 매개변수를 이용해, 다이얼로그가 종료될 때 동작할 함수 실행
        onDialogFinished(closePayload);
      })
      .catch((error) => {
        // 다이얼로그가 정상적으로 종료되지 않으면 에러 값을 건네줌
        // 해당 에러 값을 이용해, 정상적으로 종료되지 않았을 때 동작할 함수 실행
        onDialogError(error);
      });
  };

  var onDialogFinished = (payload) => {
    // 설정 값들을 쿠키에 저장하고

    // 워크시트의 값을 불러오고
    const sheetData = getWorksheetData(payload.sheetName);

    // 테이블이 보이게 한 뒤 - 초기에 display: none 설정되어 있음
    $("#data-table").show();
    console.log(JSON.parse(payload));
    // 데이터테이블 생성
    // initializeDataTable(sheetData);
  };

  var initializeDataTable = (dataToRender) => {
    $("#data-table").DataTable({
      // 테이블이 알아서 재초기화 될 수 있도록 삭제 가능하게 설정
      // 이 설정이 없으면 같은 곳에 다시 테이블을 만들 수 없음
      destroy: true,

      // 테이블에 렌더링 될 데이터 지정
      data: dataToRender,

      // 테이블과 페이지 버튼, 부가 기능 버튼 등
      // 배치를 어떻게 할 것인지 작성한 것
      dom: '<"top"fR>t<"bottom"p><"clear"B>',

      /*
        총 4가지의 버튼을 사용할 수 있으며 각각 해당하는 라이브러리를
        DataTables 라이브러리를 다운받을 때 같이 선택하여 다운로드 해야 함
        PDF는 한글 지원이 제대로 되지 않는다. 없애는 게 좋을 듯 

        Column Visualization(컬럼 표시 / 미표시) 기능
        excel : 엑셀로 다운로드 기능
        copy : 복사 기능
        pdf : pdf 다운로드 기능
      */
      buttons: ["colvis", "excel", "copy", "pdf"],

      /*
        한 행을 선택할 수 있음
        위에서 추가한 excel, copy, pdf 기능을 선택한 행에 한해 적용
        "shift / ctrl + click" 을 통해 여러 개 선택 가능
      */
      select: true,

      /*
        data에 JSON key 값을 넣어줌
        columns에 들어간 순서대로 <th>에 차례차례 들어감
        render 함수를 따로 지정해줌으로써 원하는 형태로 삽입할 수 있음
        
        render(data, type, row)
        - data : 해당 컬럼에 들어갈 원래의 JSON value가 들어있음
        - type : https://datatables.net/manual/data/orthogonal-data 참고
        - row : 행에 존재하는 다른 값들에 접근하기 위해 사용
      */
      columns: [
        { data: "GOODS_CODE" },
        {
          data: "GOODS_NAME",
          render: function (data, type, row) {
            return anchorTag({
              // row.GOODS_URL도 가능하지만
              // 키 값이 "GOODS URL" 이었다면 row.GOODS URL은 에러를 발생시키므로
              // 안전하게 다음과 같이 사용
              href: row["GOODS_URL"],
              inside: data,
            });
            // return "<a href='" + row["GOODS_URL"] + "'>" + data + "</a>";
          },
        },
        {
          data: "GOODS_IMG_URL",
          render: function (data, type, row) {
            // 각각 log를 찍어서 어떤 값이 들어있는 지 확인할 수 있음
            // console.log("data is : ", data);
            // console.log("type is : ", type);
            // console.log("row is : ", row);
            if (type === "display") {
              return anchorTag({
                href: row["GOODS_URL"],
                inside: imageTag({
                  src: data,
                  tagStyle: "height: 80px;",
                }),
              });
            } else return data;
          },
        },
        { data: "rating" },
      ],
    });
  };

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
    ------- 그냥 함수 없이 문자열로 "<a href='" + url + "'></a>"
    ------- 작성해도 되지만 가독성과 추후 재사용성을 고려해 함수로 작성
  */
  var anchorTag = (obj) => {
    const _start = "<a ";
    const _href = "href='" + obj.href + "' ";
    const _class = obj.tagClass !== null ? "class='" + obj.tagClass + "' " : "";
    const _style = obj.tagStyle !== null ? "style='" + obj.tagStyle + "'>" : "";
    const _end = "</a>";

    return _start + _href + _class + _style + obj.inside + _end;
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
  var imageTag = (obj) => {
    const _start = "<img ";
    const _src = "src='" + obj.src + "' ";
    const _class = obj.tagClass !== null ? "class='" + obj.tagClass + "' " : "";
    const _style =
      obj.tagStyle !== null ? "style='" + obj.tagStyle + "'/>" : "/>";

    return _start + _src + _class + _style;
  };

  var onDialogError = (error) => {
    if (error.errorCode === tableau.ErrorCodes.DialogClosedByUser) {
      console.log("사용자에 의한 다이얼로그 종료");
    } else {
      console.log(error);
    }
  };
})();
