### 工厂方法模式

* 特点：
  - 根据工厂创建对用的产品
* 优点：
  - 新增产品是新增对应的工厂和产品就好了， 不用修改原有的工厂类， 产品之间的创建逻辑解耦
* 缺点：
  - 新增产品需要新增产品和工厂类， 比较麻烦， 因为一个产品对应一个类， 产品较多时类会很多

```js
interface Product {
  useFunction(): void;
}

class ProductA implements Product {
  public useFunction(){
    console.log("ProductA useFunction")
  }
}

class ProductB implements Product {
  public useFunction(){
    console.log("ProductB useFunction")
  }
}

abstract class Factory {
  public abstract createProduct(): Product;
}

class ProductAFactory extends Factory {
  public createProduct(): Product {
    return new ProductA();
  }
}

class ProductBFactory extends Factory {
  public createProduct(): Product {
    return new ProductB();
  }
}

const productAFactory = new ProductAFactory()
productAFactory.createProduct().useFunction()

const productBFactory = new ProductBFactory()
productBFactory.createProduct().useFunction()
```
