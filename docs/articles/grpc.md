---
title: grpc 是什麼， node.js 實作
description: GRPC 是 google 開發的一種 Remote Procedure Call(RPC) 框架，他可以讓服務與客戶端都是閱讀同一份文件(proto檔案)，而此 proto 檔案是由 ，且建立在 HTTP 2.0 上，有更佳的傳輸數率，同時可以在多個語言上實作，如 go ruby nodejs python c#，官方都有充分的 Demo Code 可以參考，已下會使用 Nodejs 來紀錄我們學習過程
tags: nodejs,http
---

# grpc 是什麼， node.js 實作
GRPC 是 google 開發的一種 Remote Procedure Call(RPC) 框架，他可以讓服務與客戶端都是閱讀同一份文件(proto檔案)，而此 proto 檔案是由 ，且建立在 [HTTP 2.0]() 上，有更佳的傳輸數率，同時可以在多個語言上實作，如 go ruby nodejs python c#，官方都有充分的 Demo Code 可以參考，已下會使用 Nodejs 來紀錄我們學習過程

## 觀念
在 grpc 接口中客戶端可以直接呼叫 API method，而不需要項傳統後端提供的 API 文建照著 endpoint 與 路徑來撰寫，只需要服務端先定義好客戶端所需使用的接口，再將定義的接口經過編譯轉換成客戶使用的語言，就可以直接呼叫，可參考以下的圖他們都是透過同一份文件(proto)進行溝通的，不管是在哪個裝置都可以很容易地進行使用

![grpc outline](/images/grpc-outline.png)


## Proto 檔案是什麼
上面所說的 Proto 檔案室由 [Protocol Buffers](https://protobuf.dev/overview/)，他是 google 開發已久且成熟的系列化資料機制，主要是可在檔案中定義所使用到的 API 與 資料格式，是個跨平台跨語言的 Protocol，只需要照著官方的語法撰寫就可以編譯成特定語言的 API

Protocol Buffer 文件的寫法
```proto
message Person {
  string name = 1;
  int32 id = 2;
  bool has_ponycopter = 3;
}
```

### 實作

### 安裝 grpc 
```bash
$ npm install @grpc/grpc-js @grpc/proto-loader --save
```

### 安裝額外套建

```bash
$ npm install fs-extra --save
```

### Todo Data
```json
[
  {
    "id": "1",
    "title": "Todo1",
    "description": "This is Todo1 description",
    "done": false
  },
  {
    "id": "2",
    "title": "Todo2",
    "description": "This is Todo2 description",
    "done": false
  }
]

```


### proto 檔案定義

```proto
/* todo.proto */

syntax = "proto3";

// 定義 Todo 的資料結構
message Todo {
    string id = 1;
    string title = 2;
    string description = 3;
    bool isDone = 4;
}

// 定義取得 Todo List 的 Request 與 Response
message GetTodoListRequest {
    
}

message GetTodoListResponse {
    repeated Todo todoList = 1;
}

// 定義取得單一 Todo 的 Request 與 Response
message GetTodoRequset {
    string id = 1;
}

message GetTodoResponse {
    Todo todo = 1;
}

service TodoService {
    rpc GetTodoList(GetTodoListRequest) returns (GetTodoListResponse);
    rpc GetTodoItem(GetTodoRequset) returns (GetTodoResponse);
}

```

### Server 撰寫 
```js
// server.js
const fs = require("fs-extra");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "todo.proto");

let todoList = [];

// 載入 proto 檔案，與載入他的定義格式
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const todoProto = grpc.loadPackageDefinition(packageDefinition);

// 實作定義的 function
function getTodoList(call, callback) {
    callback(null, { todoList: todoList });
}

// 實作定義的 function
function getTodoItem(call, callback) {
    const todo = todoList.find((todo) => todo.id === call.request.id);

    callback(null, { todo });
}

function main() {
  const server = new grpc.Server();
  server.addService(todoProto.TodoService.service, {
    getTodoList,
    getTodoItem,
  });

  server.bindAsync(
    "0.0.0.0:3000",
    grpc.ServerCredentials.createInsecure(),
    () => {

      todoList = fs.readJSONSync("todo.json")

      console.log("listen grpc server on port 3000");

      server.start();
    }
  );
}

main();
```

* function getTodoList(call,callback) 裡面代的參數 call 與 callback，有點類似於 express 中的 res 與 req 用法，call 裡面可以去獲取倒帶的參數，而 callback 第一個參數是 error 時回傳的內容，由於是 google 開發的 使用上比較像是 go lang 中將錯誤放在第一個參數進行傳遞，第二個參數就為成功時回傳的 response

### Client Side

```js
// client.js
const fs = require("fs-extra");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "todo.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const todoProto = grpc.loadPackageDefinition(packageDefinition);

function main() {
  const client = new todoProto.TodoService(
    "0.0.0.0:3000",
    grpc.credentials.createInsecure()
  );

  client.getTodoList({}, (err, res) => {
    console.log("getTodoList res: ", res);
  });

  client.getTodoItem({ id: "1" }, (err, res) => {
    console.log("getTodoItem res: ", res);
  });
}

main();
```

啟動兩個 terminal
```bash
$ node server.js
$ node client.js

getTodoList res:  {
  todoList: [
    {
      id: '1',
      title: 'Todo1',
      description: 'This is Todo1 description',
      isDone: false
    },
    {
      id: '2',
      title: 'Todo2',
      description: 'This is Todo2 description',
      isDone: false
    }
  ]
}
getTodoItem res:  {
  todo: {
    id: '1',
    title: 'Todo1',
    description: 'This is Todo1 description',
    isDone: false
  }
}
```

### 使用測試軟體
安裝 [boomrpc](https://github.com/bloomrpc/bloomrpc)，他有點類似於 postman 可以用於測試 API 是否完成，使用介面也很簡單只需要將你的 proto 匯入在按下確定就可以了

![bloom rpc demo](https://github.com/bloomrpc/bloomrpc/blob/master/resources/editor-preview.gif?raw=true)


### 提供串流的傳輸方式
::: tip
不管是請求或是回應都可以藉由串流的方式進行傳輸，完整範例建議看官方的[介紹](https://grpc.io/docs/languages/node/basics/)
:::

* 修改 Todo.proto，將 list 以串流的方式傳回客戶端，新增下方的 method

```proto
service TodoService {
    rpc GetTodoListStream(GetTodoListRequest) returns (stream Todo);    
}
```

* server
實作 getTodoListStream 的函式，藉由 write 將值做 stream 的傳遞

```js
function getTodoListStream(call) {
  todoList.forEach((todo) => {
    call.write(todo);
  });

  call.end();
}

server.addService(todoProto.TodoService.service, {
    ...,
    getTodoListStream,
});
```

## 結論
在使用 grpc 時，研究了滿久包含他的 buffer protocol 該怎麼寫，裡面也可以寫成 enum 的形式和各種參數怎麼解析，還有 http2.0 是什麼，為何要使用等等的，接觸到的知識算是滿廣，寫法算是滿方便的尤其是不需要再額外寫 swagger 真的是很方便，但是在 nodejs 上使用還是並不是很好用，在使用 node 開發也遇到些問題不像 go lang 有很好的提示再寫的時候有點黑箱作業，裡面要帶什麼樣的參數其實還是寫得很 free，沒有 interface 的界定寫起來有點怕怕的，目前大多還是作用在 micro service 上，服務間互傳較多