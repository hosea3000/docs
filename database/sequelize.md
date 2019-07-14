### 关联查询时父表和子表的OR关系查询
#### 问题描述:
加入我有一个搜索, 传入一个关键字, 即可以按照父表的设备名称搜索, 也可以按照子表的设备所在的房间名称搜索.
第一想法我会这样写
```javascript
Device.findAll({
  where: {
      $or: [
        { device_name: keyword },
        { 'room.room_name': keyword }
      ]
  },
  include: [{
    model: Room,
  }]
})
```
这时候应该会报错
`SequelizeDatabaseError: column Device.room.room_name does not exist`

其实问题的关键就是在外层的where怎么使用子表的column的问题:


#### 方法一:
> 参考链接: [传送门](https://github.com/sequelize/sequelize/issues/3527)

```js
Device.findAll({
  where: {
      $or: [
        { device_name: keyword },
        sequelize.where(sequelize.col('room.room_name'), 'ILIKE', `%${keyword}%`),
    ]
  },
  include: [{
    model: Room,
  }]
})
```

#### 方法二:
> 参考链接: [传送门](https://github.com/sequelize/sequelize/issues/3095)

```javascript
Device.findAll({
  where: {
      $or: [
        { device_name: keyword },
        { '$room.room_name$': keyword }
      ]
  },
  include: [{
    model: Room,
    as: 'room',
  }]
})
```
这个方法的关键是 `$$` 中间可以使用关联名称,  所以关联的时候使用as


### 对多个字段关联

```
 app.model.Home.hasOne(app.model.VrHomeInfo, {
      foreignKey: 'home_id',
      constraints: false,
      scope: app.Sequelize.where(app.Sequelize.col('vr_home_info.client_id'), '=', app.Sequelize.col('home.client_id')),
      as: 'vr_home_info',
    });
```


> upsert 传where是无效的, 以后不要传了, 传的对象必须包含唯一键