import data from "./data.json" assert { type: "json" };

document.getElementById("dropdown").addEventListener("change", function () {
  let rowPerPage = document.getElementById("dropdown").value;
  let length = data.length;
  let totalpageNumber =
    length % rowPerPage == 0
      ? length / rowPerPage
      : Math.floor(length / rowPerPage + 1);
  console.log(totalpageNumber);

  displayTableContent(rowPerPage, 1, 0);

  pagination(rowPerPage, totalpageNumber);

  // dragableRow();
  // sortArray(1);
  searchBar("meenakshi");
});

document.getElementById("dropdown").dispatchEvent(new Event("change"));

document.getElementById("sort").addEventListener("change", function () {
  let rowPerPage = document.getElementById("dropdown").value;
  let value = document.getElementById("sort").value;
  sortArray(value);
  displayTableContent(rowPerPage, 1, 0);
});

document
  .getElementById("search_controller")
  .addEventListener("input", function (event) {
    let rowPerPage = document.getElementById("dropdown").value;
    let searchedValue = searchBar(event.target.value);
    displayTableContent(rowPerPage, 1, 0, searchedValue);
  });

function displayTableContent(
  rowPerPage,
  pageNumber,
  startIndex,
  searchedValue
) {
  let table = document.getElementById("table");
  let tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  for (let i = startIndex; i < rowPerPage * pageNumber; i++) {
    let tr = document.createElement("tr");
    tr.setAttribute("id", `tr${i}`);
    tr.setAttribute("draggable", true);
    tr.addEventListener("dragstart", function (event) {
      dragableRow(event);
    });

    tr.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    tr.addEventListener("drop", function (event) {
      console.log(event);
      dropRow(event, `tr${i}`);
    });

    for (let j = 0; j < 4; j++) {
      let td = document.createElement("td");
      td.setAttribute("id", `td${i}${j}`);
      td.innerText = searchedValue ? searchedValue[i][j] : data[i][j];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    table.appendChild(tbody);
  }
}

function pagination(rowPerPage, totalpageNumber) {
  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  let prev = document.createElement("a");
  prev.innerHTML = "&laquo;";
  pagination.appendChild(prev);

  for (let i = 1; i <= totalpageNumber; i++) {
    let anchor = document.createElement("a");
    anchor.innerText = i;
    anchor.setAttribute("class", `pagination${i}`);
    anchor.setAttribute("href", "#");
    anchor.addEventListener("click", function () {
      let pageNumber = anchor.innerText;
      let startIndex = rowPerPage * (pageNumber - 1);
      displayTableContent(rowPerPage, pageNumber, startIndex);
    });
    pagination.appendChild(anchor);
  }

  let next = document.createElement("a");
  next.innerHTML = "&raquo;";
  pagination.appendChild(next);
}

function dragableRow(event) {
  console.log(event.target.id);
  event.dataTransfer.setData("text/plain", event.target.id);
}

function dropRow(event, position) {
  event.preventDefault();
  console.log(position);
  let data = event.dataTransfer.getData("text/plain");
  console.log("Dropped data:", data);
  let parent = document.getElementById("tbody");
  let element1 = document.getElementById(`${data}`);
  let element2 = document.getElementById(`${position}`);
  console.log(element1);
  console.log(element2);

  parent.insertBefore(element1, element2);
}

function sortArray(value) {
  let column = data.map((row) => row[value]);
  column.sort();
  column.map((col, index) => {
    data.map((row, i) => {
      if (row[value] == col) {
        data[i] = data[index];
        data[index] = row;
      }
    });
    console.log("        \n");
  });
  console.log(data);
}

function searchBar(value) {
  let searchValue = data.filter((row) => {
    return row.some((colVal) => colVal == value);
  });
  console.log(searchValue);
  return searchValue;
}
