## CAS操作

```go
package main
import (
    "fmt"
    "sync"
    "sync/atomic"
)

var (
    counter int32          //计数器
    wg      sync.WaitGroup //信号量
)

func main() {

    threadNum := 5

    //1. 五个信号量
    wg.Add(threadNum)

    //2.开启5个线程
    for i := 0; i < threadNum; i++ {
        go incCounter(i)
    }

    //3.等待子线程结束
    wg.Wait()
    fmt.Println(counter)
}

func incCounter(index int) {
    defer wg.Done()

    spinNum := 0
    for {
        //2.1原子操作
        old := counter
        ok := atomic.CompareAndSwapInt32(&counter, old, old+1)
        if ok {
            break
        } else {
            spinNum++
        }
    }

    fmt.Printf("thread,%d,spinnum,%d\n",index,spinNum)

}
```
- atomic.CompareAndSwapInt32具有三个参数，第一个是变量的地址，第二个是变量当前值，第三个是要修改变量为多少，该函数如果发现传递的old值等于当前变量的值，则使用第三个变量替换变量的值并返回true，否则返回false。
- 也就是说累加操作可能要多次才能操作成功，所以需要用for循环套起来


### 总结

go中CAS操作可以有效的减少使用锁所带来的开销，但是需要注意在高并发下这是使用cpu资源做交换的。