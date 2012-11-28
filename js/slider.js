;(function($) {
    var init = {
        natural: function(elem, index, settings) {
            var el = $(elem),
                track = el.find('.mod-is-track'),
                input = el.find('.mod-is-input'),
                width = track.width(),
                fakePercent = input.data('percent') !== null;

            var ajustBgPos = function(percent) {
                var pos = width * percent - 300;
                track.css({ 'background-position': pos + 'px 0' });
            };
            
            var handleChange = function(e) {
                var pos = +this.value * elem.zSlider.diff;
            
                elem.zSlider.setSliderPos(pos);
                ajustBgPos(elem.zSlider.percent);
                el.trigger('onChange');
            };

            // Populating shadow DOM
            elem.zSlider = new iSlider(elem, {
                knob: 'mod-is-knob',
                track: 'mod-is-container',
                onChange: function(perc) {
                    ajustBgPos(perc);
                    el.trigger('onChange');
                    
                    if (fakePercent) {
                        input.data('percent', this.percent).trigger('input');
                    }
                    else {
                        input.val(this.percent).trigger('input');
                    }
                },
                onDragEnd: function() {
                    el.trigger('onDragEnd');
                    if (fakePercent) {
                        input.data('percent', this.percent).trigger('change');
                    }
                    else {
                        input.val(this.percent).trigger('change');
                    }
                }
            });

            fakePercent || input.on('change', handleChange);
            
            return elem.zSlider;
        },
        snap: function(elem, index, settings) {
            var el = $(elem),
                track = el.find('.mod-is-container'),
                input = el.find('.mod-is-input'),
                
                width = track.width(),
                delim = settings.points - 1,
                chunk = width / delim,
                area = settings.area || (chunk / 2),

                fakePosition = input.data('position') !== null,
                point = 0;

            var handleChange = function(e) {
                var pos = +this.value * chunk;
                elem.zSlider.setSliderPos(pos);
                el.trigger('modchange');
            };

            // Populating shadow DOM
            elem.zSlider = new iSlider(elem, {
                knob: 'mod-is-knob',
                track: 'mod-is-container',
                onBeforeChange: function(x) {
                    var mile, pos;
                    for (var i = 0; i < settings.points; i++) {
                        mile = i * chunk;
                        if (x > (mile - area) && x < (mile + area)) {
                            point = i;
                            pos = Math.min(Math.max(0, (mile - this.knobWidth / 2) | 0), this.trackWidth - this.knobWidth);
                            this.setSliderPos(pos);
                        }
                    }
                    return false; // never allow the knob to be moved by user
                },
                onChange: function() {
                    el.trigger('onChange');
                    if (fakePosition) {
                        input.data('position', point).trigger('input');
                    }
                    else {
                        input.val(point).trigger('input');
                    }
                }
            });

            fakePosition || input.on('change', handleChange);
            
            return elem.zSlider;
        }
    };

    $.fn.inputSlider = function(options) {
        var s = $.extend({
            type: 'natural'
        }, options);
        
        this.forEach(function(elem, index) {
            return elem.zSlider || init[s.type](elem, index, s);
        });
    };
})(Zepto);
