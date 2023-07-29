import {
  changeStatusTodo,
  deleteTodo,
  getMainList,
  getArchiveList,
  getStatistics,
  createTodo,
  editTodo,
} from "./service.js";

const theadComp = document.querySelector("#thead-style");
const listTodo = document.querySelector(".list-of-todo__body");
const statisticsInfo = document.querySelector(".statistics__body");
const todoTemplate = document.querySelector("#todo-template");
const categoryTemplate = document.querySelector("#category-template");
const addTodoBtn = document.querySelector("#addTodo");
const form = document.querySelector("#form");
const dialog = document.querySelector("#dialog");
const toggle = document.querySelector("#toggle");

const addTodo = (note) => {
  const clone = todoTemplate.content.cloneNode(true);
  const { category, name, created, content, date, id } = note;

  clone.querySelector(".name").textContent = name;
  clone.querySelector(".created").textContent = created;
  clone.querySelector(".category").textContent = category;
  clone.querySelector(".content").textContent = content;

  if (date.length <= 1) {
    clone.querySelector(".date").textContent = date;
  } else {
    const dateSelect = document.createElement("select");
    dateSelect.setAttribute(
      "style",
      "  background-color: transparent;border: none; font-size: inherit; font-family: inherit;"
    );
    date.forEach((e) => {
      const option = document.createElement("option");
      option.value = e;
      option.textContent = e;
      dateSelect.appendChild(option);
    });
    clone.querySelector(".date").appendChild(dateSelect);
  }

  clone
    .querySelector(".edit")
    .addEventListener("click", () => showDialog("edit", note), false);
  clone.querySelector(".archive").addEventListener(
    "click",
    () => {
      changeStatusTodo(id);
      updateTables();
    },
    false
  );
  clone.querySelector(".archive").innerHTML =
    listTodo.dataset.status === "active"
      ? ' <svg class="icon-archive" width="32" height="32"><use href="./images/sprites.svg#icon-archive"></use></svg>'
      : '<svg class="icon-archive" width="32" height="32"><use href="./images/sprites.svg#icon-archive"></use></svg>';
  clone.querySelector(".delete").addEventListener(
    "click",
    () => {
      deleteTodo(id);
      updateTables();
    },
    false
  );

  listTodo.appendChild(clone);
};

const addCategory = (category) => {
  const clone = categoryTemplate.content.cloneNode(true);
  const { name, active, archive } = category;

  clone.querySelector(".category").textContent = name;
  clone.querySelector(".active-count").textContent = active;
  clone.querySelector(".archive-count").textContent = archive;

  statisticsInfo.appendChild(clone);
};

const updateTables = () => {
  clearTable(listTodo);
  clearTable(statisticsInfo);

  listTodo.dataset.status === "active"
    ? fillTable(listTodo, getMainList())
    : fillTable(listTodo, getArchiveList());

  fillTable(statisticsInfo, getStatistics());
};

const clearTable = (table) => {
  table.innerHTML = "";
};

const fillTable = (table, tableContent) => {
  table === listTodo
    ? tableContent.forEach((element) => addTodo(element))
    : tableContent.forEach((element) => addCategory(element));
};

const showDialog = (mode = "create", note) => {
  form.dataset.mode = mode;
  form.dataset.noteId = note?.id;

  if (note) {
    const { name, category, content } = note;
    form.querySelector("#name").value = name;
    form.querySelector("#category").value = category;
    form.querySelector("#content").value = content;
  }

  dialog.showModal();
};

addTodoBtn.addEventListener("click", () => showDialog(), false);

toggle.addEventListener(
  "click",
  () => {
    clearTable(listTodo);

    if (listTodo.dataset.status === "active") {
      listTodo.dataset.status = "archive";
      theadComp.dataset.thead = "archive";

      fillTable(listTodo, getArchiveList());
    } else {
      listTodo.dataset.status = "active";
      theadComp.dataset.thead = "active";
      fillTable(listTodo, getMainList());
    }
  },
  false
);

const resetForm = () => {
  form.reset();
  dialog.close();
};

dialog.addEventListener("click", (event) => {
  // Если клик был не по форме и не по кнопкам редактирования/удаления, то закрываем окно
  if (
    !form.contains(event.target) &&
    !event.target.classList.contains("edit") &&
    !event.target.classList.contains("delete")
  ) {
    resetForm();
  }
});

form.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target).entries());

    form.dataset.mode === "edit"
      ? editTodo(formData, form.dataset.noteId)
      : createTodo(formData);

    resetForm();

    fillTable(listTodo, getMainList());
    fillTable(statisticsInfo, getStatistics());
    updateTables();
  },
  false
);

fillTable(listTodo, getMainList());
fillTable(statisticsInfo, getStatistics());
