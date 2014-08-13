;(function($, window, document, undefined) {

    var pluginName = "metisMenu",
        defaults = {
            toggle: true,
            doubleTapToGo: false
        };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {

            var $this = $(this.element),
                $toggle = this.settings.toggle,
                obj = this,
                active = $this.find("li.active").has("ul").children("ul"),
                notActive =  $this.find("li").not(".active").has("ul").children("ul");
            
            // Repair IE8, 9 bug
            if (this.isIE() <= 9) {
            	active.collapse("show");
            	notActive.collapse("hide");
            }
            active.addClass("collapse in");
            notActive.addClass("collapse");

            //add the "doubleTapToGo" class to active items if needed
            if (obj.settings.doubleTapToGo) {
                $this.find("li.active").has("ul").children("a").addClass("doubleTapToGo");
            }

            $this.find("li").has("ul").children("a").on("click", function(e) {
                e.preventDefault();

                //Do we need to enable the double tap
                if (obj.settings.doubleTapToGo) {

                    //if we hit a second time on the link and the href is valid, navigate to that url
                    if (obj.doubleTapToGo($(this)) && $(this).attr("href") !== "#" && $(this).attr("href") !== "") {
                        e.stopPropagation();
                        document.location = $(this).attr("href");
                        return;
                    }
                }

                $(this).parent("li").toggleClass("active").children("ul").collapse("toggle");

                if ($toggle) {
                    $(this).parent("li").siblings().removeClass("active").children("ul.in").collapse("hide");
                }

            });
        },

        isIE: function() { //https://gist.github.com/padolsey/527683
//            var undef,
//            v = 3,
//            div = document.createElement("div"),
//            all = div.getElementsByTagName("i");
//
//        while (
//            div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->",
//            all[0]
//        ) {
//            return v > 4 ? v : undef;
//        }
//The original IE code bug
           var rv = 10; // Return value assumes failure.
        	  if (navigator.appName == 'Microsoft Internet Explorer'){
        	    var ua = navigator.userAgent;
        	    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        	    if (re.exec(ua) != null)
        	      rv = parseFloat( RegExp.$1 );
        	    }
        	  return rv;
        },

        //Enable the link on the second click.
        doubleTapToGo: function(elem) {
            var $this = $(this.element);

            //if the class "doubleTapToGo" exists, remove it and return
            if (elem.hasClass("doubleTapToGo")) {
                elem.removeClass("doubleTapToGo");
                return true;
            }

            //does not exists, add a new class and return false
            if (elem.parent().children("ul").length) {
                 //first remove all other class
                $this.find(".doubleTapToGo").removeClass("doubleTapToGo");
                //add the class on the current element
                elem.addClass("doubleTapToGo");
                return false;
            }
        }

    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
