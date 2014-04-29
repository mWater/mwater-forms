(function (OrientationPublisher) {
    var rotateCompass = function(elem, degrees) {
        var prefixes = ["", "Webkit", "Moz", "ms", "O"];
        var transformValue = "rotate(" + degrees + "deg)";
        prefixes.forEach(function(prefix){
            elem.style[prefix + "Transform"] = transformValue;
        });
    };

    //Create a jQuery plugin wrapper around the Places Autcomplete control
    $.fn.compass = function (options) {
        var $elems = this;
        var opts = options || {};
        OrientationPublisher.init();
        $(document).on("orientationChange", function(event, values){
            var degrees = values.normalized.alpha;
            
            $("#debug").text(JSON.stringify(values));

            if (opts.sourceBearing) {
                degrees = options.sourceBearing - (-1 * degrees);
            }

            $elems.each(function(){
                rotateCompass($(this)[0], degrees);
            });
        });

        $(document).on("compassneedscalibration", function(){
            alert("fired Compass needs calibration event");
        });
    };
})(OrientationPublisher);
