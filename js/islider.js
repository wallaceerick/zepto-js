/*
 *
 * Based on WKSlider by Alex Gibson, http://miniapps.co.uk/
 * Modified by Max Degterev @suprMax, http://maxdegterev.name/
 * Released under MIT license
 * http://miniapps.co.uk/license/
 *
 */
var iSlider = function(el, options) {
    this.options = options || {};

    this.element = typeof el === 'object' ? el : document.getElementById(el);

    // Detect support for Webkit CSS 3d transforms
    this.supportsWebkit3dTransform = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());

    // Get knob width
    this.knob = this.element.getElementsByClassName(this.options.knob || 'islider-knob')[0];
    this.knobWidth = this.knob.offsetWidth;

    // Get track width
    this.track = this.element.getElementsByClassName(this.options.track || 'islider-track')[0];
    this.trackWidth = this.track.offsetWidth;
    this.trackOffset = this.track.offsetLeft;

    this.diff = this.trackWidth - this.knobWidth;
    this.percent = 0;
    this.position = 0;

    if (typeof window.ontouchstart !== 'undefined') {
        this.element.addEventListener('touchmove', this, false);
        this.element.addEventListener('touchend', this, false);
    }
    else {
        this.element.addEventListener('mousedown', this, false);
    }
};

iSlider.prototype.touchmove = function(e) {
    if (this.options.onBeforeDragMove && !this.options.onBeforeDragMove.call(this, e)) {
        return;
    }

    e.preventDefault();

    this.moveKnobTo(e.targetTouches[0].pageX);
};
iSlider.prototype.touchend = function(e) {
    if (this.options.onBeforeDragEnd && !this.options.onBeforeDragEnd.call(this, e)) {
        return;
    }

    e.preventDefault();

    this.moveKnobTo(e.changedTouches[0].pageX);

    this.options.onDragEnd && !this.options.onDragEnd.call(this, e);
};

iSlider.prototype.mousedown = function(e) {
    if (this.options.onBeforeDragStart && !this.options.onBeforeDragStart.call(this, e)) {
        return;
    }

    e.preventDefault();

    this.moveKnobTo(e.pageX);

    this.element.addEventListener('mousemove', this, false);
    this.element.addEventListener('mouseup', this, false);
};
iSlider.prototype.mousemove = function(e) {
    if (this.options.onBeforeDragMove && !this.options.onBeforeDragMove.call(this, e)) {
        return;
    }

    e.preventDefault();

    this.moveKnobTo(e.pageX);
};
iSlider.prototype.mouseup = function(e) {
    if (this.options.onBeforeDragEnd && !this.options.onBeforeDragEnd.call(this, e)) {
        return;
    }

    e.preventDefault();

    this.moveKnobTo(e.pageX);

    this.element.removeEventListener('mousemove', this, false);
    this.element.removeEventListener('mouseup', this, false);

    this.options.onDragEnd && !this.options.onDragEnd.call(this, e);
};

// Moves the slider
iSlider.prototype.moveKnobTo = function(x) {
    var pos = Math.min(Math.max(0, (x - this.trackOffset - this.knobWidth / 2) | 0), this.trackWidth - this.knobWidth);
    
    if (this.options.onBeforeChange && !this.options.onBeforeChange.call(this, pos, x)) {
        return;
    }

    this.setSliderPos(pos);
};
iSlider.prototype.setKnobPos = function() {
    // Use Webkit CSS 3d transforms for hardware acceleration if available
    if (this.supportsWebkit3dTransform) {
        this.knob.style.webkitTransform = 'translate3d(' + this.position + 'px, 0, 0)';
    }
    else {
        this.knob.style.webkitTransform = this.knob.style.MozTransform = this.knob.style.msTransform = this.knob.style.OTransform = this.knob.style.transform = 'translateX(' + this.position + 'px)';
    }

    this.options.onChange && this.options.onChange.call(this, this.percent);
};

iSlider.prototype.setSliderPos = function(pos) {
    this.percent = pos / this.diff;
    this.position = pos;

    this.setKnobPos();
};
iSlider.prototype.setSliderPerc = function(perc) {
    this.percent = perc;
    this.position = perc * this.diff;

    this.setKnobPos();
};

// Event handler
iSlider.prototype.handleEvent = function(e) {
    if (typeof(this[e.type]) === 'function') {
        return this[e.type](e);
    }
};
