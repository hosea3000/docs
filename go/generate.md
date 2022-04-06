## go: generate


`go generate`命令是在Go语言 1.4 版本里面新添加的一个命令，当运行该命令时，它将扫描与当前包相关的源代码文件，找出所有包含`//go:generate`的特殊注释，提取并执行该特殊注释后面的命令。

通常用来自动生成代码。防止手动更改会有遗漏或出错

### 利用 go generate 处理 enum
这是目前最常用的  go: generate 使用场景

```go
type Pill int

const (
	Placebo Pill = iota
	Aspirin
	Ibuprofen
	Paracetamol
)

//go:generate stringer -type=Pill
func main() {
	fmt.Println("Hello, world.", Aspirin)
}
```

执行命令 `go generate` 会自动生成 `pill_string.go` 文件。文件内容如下

```go
import "strconv"

func _() {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	var x [1]struct{}
	_ = x[Placebo-0]
	_ = x[Aspirin-1]
	_ = x[Ibuprofen-2]
	_ = x[Paracetamol-3]
}

const _Pill_name = "PlaceboAspirinIbuprofenParacetamol"

var _Pill_index = [...]uint8{0, 7, 14, 23, 34}

func (i Pill) String() string {
	if i < 0 || i >= Pill(len(_Pill_index)-1) {
		return "Pill(" + strconv.FormatInt(int64(i), 10) + ")"
	}
	return _Pill_name[_Pill_index[i]:_Pill_index[i+1]]
}
```


### 常用的 go generate 工具
[GoGenerateTools](https://github.com/golang/go/wiki/GoGenerateTools)