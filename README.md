# UForm

UForm is Directive for data-driven form for various field

## UForm v1.0 Update

1. add two form style: form-horizental and form-inline 
2. add date-picker component
3. add multiple input
4. add labelClass and inputClass


## Example:

You can simply use Uform as a directive, just like:

```
	<form u-form 
	      ng-controller="pageController as pageCtrl"
		  name="moduleForm"          
		  config="pageCtrl.config" 
		  ng-submit='pageCtrl.submit(moduleForm.$valid, pageCtrl.result)' 
		  btn-handler="pageCtrl.click(field)" 
		  result="pageCtrl.result">
		  <input type="submit"/>
	</form>

```

and your can try demo just clone the repository and use http-server by type:

```
http-server -p 8080
```

## api:

- u-form

the directive name, which can be used as an attr of a form element

- ng-controller

the controller which fetch the essential field data and some config data of the form,

and it also hold an result object, which would be send to the server once submitted.

- config

hold the essential config object, you can see example from `/json/form.json`

- ng-submit

trigger once submitted

- btn-handler

Your form may has some label-button list, which could also be treated as form field,

so it's convinient to give all button a common proxy handler 

- result

the result object, you can define it in the controller scope, or it would be automatically created according your `result` attr


## TODO:

1. add file uploader, two-way-multi-selector

## Contact me:

any question, please email me: 404762352@qq.com