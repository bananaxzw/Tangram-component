/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * path: ui/Input.js
 * author: zhangyao
 * version: 1.0.0
 * date: 2010-08-26
 */


//依赖包
///import baidu.ui.createUI;
///import baidu.object.extend;
///import baidu.string.format;
///import baidu.dom.g;
///import baidu.dom.removeClass;
///import baidu.dom.addClass;
///import baidu.dom.insertHTML;
///import baidu.dom.remove;

//声明包
///import baidu.ui.input;


/**
 * Input基类，创建一个input实例。
 * @class Input类
 * @param     {String|HTMLElement}     target        存放input控件的元素，input控件会渲染到该元素内。
 * @param     {Object}                 [options]     选项
 * @config    {String}                 text          input文本信息
 * @config    {Boolean}                disabled      控件是否有效，默认为false（有效）。
 * @config    {Function}               onfocus       聚焦时触发
 * @config    {Function}               onblur        失去焦点时触发
 * @config    {Function}               onchage       input内容改变时触发
 * @config    {Function}               onkeydown     按下键盘时触发
 * @config    {Function}               onkeyup       释放键盘时触发
 * @config    {Function}               onmouseover   鼠标悬停在input上时触发
 * @config    {Function}               onmouseout    鼠标移出input时触发
 * @config    {Function}               ondisable     当调用input的实例方法disable，使得input失效时触发。
 * @config    {Function}               onenable      当调用input的实例方法enable，使得input有效时触发。
 * @config    {Function}               ondispose     销毁实例时触发
 * @returns   {Boolean} 是否有效，true(失效)/false(有效)。
 */

baidu.ui.Input = baidu.ui.createUI(new Function).extend(
	/**
     *  @lends baidu.ui.Input.prototype
     */
{
    //ui控件的类型，传入给UIBase **必须**
    uiType            : "input",
    //ui控件的class样式前缀 可选
    //classPrefix     : "tangram-input-",
    tplBody         : '<input id="#{id}" class="#{class}" value="#{text}" onfocus="#{onfocus}" onblur="#{onblur}" onchange="#{onchange}" onkeydown="#{onkeydown}" onkeyup="#{onkeyup}" onmouseover="#{onmouseover}" onmouseout="#{onmouseout}" />',
    disabled		: false,
 
    /**
     * 获得input的HTML字符串。
     * @private
     * @returns {String} HTML字符串
     */
    getString : function(){
        var input = this;
        return baidu.format(input.tplBody, {
				id          : input.getId(),
				onfocus		: input.getCallString("_onFocus"),
				onblur		: input.getCallString("_onBlur"),
				onchange	: input.getCallString("_onChange"),
				onkeydown	: input.getCallString("_onKeyDown"),
				onkeyup		: input.getCallString("_onKeyUp"),
				onmouseover : input.getCallString("_onMouseOver"),
				onmouseout  : input.getCallString("_onMouseOut"),
				text		: input.text,
            	"class"     : input.getClass(input.isDisabled() ? "disable" : "")
        });
    },

    /**
     *  将input绘制到DOM树中。target参数不可省，否则无法渲染。
	 * @public
	 * @param {String|HTMLElement} target 目标渲染对象
     */	
	render : function(target){
		if(!baidu.g(target)){
			return ;
		}
		var input = this;
        baidu.dom.insertHTML(input.renderMain(target), "beforeEnd", input.getString());
        input.getBody().disabled = input.disabled;
	},
	
	_onEventHandle : function(eventName, styleName){
		var input = this;
		if(input.isDisabled()){
			return;
		}
		input._changeStyle(styleName);
		input.dispatchEvent(eventName);
	}, 
	
    /*
     *  聚焦input框时调用。
     */    
	_onFocus : function(){
        this._onEventHandle("onfocus","focus");
	},
    
    /*
     *  失去input框焦点时调用。
     */    
	_onBlur : function(){
        this._onEventHandle("onblur");
	},
	
	/*
     *  input框中内容改变时触发。
     */    
	_onChange : function(){
        this._onEventHandle("onchange");
	},
	
    /*
     *  鼠标按下按钮时调用。
     */ 	
	_onKeyDown : function(){
		this._onEventHandle("onkeydown","focus");
	},

    /*
     *  按钮弹起时调用。
     */ 
	_onKeyUp : function(){
		this._onEventHandle("onkeyup","focus");		
	},
	
    /*
     *  鼠标移出按钮时调用。
     */ 	
	_onMouseOver : function(){
		this._onEventHandle("onmouseover","hover");	
	},	
	
    /*
     *  鼠标移出按钮时调用。
     */ 	
	_onMouseOut : function(){
		this._onEventHandle("onmouseout");			
	},
	
    /*
     *  触发不同事件引起input框样式改变时调用。
     *  style值为normal(tangram-input)、hover(tangram-input-hover)、disable(tangram-input-disable)、focus(tangram-input-focus)
     */ 
	_changeStyle : function(style){
		var input = this,
            body = input.getBody();
		
		baidu.dom.removeClass(
            body,
            input.getClass("hover") + " " + input.getClass("focus") + " " + input.getClass("disable")
        );

		baidu.addClass(body, input.getClass(style));
	},

    /**
     *  判断input是否处于失效状态。
	 * @public
	 * @return {Boolean}    是否处于失效状态
     */ 	
	isDisabled : function(){
		return this.disabled;
	},
	
	/**
     *  获得input文字。
	 * @public 
	 * @return {String}    输入框的文字 
     */
	getText : function(){
		var text = this.getBody().value; 
		return text;
	},
	
	

	_able : function(eventName, isDisabled, styleName){
		var input = this;
		input._changeStyle(styleName);
		input.getBody().disabled = isDisabled;
		input.disabled = isDisabled;
		input.dispatchEvent(eventName);	
	},
	
	/**
     *  使input控件有效。
	 * @public
     */ 
	enable : function(){
		this._able("onenable", false);
	},

    /**
     *  使input控件失效。
	 * @public
     */
	disable : function(){	
		this._able("ondisable", true, "disable");
	},
	
    /**
     *  销毁实例。
	 * @public
     */
	dispose : function(){
		var input = this;
		input.dispatchEvent("ondispose");
		baidu.dom.remove(input.getBody());
		baidu.lang.Class.prototype.dispose.call(input);
	}

});
