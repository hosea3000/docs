### 抽象工厂模式

* 特点：
  - 多个工厂多个产品， 每个工厂都能生产多种产品，  但是每个工厂生产出来的同一个产品特点都不一样
* 优点：
  - 新增产品是新增对应的工厂和产品就好了， 不用修改原有的工厂类， 产品之间的创建逻辑解耦
* 缺点：
  - 所有的工厂和产品的种类都已经设计好， 难以扩展抽象工厂来生产新种类的产品

```js
interface ProductA {
  factory: string
  usefulFunctionA(): void
}

interface ProductB {
  factory: string
  usefulFunctionB(): void
}

class ProductA implements ProductA {
  public factory: string
  constructor(factory: string){
    this.factory = factory
  }
  usefulFunctionA() {
    console.log(`this is ProductA usefulFunctionA, made in ${this.factory}`)
  }
}

class ProductB implements ProductB {
  public factory: string
  constructor(factory: string){
    this.factory = factory
  }
  usefulFunctionB() {
    console.log(`this is ProductB usefulFunctionB, made in ${this.factory}`)
  }
}


interface Factory{
  factoryName: string
  createProductA(): ProductA
  createProductB(): ProductB
}

class FactoryA implements Factory{
  factoryName = 'FactoryA'
  createProductA() {
    return new ProductA(this.factoryName)
  }
  createProductB() {
    return new ProductB(this.factoryName)
  }
}


class FactoryB implements Factory{
  factoryName = 'FactoryB'
  createProductA() {
    return new ProductA(this.factoryName)
  }
  createProductB() {
    return new ProductB(this.factoryName)
  }
}

const productA: ProductA = new FactoryA().createProductA()
productA.usefulFunctionA()
const productB: ProductB = new FactoryA().createProductB()
productB.usefulFunctionB()


const productA1: ProductA = new FactoryB().createProductA()
productA1.usefulFunctionA()
const productB1: ProductB = new FactoryB().createProductB()
productB1.usefulFunctionB()
```