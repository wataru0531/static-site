/**************************************************************

Todo Project
https://www.udemy.com/course/the-creative-javascript-course/learn/lecture/29046408?start=1#overview

gsap easings  https://gsap.com/docs/v3/Eases/

***************************************************************/
// "数値" 指定時間後にトゥイーン。タイムラインの先頭からの時間（秒）で開始
// "+=1"  直前のトゥイーンの終了後に何秒だけ離すか delay: 1 と同じ
// "-=1"  直前のトゥイーンの終了に何秒だけ重ねるか delay: -1　と同じ

// ">"    直前のトゥイーンの終了時
// ">3"   直前のトゥイーンの終了後に何秒だけ離すか。3秒後にトゥイーンする
// "<"    直前のトゥイーンの開始時
// "<4"   直前のトゥイーンの開始時の何秒後か。4秒後にトゥイーン

// "ラベル名"  指定したラベルと同じタイミングでトゥイーン
// "ラベル名 += 数値"
// "ラベル名 -= 数値"


const todoInput = document.getElementById("js-todoInput");
const todoButton = document.getElementById("js-todoButton");
const todoList = document.getElementById("js-todoList"); // ulタグ
const filterOption = document.getElementById("js-filterTodo");
const resetButton = document.getElementById("js-resetBtn");

// EventListener
document.addEventListener("DOMContentLoaded", getTodos); // todosがlocalStorageにあれば全取得
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);
resetButton.addEventListener("click", resetLocalStorage);

// Functions
function addTodo(e) {
  e.preventDefault();

  // console.log(e);

  // div要素 ラップする
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");

  // li のテキスト部分
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo-text");
  newTodo.innerText = todoInput.value; // input要素のテキストを格納
  todoItem.appendChild(newTodo);


  // ローカルストレージに保存
  saveLocalTodos(todoInput.value);


  // 削除ボタン
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("todo__deleteButton");
  deleteButton.innerText = "delete"
  todoItem.appendChild(deleteButton);

  // 完了ボタン
  const completedButton = document.createElement("button");
  completedButton.classList.add("todo__completedButton");
  completedButton.innerText = "completed";
  todoItem.appendChild(completedButton);

  // ulタグのtodo-listに追加
  todoList.appendChild(todoItem);

  // inputのフォームを初期化
  todoInput.value = "";

  // todoItemを削除
  // newTodo.addEventListener("click", deleteItem)
}


// todoItemをクリック ... クリックした要素によって発火する動きを切り替える
async function deleteCheck(e){
  // console.log(e.target); // 

  const item = e.target;
  console.log(item.classList); // DOMTokenList ['todo__completedButton', value: 'todo__completedButton']

  // クリックしたDOMのクラス名が削除ボタンならばtodoItemを削除
  if(item.classList[0] === "todo__deleteButton"){
    const todo = item.parentElement;
    todo.classList.add("fall"); // fallクラス付与。アニメーション


    // localStorageからも削除
    removeLocalTodos(todo);

    // 1000m秒間待機
    // await new Promise(resolve => setTimeout(resolve, 1000));

    // todo.remove();

    // transitioned ... CSSのtransitionの実行が済んでから発火
    todo.addEventListener("transitionend", function(){
      // console.log("remove!")
      todo.remove();
    })
  }

  // クリックしたDOMのクラスがcompleteボタンの時はcompletedクラスをトグル半透明に
  if(item.classList[0] === "todo__completedButton"){
    const todo = item.parentElement;
    todo.classList.toggle("completed");
  }

}


// selectタグのオプションをクリック
function filterTodo(e){
  console.log(e.target.value); // all, completed, uncompleted

  // ulの中の.todo-itemを取得
  const todos = todoList.childNodes;
  // console.log(todos); // NodeList(3) [div.todo-item, div.todo-item, div.todo-item]

  // 
  todos.forEach(todo => {

    switch(e.target.value){
      case "all":
        todo.style.display = "block";
        break;
      
      case "completed":
        if(todo.classList.contains("completed")){
          todo.style.display = "block";
        } else {
          todo.style.display = "none";
        }
        break;
      
      case "uncompleted":
        if(!todo.classList.contains("completed")){
          todo.style.display = "block";
        } else {
          // completedならば削除
          todo.style.display = "none";
        }
        break;
    }
  })

}


// ローカルストレージに保存
function saveLocalTodos(todo){ // todoInput.value
  // 
  let todos;

  if(localStorage.getItem("todos") === null) {
    // todosがlocasStrageにない場合
    todos = [];

  } else {
    // ある場合はパースして取得
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.push(todo);

  // localStorageにjsonにして保存
  localStorage.setItem("todos", JSON.stringify(todos));
}


// todosを取得
function getTodos(){
  let todos;

  if(localStorage.getItem("todos") === null){
    todos = [];
  } else {
    // todosがある場合は、todosを取得。
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  //
  todos.forEach(todo => {

    // div要素 ラップする
    const todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");

    // li のテキスト部分
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-text");
    newTodo.innerText = todo; // input要素のテキストを格納
    todoItem.appendChild(newTodo);

    // 削除ボタン
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("todo__deleteButton");
    deleteButton.innerText = "delete"
    todoItem.appendChild(deleteButton);

    // 完了ボタン
    const completedButton = document.createElement("button");
    completedButton.classList.add("todo__completedButton");
    completedButton.innerText = "completed";
    todoItem.appendChild(completedButton);

    // ulタグのtodo-listに追加
    todoList.appendChild(todoItem);
  });

}


/**************************************************************
削除 deleteCheckで使用
***************************************************************/
function removeLocalTodos(todo){
  // console.log(todo); // <div class="todo-item fall"></div>

  let todos;

  if(localStorage.getItem("todos") === null){
    todos = [];
  } else {
    // 
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  // console.log(todos); // ['aaa', 'ddd', 'fff']
  // console.log(todo.children); // HTMLCollection(3) [li.todo-text, button.todo__deleteButton, button.todo__completedButton]
  // console.log(todos.indexOf("fff"))

  const todoIndex = todo.children[0].innerText; // liの中のテキスト

  // todos配列からtodoIndexに見合うものから一つ削除
  // indexOf ... 配列ないの指定された要素のインデックスの番号を返す
  todos.splice(todos.indexOf(todoIndex), 1);

  // localStorageを更新
  localStorage.setItem("todos", JSON.stringify(todos));
}

/**************************************************************
localStorageをクリア
***************************************************************/
function resetLocalStorage(){
  localStorage.clear();

  // ブラウザをリロード
  window.location.reload();

  // 現在のhrefを格納することでリロードすることができる
  // window.location.href = window.location.href;
}

// console.log(window.location)