# UForm

UForm 是基于 AngularJs 的一套模型驱动表单框架。特点是：模型化、高兼容、易拓展。

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
后者为对 （dialog service)[https://github.com/m-e-conroy/angular-dialog-service] 的又一层封装。能够更加方便地使用 dialog 组件。


### 其他

1. 去除 angular-validator 和其相关的 glue
2. field 存在 $error 且为 $dirty 时，会自动加上 `has-error` 的样式
3. 其他细微的修改


## Contact me:

如有使用方面的问题，请发送邮件到 404762352@qq.com 与我沟通
