# webpack 模块化原理探索

本文简要探索 webpack 的模块化实现。

在目录 `cjs` 和 `mjd` 下都有两个文件： `index.js` 和 `bar.js` ，分别使用 `CommonJS` 和 `ES Module` 的写法进行模块导出和引入。

## 运行

> 本 demo 使用的 webpack 版本：`^5.65.0` ，webpack-cli 版本：`^4.9.1`

### 1. 安装依赖

  ```bash
   npm install
  ```

### 2. 打包

`webpack.config.js` 中提供了简单的 webpack 打包配置，执行命令

```bash
npx webpack
```

后可在 `outputs` 目录下找到两个打包文件 `cjs.js` 和 `mjs.js` ，分别对应 `CommonJS` 和 `ES Module` 的打包结果。

## CommonJS

打包生成了立即执行函数，函数体内有一些特殊的变量。

### `__webpack_modules__` (CommonJS)

`__webpack_modules__` 是 moduleId 与模块内容的映射对象，对象的 key 是 moduleId ，value 是一个函数。

```javascript
var __webpack_modules__ = ({

  "./cjs/bar.js": ((module, exports) => {

    module.exports.sayHi = function () {
      return 'this is bar';
    }

    exports.hello = 'hello';
  }),

  "./cjs/index.js": ((module, __unused_webpack_exports, __webpack_require__) => {

    var bar = __webpack_require__("./cjs/bar.js");

    function foo() {
      return bar.sayHi();
    }

    module.exports = foo;
  })
});
```

可以看到每个 moduleId 对应的函数的参数分别是 `module`, `exports`, `__webpack_require__` ，函数内容与模块源码类似。

源码中的 `module`, `exports`, `require` 关键字分别取自函数入参，且 `require` 被更名为 `__webpack_require__` 。

### `__webpack_module_cache__` (CommonJS)

`__webpack_module_cache__` 是一个对象，用于缓存模块导出值，对象的 key 是 moduleId ，value 是含有 `exports` 属性的对象

```javascript
var __webpack_module_cache__ = {

  "./cjs/bar.js": {
    exports: {
      sayHi: function () {
        return 'this is bar';
      },
      hello: 'hello'
    }
  },

};
```

### `__webpack_require__` (CommonJS)

`__webpack_require__` 是 webpack 实现的符合 CommonJS 规范的 require 函数。

函数接收一个参数 moduleId ，被调用后会先去 `__webpack_module_cache__` 中查找是否已有指向该 moduleId 的缓存：

- 如果已有缓存，则直接返回缓存对象的 `exports` 属性
- 如果没有缓存，则：
  - 在 `__webpack_module_cache__` 上为该模块创建缓存对象，初始时 `exports` 属性为空对象
  - 以该缓存对象、缓存对象的 `export` 属性以及 `__webpack_require__` 函数为参数调用 `__webpack_modules__` 中该模块对应的函数
    - 调用模块函数时源码会通过暴露出去的 `module` 和 `exports` 变量将模块导出值挂载到缓存对象上
  - 返回缓存对象的 `exports` 属性

### 总结 (CommonJS)

在 CommonJS 模块化规范下

- require 是同步执行的
- 被 require 的模块只会执行一次，首次执行的结果会被缓存下来，接下来对该模块的所有 require 都会直接返回这个缓存值

## ES Module

打包生成了立即执行函数，函数体内有一些特殊的变量。

### `__webpack_modules__` (ES Module)

与 CommonJS 类似， `__webpack_modules__` 是 moduleId 与模块内容的映射对象，对象的 key 是 moduleId ，value 是一个函数。

```javascript
var __webpack_modules__ = ({

  "./mjs/bar.js": ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      "default": () => (__WEBPACK_DEFAULT_EXPORT__),
      "sayHi": () => (sayHi),
      "hello": () => (hello)
    });

    const __WEBPACK_DEFAULT_EXPORT__ = ('d');

    function sayHi() {
      return 'this is bar';
    }

    const hello = 'hello';
  })
});
```

模块函数的入参依然是 `module`, `__webpack_exports__`, `__webpack_require__` ，函数内容相比源码有比较大的改动：

- 模块顶部会调用 `__webpack_require__.r` 函数用来在模块的 `exports` 上添加 `__esModule: true` 来标识此 module 是一个 ES Module
- 所有 `exports` 语句会被 **提升** 到模块顶部，通过调用 `__webpack_require__.d` 函数在 `exports` 上添加属性

### `__webpack_module_cache__` (ES Module)

与 CommonJS 类似， `__webpack_module_cache__` 是一个对象，用于缓存模块导出值，对象的 key 是 moduleId ，value 是含有 `exports` 属性的对象

```javascript
var __webpack_module_cache__ = {

  "./cjs/bar.js": {
    exports: {
      get sayHi() {
        return function () {
          return 'this is bar';
        };
      },
      get hello() {
        return 'hello';
      }
    }
  },

};
```

该对象与 CommonJS 的主要区别在于：

- `exports` 对象上存放的导出值不是普通属性，而是 getter 属性

### `__webpack_require__` (ES Module)

与 CommonJS 相同， `__webpack_require__` 函数接收一个参数 moduleId ，被调用后会先去 `__webpack_module_cache__` 中查找是否已有指向该 moduleId 的缓存：

- 如果已有缓存，则直接返回缓存对象的 `exports` 属性
- 如果没有缓存，则：
  - 在 `__webpack_module_cache__` 上为该模块创建缓存对象，初始时 `exports` 属性为空对象
  - 以该缓存对象、缓存对象的 `export` 属性以及 `__webpack_require__` 函数为参数调用 `__webpack_modules__` 中该模块对应的函数
    - 调用模块函数时源码会通过暴露出去的 `module` 和 `exports` 变量将模块导出值挂载到缓存对象上
  - 返回缓存对象的 `exports` 属性

### `__webpack_require__.r` (ES Module)

```javascript
__webpack_require__.r = (exports) => {
  if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
  }
  Object.defineProperty(exports, '__esModule', { value: true });
};
```

`__webpack_require__.r` 函数接收参数 `exports` ，在 `exports` 上定义属性 `__esModule` 并赋值为 `true` 。

### `__webpack_require__.o` (ES Module)

```javascript
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
```

`__webpack_require__.o` 函数接收参数 `obj` 和 `prop` ，判断 `obj` 是否拥有自有属性 `prop`。

### `__webpack_require__.d` (ES Module)

```javascript
__webpack_require__.d = (exports, definition) => {
  for(var key in definition) {
    if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
      Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
    }
  }
};
```

- `__webpack_require__.d` 函数接收参数 `exports` 和 `definition`
  - 其中 `definition` 是对象
    - key 为导出项的标识符（如果是默认导出项则 key 为 default）
    - value 为用于获取该导出项值的函数
- 针对 `definition` 中的每一个 key ，使用 `__webpack_require__.o` 函数检查 key 是否作为属性存在于 `exports` 上
  - 如果不存在，则在 `exports` 上定义属性 key 的 getter ，其 getter 函数取自 `definition[key]`

### 总结

- CommonJS 只在通过执行 `require` 首次插入缓存时执行模块，即缓存了模块的导出值
- ES Module 为每个导出项设置了 getter 函数，虽然也对模块做了缓存，但每次读取导出项时都会执行 getter 函数，实现了「缓存模块导出项的引用」的效果
