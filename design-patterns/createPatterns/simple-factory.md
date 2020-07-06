### 简单工厂模式

> 又叫静态方法模式(因为工厂类定义了一个静态方法)

- 特点：
  - 工厂类用静态方法实现产品的创建
- 优点：
  - 将创建实例与使用实例分开，使用者不必关心类对象如何创建，实现了解耦
- 缺点：
  - 新增产品需要修改工厂类

```js
abstract class Product {
  abstract useFunction(): void
}

class ProductA extends Product {
  useFunction() {
    console.log(`ProductA useFunction`)
  }
}

class ProductB extends Product {
  useFunction() {
    console.log(`ProductB useFunction`)
  }
}

class SimpleFactory {
  public static createProduct(product: string) {
    switch (product) {
      case "A": return new ProductA();
      case "B": return new ProductB();
    }
  }
}

const pro: Product = SimpleFactory.createProduct('A')
pro.useFunction()
```
