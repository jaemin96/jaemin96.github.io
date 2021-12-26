("use strict");

const todoInput = document.querySelector("#todoListForm input");
const todoAddBtn = document.querySelector(".todoAddBtn");
todoAddBtn.innerHTML = "+";

const todoList = document.querySelector("#todoList");
const deleteBtn = document.querySelector(".deleteBtn");

let toDo = [];
const TODO_KEY = "TODO";
const LOCAL_TODO_LIST = localStorage.getItem(TODO_KEY);

const addTodoLocal = () => {
  localStorage.setItem(TODO_KEY, JSON.stringify(toDo));
};
// json 객체 (통신이 가능한 형태로) - JSON.stringify
// json -> array 파싱 - (JSON.stringify).parse()

const showTodoList = () => {
  if (LOCAL_TODO_LIST && LOCAL_TODO_LIST.length > 0) {
    const loadItems = JSON.parse(LOCAL_TODO_LIST);
    if (loadItems) {
      toDo = loadItems;
    }

    if (toDo) {
      toDo.forEach((item) => {
        const listItem = document.createElement("li");
        const deleteBtn = document.createElement("button");

        const ItemTitle = document.createElement("span");

        ItemTitle.innerHTML = `${item}`;

        deleteBtn.innerHTML = "x";
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.addEventListener("click", handler.deleteList);

        listItem.appendChild(ItemTitle);
        listItem.appendChild(deleteBtn);
        todoList.appendChild(listItem);
      });
    }
  }
};

const handler = {
  addList: (e) => {
    e.preventDefault();

    const listItem = document.createElement("li");
    const deleteBtn = document.createElement("button");

    const ItemTitle = document.createElement("span");

    if (todoInput.value.trim("") !== "") {
      ItemTitle.innerHTML = `${todoInput.value}`;

      deleteBtn.innerHTML = "x";
      deleteBtn.classList.add("deleteBtn");
      deleteBtn.addEventListener("click", handler.deleteList);

      listItem.appendChild(ItemTitle);
      listItem.appendChild(deleteBtn);
      todoList.appendChild(listItem);

      toDo.push(todoInput.value);

      todoInput.value = ``;

      addTodoLocal();
    } else if (todoInput.value.trim("") === "") {
      alert("please enter Todo");
    }
  },

  deleteList: (e) => {
    e.preventDefault();
    const target = e.target;
    const todoTitle = target.parentNode.firstChild.innerHTML;

    todoList.removeChild(target.parentNode);

    newTodo = toDo.filter((item) => item !== todoTitle);

    toDo = newTodo;
  },
};

showTodoList();
todoAddBtn.addEventListener("click", handler.addList);
