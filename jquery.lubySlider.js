/* ===========================================================
 *
 *  Name:          slider.js
 *  Updated:       2016-04-30
 *  Version:       0.1.0
 *  Created by:    DART, Lubycon.co
 *
 *  Copyright (c) 2016 Lubycon.co
 *
 * =========================================================== */

(function($){
    $.fn.slider = function(option){
        var defaults = { 
            customID: null,
            disabled: false,
            dragEvent: null
        },
        d = {},
        isDragging = false,
        slider = {
            init: function (option) {
                return d = $.extend({}, defaults, option), this.each(function () {
                    if (!$(this).hasClass("sliderKey")) $.error("The key for slider is not exist");
                    else {
                        var $this = $(this).hide(),
                        objWidth = $this.width(),
                        defaultVal = $this.val(),
                        minVal = $this.attr("min")
                        maxVal = $this.attr("max"),
                        areaX = (maxVal - defaultVal),
                        buttonX = defaultVal,
                        disabled = d.disabled ? "disabled" : "",
                        customID = d.customID ? d.customID : "",

                        $sliderWrap = $("<div/>",{ "class" : "slider-wrapper","id" : customID}).width(objWidth)
                        .insertBefore($this).addClass(disabled).append($this),
                        $sliderBar = $("<span/>",{
                            "class" : "slider-bar",
                            "data-value" : defaultVal,
                        }).appendTo($sliderWrap),
                        $sliderArea = $("<span/>",{
                            "class" : "slider-area"
                        }).width(objWidth*1.5).css("right",areaX+"%").appendTo($sliderBar),

                        $sliderBt = $("<div/>",{
                            "class" : "slider-bt"
                        }).css("left",buttonX+"%").appendTo($sliderWrap),
                        textBox = $("<input/>",{
                            "type" : "text",
                            "class" : "slider-text",
                            "value" : defaultVal
                        }).appendTo($sliderWrap).on("change",drag.textBox),
                        disableAction = $sliderWrap.hasClass("disabled") ? "" : $sliderWrap.on("mousedown",drag.dragable)
                    }
                })
            }
        },
        drag = {
            dragable: function(event){
                if(event.which == 1 && event.target.className == "slider-bt"){
                    var $this = $(this), 
                    $bt = $this.find(".slider-bt"),
                    $bar = $this.find(".slider-bar"),
                    isDragging = true;
                    $bt.addClass("dragging");
                    $("html")
                    .on("mousemove",function(event){
                        var target = $(event.target);
                        if(isDragging && (!target.is(".slider-text"))) drag.dragAction(event.pageX,$this,$bt);
                    })
                    .on("mouseup",function(){
                        $this.off("mousemove");
                        isDragging = false;
                        $bt.removeClass("dragging"); 
                        $this.off("mouseup");
                    });
                }
            },
            dragAction: function(mouseX,selector,btn){
                var $this = selector,
                $bt = btn,
                $input = $this.find(".sliderKey"),
                $bar = $this.find(".slider-bar"),
                $area = $this.find(".slider-bar > .slider-area"),
                $text = $this.find(".slider-text"),
                width = $this.width(),
                mouseX = mouseX - $this.offset().left, objX;

                if(mouseX >= 0 && mouseX <= width) objX = mouseX;
                else if(mouseX < 0) objX = 0;
                else if(mouseX > width )objX = width;

                var ratio = width/objX,
                value = Math.floor($input.attr("max")/ratio);

                $bt.css({ "left" : objX });
                $area.css({ "right" : width - objX});
                $bar.data("value",value);
                $input.val(value);

                $text.val(value);
                $text.trigger("change");
            },
            textBox: function(){
                var $this = $(this),
                $slider = $this.siblings(".sliderKey"),
                $bar = $this.siblings(".slider-bar"),
                $area = $bar.find(".slider-area"),
                $bt = $this.siblings(".slider-bt"),
                value = isNaN($this.val()) ? 0 : $this.val() <= 100 ? $this.val() : 100,
                ratio = 100 - value + "%";
                btX = value + "%";
                
                $this.val(value);
                $area.css({ "right":ratio });
                $bt.css({"left" : btX});
                d.dragEvent(value,$this);
            }
        },
        method = {
            disable: function (selector) {
                return this.each(function () {
                    var $this = $(this);
                    $this.addClass("disabled").off("mousedown");
                })
            },
            enable: function () {
                return this.each(function () {
                    var $this = $(this);
                    $this.removeClass("disabled").on("mousedown",drag.dragable);
                })
            },
            set: function(val){
                return this.each(function(){
                    var $this = $(this);
                    text = $this.find(".slider-text");
                    text.val(val);
                    text.trigger("change");
                    console.log("SET " + val);
                })
            }
        }
        return method[option] ? 
        method[option].apply(this, Array.prototype.slice.call(arguments, 1)) : 
        "object" != typeof option && option ? 
            ($.error('No such method "' + option + '" for the lubySlider instance'), void 0) : 
            slider.init.apply(this, arguments);
};
})(jQuery);