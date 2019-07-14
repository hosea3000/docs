# mongo

### Mongo 的数组查询

1.  查询数组长度
```js
   db.RawData.find({OtherIncome: {$size: 1 }})
```
2. 查询数组长度大于0的方法
```js
    db.RawData.find({'OtherIncome.1': {$exists: true }})
    db.RawData.find({$where: 'this.OtherIncome.length > 0'})
```
