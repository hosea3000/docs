Update all documents in array

```
db.coll.update({}, {$set: {"a.$[].b": 2}})
Input: {a: [{b: 0}, {b: 1}]}
Output: {a: [{b: 2}, {b: 2}]}
```

Update all matching documents in array

```
db.coll.update({}, {$set: {"a.$[i].b": 2}}, {arrayFilters: [{"i.b": 0}]})
Input: {a: [{b: 0}, {b: 1}]}
Output: {a: [{b: 2}, {b: 1}]}
```
Update all matching scalars in array

```
db.coll.update({}, {$set: {"a.$[i]": 2}}, {arrayFilters: [{i: 0}]})
Input: {a: [0, 1]}
Output: {a: [2, 1]}
```

Update all matching documents in nested array
```
db.coll.update({}, {$set: {"a.$[i].c.$[j].d": 2}}, {arrayFilters: [{"i.b": 0}, {"j.d": 0}]})
Input: {a: [{b: 0, c: [{d: 0}, {d: 1}]}, {b: 1, c: [{d: 0}, {d: 1}]}]}
Output: {a: [{b: 0, c: [{d: 2}, {d: 1}]}, {b: 1, c: [{d: 0}, {d: 1}]}]}
```

Update all scalars in array matching a logical predicate
```
db.coll.update({}, {$set: {"a.$[i]": 2}}, {arrayFilters: [{$or: [{i: 0}, {i: 3}]}]})
Input: {a: [0, 1, 3]}
Output: {a: [2, 1, 2]}
```