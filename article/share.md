### TypeScript

1. 类型 AS 的灵活使用(写父类就好了)
2. 函数的重载
3. Enum 的坑
4. interface 和 class 使用 |&
5. export 和 export default
6. 接口拥有任意属性, 但是指定属性有验证

```js
interface Person {
    name: string;
    readonly age: number;
    hobby?: string;
    [propName: string]: any;
}
```

7. 使用泛型提高重用性

```js
export interface listApiResponse<T> {
  items: T[]
  pagination: PaginationResponse
}

listApiResponse<Segment>
```

8. 获取 JS 值的类型

```js
const person = {
  name: 'jim',
  age: 99,
};

type Person = typeof person;
// type Person = {
//     name: string;
//     age: number;
// }
```

9. 获取类型的键

```js
interface Person {
    name: string
    age: number
}

type K = keyof Person
```
