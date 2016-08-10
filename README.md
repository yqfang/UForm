# UForm

UForm 是基于 AngularJs 的一套模型驱动表单框架。特点是：模型化、高兼容、易拓展。

## UForm v3.6 changelog

- 新增 layout 配置（自动分列）[demo](http://yqfang.github.io/UForm/#/form/common/horizontal)

layout 接受一个数组，数组长度为列数，数组每个元素为当前列 field 的个数（fied 按照 id 排序后自动分列）

```
    "option": {
        "name": "demo1",
        "layout": [15, 8, null], // 三列，每列为 15， 8， 总列数-15-8
        "labelClass": "col-xs-4",
        "inputClass": "col-xs-18"
    }
```

如果需要均分每列，只需要给数组的值设为 null，例如

```
    "option": {
        "name": "demo1",
        "layout": [null, null], // 两列，每列为（总 field 数 / 2)
        "labelClass": "col-xs-4",
        "inputClass": "col-xs-18"
    }
```
### 备注

1. 为了分列的粒度能够更好地控制，把 bootstrap 原本的栅格系统由 12 cols 变为 24 cols，请更新最新的 [up-lib](https://github.com/yqfang/up-lib)
2. 参考自动分列[源码](https://github.com/yqfang/UForm/blob/master/src/layout/up-form-actual-layout.js#L2)，用户可以自行实现自动分组+自动分列，无非是拼 dom 的时候再加一层 group 的嵌套，用户可以自行实现。

```
    "option": {
        "name": "demo1",
        "layout": 'grouped',
        "labelClass": "col-xs-4",
        "inputClass": "col-xs-18"
    }
,
    "groups": [{
        "name": "组1",
        "layout": [2, 2]
    },{
        "name": "组2",
        "layout": [3, 3]
    }, {
        "name": "组3",
        "layout": [null, null]
    }]
```


## UForm v3.5 changelog


## 表单自定义布局指令的支持

自定义布局指令本质上就是给 field 预留对应的 **插入点**，uForm 在渲染每个 field 指令的时候会检查布局指令的**插入点**，如果有则渲染到
插入点中，如下例子中，`transclude-id` 定义了每个插入点的位置。

```
angular.module("up.uform")
    	.directive('myAppLayout', function($timeout) {
		return {
			restrict: 'EA',
            transclude: true,
			templateUrl: 
                `<div>
                    <div class="col-xs-12">
                        <div transclude-id="username"></div>
                        <div transclude-id="password"></div>
                        <div transclude-id="linkedA"></div>
                        <div transclude-id="linkedB"></div>
                    </div>
                    <div class="col-xs-12">
                        <div transclude-id="username1"></div>
                        <div transclude-id="password1"></div>
                        <div transclude-id="group"></div>
                    </div>
                    <div ng-transclude></div>
                </div>`,
			link: function(scope, elem, attr, ctrl, transclude) {

		    }
		}
	})

```


定义好自定义指令之后，还需要通过配置告诉 uform，你需要对当前表单使用哪一种布局。
在 uform 的 option 配置项中制定 `layout` 配置项，传入布局指令的名称即可，非常方便。

```
    "option": {
        "name": "demo1",
        "formClass": "form-horizontal",
        "layout": "my-app-layout",
        "labelClass": "col-xs-6",
        "inputClass": "col-xs-16"
    }
```

## 重构
- 重构 form 模板，分理出 field 模板



## UForm v3.0 changelog

### 配置优化
- field 的 customs 配置更名为 `extend` 意为**拓展的**
- ng 自带的验证指令：ng-pattern, ng-minlength, ng-maxlength 配置挪到 `extend` 中

### 更好的构造函数

除了通过 json 大对象的方式构造 uform之外，现在提供了更好的构造函数：

```
uform.buildForm('sqlConfiger', 'form-horizontal', 'col-xs-0', 'col-xs-12')
    .addField('name', 'up-text', null, null, {placeholder: 'username'}, "hello")
    .addField('editor', 'up-editor', null, {height: "400px"}, {syntax:'sql'}, "world"])
    .end());
```

uform 是一个 service
buidForm 方法分别接收 uform 的 name, formClass, labelClass, fieldClass 四个参数
addField 方法分别接受 field 的 name, type, label, style, opts(其他配置), init(初始值) 六个参数
end 方法返回配置完成的 form 对象。

### 更多的 field 组件支持

- upText
- upDate
- upTime
- upDatetime
- upPassword
- upCheckbox
- upRadio
- upSubmit
- upSelect
- upTextarea
- upEditor(*New!*)
- upDialog(*New!*)

本着万物皆表单的原则，upField 家族新增了 *upEditor* 和 *upDialog* 两大组件
前者为 code 富文本编辑器，目前定制为支持 `sql` 和 `json` 两种语法高亮
后者为对 [dialog service](https://github.com/m-e-conroy/angular-dialog-service) 的又一层封装。能够更加方便地使用 dialog 组件。


### 其他

1. 去除 angular-validator 和其相关的 glue
2. field 存在 $error 且为 $dirty 时，会自动加上 `has-error` 的样式
3. 其他细微的修改


## Contact me:

如有使用方面的问题，请发送邮件到 404762352@qq.com 与我沟通
