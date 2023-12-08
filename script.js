let data = [
  [1, "meenakshi", 25, "Bangalore"],
  [2, "Jane", 30, "Chennai"],
  [3, "Bob", 28, "Delhi"],
  [4, "priya", 25, "coimbatore"],
  [5, "sathiya", 30, "vellore"],
  [6, "John Smith", 28, "Delhi"],
  [7, "Mohana", 25, "kadalur"],
  [8, "Joy", 30, "trichy"],
  [9, "kannan", 28, "west bengal"],
  [10, "Ganesh", 25, "Mangalore"],
  [11, "krissha", 30, "tripathi"],
  [12, "raj", 28, "nepal"],
  [13, "Ganesh", 25, "Mangalore"],
  [14, "krissha", 30, "tripathi"],
  [15, "raj", 28, "nepal"]
];

const head = ["sno", "name", "age", "city"]

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
});

document.getElementById("dropdown").dispatchEvent(new Event("change"));

document.getElementById("sort").addEventListener("change", function () {
  let rowPerPage = document.getElementById("dropdown").value;
  let value = document.getElementById("sort").value;
  sortArray(value);
  displayTableContent(rowPerPage, 1, 0);
});

document.getElementById("search_controller").addEventListener("input", function (event) {
  let rowPerPage = document.getElementById("dropdown").value;
  let searchedValue = searchBar(event.target.value);
  displayTableContent(rowPerPage, 1, 0, searchedValue);
});

function displayTableContent(rowPerPage, pageNumber, startIndex, searchedValue) {
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

    tr.addEventListener("dragend", function (event) {
      event.target.classList.remove("dragging");
    });

    tr.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    tr.addEventListener("drop", function (event) {
      console.log(event);
      drop(event, `tr${i}`);
    });

    for (let j = 0; j < 4; j++) {
      let td = document.createElement("td");
      td.setAttribute("id", `td${i}${j}`);
      td.innerText = searchedValue ? searchedValue[i][j] : data[i][j];
      tr.appendChild(td);
    }

    let td = document.createElement("td");
    let editButton = document.createElement("button");
    editButton.innerHTML = "edit";
    editButton.setAttribute("class", "buttonCss");
    editButton.setAttribute("id", `editButton${i}`);

    editButton.addEventListener("click", function (event) {
      editBox(event);
    });

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "delete";
    deleteButton.setAttribute("class", "buttonCss");
    deleteButton.setAttribute("id", `deleteButton${i}`);
    td.appendChild(editButton);
    td.appendChild(deleteButton);
    td.setAttribute("id", `td${i}4`);

    deleteButton.addEventListener("click", function (event) {
      deleteFunction(event);
    });

    tr.appendChild(td);
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
  event.target.classList.add("dragging");
}

function drop(event, position) {
  event.preventDefault();
  console.log(event);
  let data = event.dataTransfer.getData("text/plain");
  // let receivedArray = JSON.parse(data);

  console.log("Dropped data:", data);
  let parent = document.getElementById("tbody");

  // if (Array.isArray(receivedArray)) {
  //   console.log("element1");

  //   for (let index = 1; index < receivedArray.length; i++) {
  //     let element1 = document.getElementById(`${receivedArray[index]}`);
  //     console.log(value[value.length - 1])
  //     // let element2 = document.getElementById(`${event.target.value[event.target.value.length - 1]}`);
  //     console.log(element1);
  //     // console.log(element2);

  //     // parent.insertBefore(element1, element2);
  //   }
  // }
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

function editBox(event) {
  // console.log(event.target.offsetParent.id);
  document.getElementById("popupForm").style.display = "block";

  document.getElementById('dataTable').classList.add('disabled');
  let rowById = document.getElementById(event.target.offsetParent.id);
  let parentNode = rowById.parentNode;

  let childElements = parentNode.querySelectorAll(`td[id]`);

  childElements.forEach(function (child, index) {
    // console.log(document.getElementById(child.id).innerText)
    if (index < 4) {
      document.getElementById(head[index]).value = document.getElementById(child.id).innerText;

      document.getElementById(head[index]).addEventListener('change', function (event) {
        // console.log(event.target.value);
        document.getElementById(event.target.id).value = event.target.value;
      })


    }
  });
  console.log(rowById)
  console.log(parentNode)


}

function deleteFunction(event) {
  console.log(event.target.offsetParent.id)
  let childElement = document.getElementById(event.target.offsetParent.id);
  let parentNode = childElement.parentNode;
  let grandParentNode = parentNode.parentNode;
  grandParentNode.removeChild(parentNode);
}



document.getElementById("closeButton").addEventListener("click", function () {
  document.getElementById("popupForm").style.display = "none";
  document.getElementById('dataTable').classList.remove('disabled');
})

document.getElementById('form').addEventListener('submit', function (event) {
  const datas = new FormData(form);
  datas.forEach((value, index) => {
    data[index] = value;
    console.log(data[index]);
  })
  document.getElementById("popupForm").style.display = "none";
})

document.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
  checkbox.addEventListener('change', function (event) {
    console.log(event)
    if (event.target.checked) {

      let parent = document.getElementById(`thead`);
      let sibiling = document.getElementById(`${event.target.value - 1}`)
      let newelement = document.createElement('th');
      newelement.setAttribute('id', `${event.target.value}`)
      newelement.innerText = head[event.target.value];
      parent.insertBefore(newelement, sibiling);

      data.forEach((value, index) => {
        let parent = document.getElementById(`tr${index}`);
        let sibiling = document.getElementById(`td${index}${event.target.value - 1}`)
        let newelement = document.createElement('td');
        newelement.setAttribute('id', `td${index}${event.target.value}`)
        newelement.innerText = value[event.target.value];

        parent.insertBefore(newelement, sibiling);
        console.log(value[event.target.value]);
        console.log(sibiling)
      });
    }
    else {
      let elements = document.querySelectorAll(`[id$="${event.target.value}"]:not([id^="tr"]):not([id^="editButton"]):not([id^="deleteButton"])`);
      elements.forEach((element) => {
        console.log(element);
        element.remove();
      });
    }
    console.log(event.target.id);
  });
});

for (let index = 0; index < 4; index++) {
  document.getElementById(`${index}`).addEventListener('dragstart', function (event) {
    let col = document.querySelectorAll(`[id$="${index}"]:not([id^="tr"]):not([id^="editButton"]):not([id^="deleteButton"])`);
    let colarray = [];
    col.forEach((element, index) => {
      element.setAttribute("draggable", true);
      element.setAttribute("class", "draggable");
      colarray[index] = element.id;
      console.log(colarray)
    });
    event.dataTransfer.setData("text/plain", JSON.stringify(colarray))
  })

  document.getElementById(`${index}`).addEventListener('drop', function (event) {
    event.preventDefault();
    drop(event);
    // let parent = document.getElementById("tbody");
    // let element1 = document.getElementById(`${data}`);
    // let element2 = document.getElementById(`${position}`);
    // console.log(element1);
    // console.log(element2);

    // parent.insertBefore(element1, element2);
  })
}
