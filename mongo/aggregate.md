### 根据条件增加新的field

```mongo
db.orders.aggregate([
  {
    "$addFields": {
      "newField": {
        "$cond": {
          "if": {
            $gt: [
              "$price",
              15
            ]
          },
          "then": "gt15",
          "else": "lt15"
        }
      }
    }
  }
])
```


### group 常规使用

```
db.orders.aggregate([
  {
    $group: {
      _id: "$quantity",  // 必须要_id作为key
      total: {           // 求和
        $sum: "$price"
      },
      maxPrice: {       // 取最大值
        $max: "$price"
      },
      count: {           // 计算 count
        $sum: 1
      }
    }
  }
])
```


### redact 修剪对象
需要每一层都有一个相同的key

- $$PRUNE 去掉节点
- $$DESCEND 继续往下一层寻找
- $$KEEP  保留整个节点

```
db.orders.aggregate([
  {
    $redact: {
      $cond: {
        if: {
          $eq: [
            "$level",
            5
          ]
        },
        then: "$$DESCEND",
        else: "$$PRUNE"
      }
    }
  }
])
```

### aggregate 关联表
```
db.orders.aggregate([
  {
    "$lookup": {
      "from": "inventory",
      "localField": "item",
      "foreignField": "sku",
      "as": "inventory_docs"
    }
  }
])
```