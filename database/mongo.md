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


### 如何将MongoDB聚合用于通用集合操作(并集,交集,差异)

#### 插入数据
```js
db.colors.insert({
    _id: 1,
    left : ['red', 'green'],
    right : ['green', 'blue']
});
```

#### 并集
```js
db.colors.aggregate([{
	'$project': {  
    union:{ $setUnion:["$left","$right"] }
   }
}]);
```

#### 差集
```js
// 在left中不在right中
db.colors.aggregate([{
	'$project': {  
		diff:{$setDifference:["$left","$right"]}
	}
}]);
```

#### 对称差集(不在交集的集合)
```js
db.colors.aggregate([{
	'$project': {  
		diff:{
			$setUnion:[
        {$setDifference:["$left","$right"]},
        {$setDifference:["$right","$left"]}
			]
		}
	}
}]);
```

