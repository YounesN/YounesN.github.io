var ImgWarper = ImgWarper || {}

$(window).resize(function() {
    $("#content").height($(window).height() - 70);
    $("#content").width($(window).width() - 280);
});

$(document).ready(function()
{
    /* next line of comment is to get rid of IDE warning messages about jquery $ sign */
    /* global $ */
    var minDarkness = 60;
    var darknessGap = 0;
    var warper = null;
    var drawing = false;
    var imgWidth;
    var imgHeight;
    var canvas, ctx, flag = false,
    	prevX = 0,
    	prevY = 0,
    	currX = 0,
    	currY = 0,
    	dot_flag = false;
    var x = "black",
    	y = 2;
    var drawingOval = false;
    var numOvalPoints = 0;
    var ovalPoints = [];
    var texture;
    var canvasfx;
    var image;
    var zIndex = 3;
    var brightnessValue = 0;
    var contrastValue = 0;
    var hueValue = 0;
    var saturationValue = 0;
    var unsharpRadiusValue = 20;
    var unsharpStrengthValue = 2;
    var lensRadiusValue = 0;
    var lensBrightnessValue = 0.75;
    var lensAngleValue = 0;
    var transformStarted = false;

    init();

    $("#brightness-slider").slider({
        value: 0,
        min: -1,
        max: 1,
        step: 0.01,
        change: function( event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).brightnessContrast(ui.value, contrastValue).update();
            brightnessValue = ui.value;
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#contrast-slider").slider({
        value: 0,
        min: -1,
        max: 1,
        step: 0.01,
        change: function( event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).brightnessContrast(brightnessValue, ui.value).update();
            contrastValue = ui.value;
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#hue-slider").slider({
        value: 0,
        min: -1,
        max: 1,
        step: 0.01,
        change: function( event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).hueSaturation(ui.value, saturationValue).update();
            hueValue = ui.value;
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#saturation-slider").slider({
        value: 0,
        min: -1,
        max: 1,
        step: 0.01,
        change: function( event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).hueSaturation(hueValue, ui.value).update();
            saturationValue = ui.value;
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#denoise-slider").slider({
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
        change: function(event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).denoise(3 + 200 * Math.pow(1 - ui.value, 4)).update();
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#unsharp-radius-slider").slider({
        value: 20,
        min: 0,
        max: 200,
        step: 1,
        change: function(event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).unsharpMask(ui.value, unsharpStrengthValue).update();
            unsharpRadiusValue = ui.value;
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#unsharp-strength-slider").slider({
        value: 2,
        min: 0,
        max: 5,
        step: 0.01,
        change: function(event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).unsharpMask(unsharpRadiusValue, ui.value).update();
            unsharpStrengthValue = ui.value;
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#triangle-blur-slider").slider({
        value: 0,
        min: 0,
        max: 200,
        step: 1,
        change: function(event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).triangleBlur(ui.value).update();
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#lens-radius-slider").slider({
        value: 0,
        min: 0,
        max: 50,
        step: 1,
        change: function(event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).lensBlur(ui.value, lensBrightnessValue, lensAngleValue).update();
            lensRadiusValue = ui.value;
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#lens-brightness-slider").slider({
        value: 0.75,
        min: -1,
        max: 1,
        step: 0.01,
        change: function(event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).lensBlur(lensRadiusValue, ui.value, lensAngleValue).update();
            lensBrightnessValue = ui.value;
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });

    $("#lens-angle-slider").slider({
        value: 0,
        min: 0,
        max: Math.PI,
        step: 0.01,
        change: function(event, ui) {
            texture = canvasfx.texture(image);
            canvasfx.draw(texture).lensBlur(lensRadiusValue, lensBrightnessValue, ui.value).update();
            lensAngleValue = ui.value;
            image.parentNode.insertBefore(canvasfx, image);
            image.parentNode.removeChild(image);
        },
    });


    $("#about-dialog").dialog({
        width: 420,
        autoOpen: false,
        modal: true,
    });

    $('.item-title').click(function() {
        if($(this).parent().hasClass('active'))
        {
            $('.item-title').parent().removeClass('active');
            $(this).parent().children('.content').slideUp();
        }
        else {
            $('.item-title').parent().removeClass('active');
            $('.item-title').parent().children('.content').slideUp();
            $(this).parent().addClass('active');
            $(this).parent().children('.content').slideDown();
        }
    });

    function createNewLayer() {
        canvas = document.createElement("canvas");
        addListeners(canvas);
        canvas.className += "newCanvas";
        canvas.style.zIndex = zIndex.toString();
        zIndex ++;
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        document.getElementById("canvas-container").appendChild(canvas);
        ctx = canvas.getContext("2d");
    }

    $("#about-button").click(function() {
        $("#about-dialog").dialog( "option", "show", { effect: "slideDown", duration: 800 } );
        $("#about-dialog").dialog( "open" );
    });

    $("#save-button").click(function() {
        var bases = [];
        $('#canvas-container').children('.newCanvas').each(function() {
            var rank = jQuery.data(this, "rank");
            if(isNaN(rank))
                 return;
            var base = this.toDataURL();
            bases.push(base);
        });

        var form = document.createElement('form');
        form.setAttribute("method", "post");
        form.setAttribute("action", "export.php");
        var lengthInput = document.createElement("input");
        lengthInput.setAttribute("type", "hidden");
        lengthInput.setAttribute("name", "numOfLayers");
        lengthInput.setAttribute("value", bases.length);
        form.appendChild(lengthInput);
        for(var i=0; i<bases.length; i++)
        {
            var hiddenInput = document.createElement("input");
            hiddenInput.setAttribute("type", "hidden");
            hiddenInput.setAttribute("name", "L" + i);
            hiddenInput.setAttribute("value", bases[i]);
            form.appendChild(hiddenInput);
        }
        document.body.appendChild(form);
        form.submit();
    });

    $('#FreeHand').click(function() {
        if(drawing == false)
        {
            drawing = true;
            document.getElementById('FourPoint').style.pointerEvents = 'none';
            document.getElementById('Transform').style.pointerEvents = 'auto';
            $("#Transform").removeClass("disabled");
        }
        else {
            drawing = false;
            closeShape();
            createNewLayer();
            document.getElementById('FourPoint').style.pointerEvents = 'auto';
            document.getElementById('Transform').style.pointerEvents = 'none';
            $("#Transform").addClass("disabled");
        }
        $('#FreeHand').toggleClass("active");
        $('#wFourPoint').toggleClass('disabled');
    });

    $('#FourPoint').click(function() {
        if(drawingOval == false) {
            drawingOval = true;
            document.getElementById('FreeHand').style.pointerEvents = 'none';
            document.getElementById('Transform').style.pointerEvents = 'auto';
            $("#Transform").removeClass("disabled");
        }
        else {
            if(numOvalPoints != 4)
            {
                alert("Please select all 4 points first before disabling this feature!");
                return;
            }
            drawingOval = false;
            numOvalPoints = 0;
            createNewLayer();
            document.getElementById('FreeHand').style.pointerEvents = 'auto';
            document.getElementById('Transform').style.pointerEvents = 'none';
            $("#Transform").addClass("disabled");
        }
        $('#FourPoint').toggleClass("active");
        $('#FreeHand').toggleClass("disabled");
    });

    $('#Transform').click(function() {
        if(transformStarted == false)
        {
            transformStarted = true;
            var targetImg = new Image();jy
            targetImg.onload = function() {
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                warper = new ImgWarper.PointDefiner(canvas, targetImg, imageData);
            }
            var canvasData = canvas.toDataURL("image/png");
            targetImg.src = canvasData;
            document.getElementById('FreeHand').style.pointerEvents = 'none';
            document.getElementById('FourPoint').style.pointerEvents = 'none';
        }
        else
        {
            transformStarted = false;
            warper.oriPoints = [];
            warper.dstPoints = [];
            warper.redraw();
            document.getElementById('FreeHand').style.pointerEvents = 'auto';
            document.getElementById('FourPoint').style.pointerEvents = 'auto';
        }
        $('#Transform').toggleClass("active");
    });

    $('#Finish').click(function() {
        var scores = [];
        var tmpcanvas = document.createElement("canvas");
        var tmpimage = document.getElementById("image");
        tmpcanvas.width = tmpimage.width;
        tmpcanvas.height = tmpimage.height;
        tmpcanvas.getContext("2d").drawImage(tmpimage, 0, 0);
        var backgroundImage = tmpcanvas.getContext("2d").getImageData(0, 0, tmpcanvas.width, tmpcanvas.height);
        var backgroundData = backgroundImage.data;
        var pixels = [];
        var minx=99999, miny=99999, maxx=0, maxy=0;
        $('#canvas-container').children('.newCanvas').each(function() {
            var tx = this.getContext("2d");
            var imageData = tx.getImageData(0, 0, imgWidth, imgHeight);
            var data = imageData.data;
            for(var i=0; i<data.length; i+=4)
            {
                if(data[i+3]!=0)
                {
                    var curY = Math.floor((i/4)/canvas.width);
                    var curX = (i/4)%canvas.width;
                    if(curX < minx)
                        minx = curX;
                    if(curX > maxx)
                        maxx = curX;
                    if(curY < miny)
                        miny = curY;
                    if(curY > maxy)
                        maxy = curY;
                }
            }
            jQuery.data(this, "minx", minx);
            jQuery.data(this, "maxx", maxx);
            jQuery.data(this, "miny", miny);
            jQuery.data(this, "maxy", maxy);
        });

        $('#canvas-container').children('.newCanvas').each(function() {
            var tx = this.getContext("2d");
            var imageData = tx.getImageData(0, 0, imgWidth, imgHeight);
            var data = imageData.data;
            pixels = [];
            for(var i=0; i<data.length; i++)
            {
                if(data[i+3]!=0)
                {
                    var r = backgroundData[i+0];
                    var g = backgroundData[i+1];
                    var b = backgroundData[i+2];
                    var grayScale = (0.2126*r + 0.7152*g + 0.0722*b);
                    pixels.push(grayScale);
                }
            }
            for(i=0; i<pixels.length-1; i++)
            {
                for(var j=i+1; j<pixels.length; j++)
                {
                    if(pixels[i]<pixels[j])
                    {
                        var tmp = pixels[i];
                        pixels[i] = pixels[j];
                        pixels[j] = tmp;
                    }
                }
            }
            if(pixels.length > 4)
            {
                var score = pixels[0]+pixels[1]+pixels[2]+pixels[3]+pixels[4];
                /* global jQuery */
                jQuery.data(this, "score", score);
                scores.push(score);
            }
        });
        for(var i=0; i<scores.length-1; i++)
        {
            for(var j=i+1; j<scores.length; j++)
            {
                if(scores[i]<scores[j])
                {
                    var tmp = scores[i];
                    scores[i] = scores[j];
                    scores[j] = tmp;
                }
            }
        }
        $('#canvas-container').children('.newCanvas').each(function() {
            var score = jQuery.data(this, "score");
            if(isNaN(score))
                return;
            for(var i=0; i<scores.length; i++)
            {
                if(score == scores[i])
                {
                    jQuery.data(this, "rank", i);
                    break;
                }
            }
        });
        darknessGap = (minDarkness-20)/scores.length;
        $("#canvas-container").children(".newCanvas").each(function () {
            var rank = jQuery.data(this, "rank");
            if(isNaN(rank))
                 return;
            var minx = jQuery.data(this, "minx");
            var miny = jQuery.data(this, "miny");
            var maxx = jQuery.data(this, "maxx");
            var maxy = jQuery.data(this, "maxy");
            var first = 0;
            var last = 0;
            var startColorOrig = 20+rank*darknessGap;
            var endColor = 255;
            var tx = this.getContext("2d");
            var imageData = tx.getImageData(0, 0, imgWidth, imgHeight);
            var data = imageData.data;
            var dataCopy = data.slice(0);
            data = makeZero(data, data.length);
            tx.clearRect(0, 0, canvas.width, canvas.height);
            var i = Math.floor((minx+maxx)/2);
            var percent = 0.25;
            var xpercent = 0.10;
            var xlen = Math.floor((maxx-minx)*xpercent);
            var xgap = Math.floor((endColor-startColorOrig)/xlen);
            for(var j=miny; j<= maxy; j++)
            {
                var index = toIndex(i,j);
                if(dataCopy[index+3]!=0)
                {
                    first = j;
                    break;
                }
            }
            for(j=maxy; j>=miny; j--)
            {
                index = toIndex(i,j);
                if(dataCopy[index+3]!=0)
                {
                    last = j;
                    break;
                }
            }
            var pos = intensePosition(backgroundData, i, first, last);
            for(i=minx+5; i<=maxx-5; i++)
            {
                var startColor = startColorOrig;
                if(i-minx<xlen)
                {
                    var wes = i-minx;
                    startColor = endColor - wes * xgap;
                }
                else if(maxx-i<xlen)
                {
                    var wes = maxx-i;
                    startColor = endColor - wes * xgap;
                }
                for(j=miny; j<=maxy; j++)
                {
                    index = toIndex(i, j);
                    if(dataCopy[index+3]!=0)
                    {
                        first = j;
                        break;
                    }
                }
                for(j=maxy; j>=miny; j--)
                {
                    index = toIndex(i, j);
                    if(dataCopy[index+3]!=0)
                    {
                        last = j;
                        break;
                    }
                }
                first += 5;
                last -= 5;
                if(last < first)
                    continue;
                if(pos == 0) /* Top */
                {
                    var diff = last - first;
                    var inten = Math.floor(diff * percent);
                    var step;
                    for(var k=0; k<inten; k++)
                    {
                        index = ((k+first)*canvas.width+i)*4;
                        data[index+3] = 255-startColor;
                    }
                    var rest = last - first - inten;
                    var colorGap = (endColor-startColor)/rest;
                    for(k=first+inten, step = 0; k<=last; k++, step++)
                    {
                        index = (k*canvas.width+i)*4;
                        var color = startColor + colorGap * step;
                        data[index+3] = 255-color;
                    }
                }
                else if(pos == 1) /* middle */
                {
                    var diff = last - first;
                    var inten = Math.floor(diff * percent);
                    var halfway = Math.floor((diff - inten)/2);
                    var step = 0;
                    var colorGap = (endColor-startColor)/halfway;
                    for(var k=halfway, step = 0; k>=0; k--, step ++)
                    {
                        index = ((k+first)*canvas.width+i)*4;
                        var color = startColor + colorGap * step;
                        data[index+3] = 255-color;
                    }
                    for(k=halfway, step = 0; step<inten; step ++, k++ )
                    {
                        var index = ((k+first)*canvas.width+i)*4;
                        data[index+3] = 255-startColor;
                    }
                    for(var k=halfway+inten, step = 0; step < halfway; k++, step ++)
                    {
                        index = ((k+first)*canvas.width+i)*4;
                        var color = startColor + colorGap * step;
                        data[index+3] = 255-color;
                    }
                }
                else if(pos == 2) /* bottom */
                {
                    var diff = last - first;
                    var inten = Math.floor(diff * percent);
                    var step;
                    for(var k=last, step=0; step<inten ; step++, k--)
                    {
                        index = (k*canvas.width+i)*4;
                        data[index+3] = 255-startColor;
                    }
                    var rest = last - first - inten;
                    var colorGap = (endColor-startColor)/rest;
                    for(k=last-inten, step = 0; k>=first; k--, step++)
                    {
                        index = (k*canvas.width+i)*4;
                        var color = startColor + colorGap * step;
                        data[index+3] = 255-color;
                    }
                }
            }
            tx.putImageData(imageData, 0, 0);
        });
        // ***   Blurring   *** //
        $('#canvas-container').children('.newCanvas').each(function() {
            if(this != null)
            {
                /* global stackBlurCanvasRGBA */
                stackBlurCanvasRGBA(this, 0, 0, this.width, this.height, 5);
            }
        });
    });

    function makeZero(rv, len) {
        while (--len >= 0) {
            rv[len] = 0;
        }
        return rv;
    }

    function intensePosition(backgroundData, i, first, last)
    {
        var top = pointAverage(backgroundData, i, first+5);
        var middle = pointAverage(backgroundData, i, Math.floor((first+last)/2));
        var bottom = pointAverage(backgroundData, i, last-5);
        if(isNaN(top))
            return -1;
        if(isNaN(middle))
            return -1;
        if(isNaN(bottom))
            return -1;
        if(top>middle)
        {
            if(top>bottom)
                return 0;
            else
                return 2;
        }
        else
        {
            if(middle>bottom)
                return 1;
            else
                return 2;
        }
    }

    function pointAverage(backgroundData, x, y)
    {
        var sum = 0;
        var center = toIndex(x, y);
        var dist = [-imgWidth-1, -imgWidth, -imgWidth+1, -1, 0, +1, imgWidth-1, imgWidth, imgWidth+1];
        for(x in dist)
        {
            var index = center + (4*dist[x]);
            var r = backgroundData[index+0];
            var g = backgroundData[index+1];
            var b = backgroundData[index+2];
            var grayScale = (0.2126*r + 0.7152*g + 0.0722*b);
            sum += grayScale;
        }
        return sum/9;
    }

    function toIndex(x, y)
    {
        return (y*imgWidth+x)*4;
    }

	$('#inputId').change(function(e) {
		var file = e.target.files[0],
		imageType = /image.*/;

		if(!file.type.match(imageType))
			return;

		var reader = new FileReader();
		reader.onload = fileOnload;
		reader.readAsDataURL(file);
	});

    function closeShape() {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        var minx = 999999;
        var miny = 999999;
        var maxx = 0;
        var maxy = 0;
        var i,j;
        var pixelStack = [];
        var curX;
        var curY;
        // first find the boundaries of the shape
        for(var i=0; i<data.length; i+=4)
        {
            if(data[i+3]!=0)
            {
                curY = Math.floor((i/4)/canvas.width);
                curX = (i/4)%canvas.width;
                if(curX < minx)
                    minx = curX;
                if(curX > maxx)
                    maxx = curX;
                if(curY < miny)
                    miny = curY;
                if(curY > maxy)
                    maxy = curY;
            }
        }
        // lets move diagnal to find a random point inside the shape
        for(i=minx, j=miny; i<maxx && j<maxy; i++, j++)
        {
            var index = (j*canvas.width+i)*4;
            if(data[index+3]!=0)
                break;
        }
        for(;i<maxx && j<maxy; i++, j++)
        {
            var index = (j*canvas.width+i)*4;
            if(data[index+3]==0)
            {
                pixelStack.push([i,j]);
                break;
            }
        }
        // Flood Fill algorithm. We need to find a point inside the shape first.
        while(pixelStack.length)
        {
            var newPos, x, y, pixelPos, reachLeft, reachRight;
            newPos = pixelStack.pop();
            x = newPos[0];
            y = newPos[1];

            pixelPos = (y*canvas.width + x) * 4;
            while(y-- >= 0 && matchStartColor(imageData, pixelPos))
            {
                pixelPos -= canvas.width * 4;
            }
            pixelPos += canvas.width * 4;
            ++y;
            reachLeft = false;
            reachRight = false;
            while(y++ < canvas.height - 1 && matchStartColor(imageData, pixelPos))
            {
                colorPixel(imageData, pixelPos);
                if(x>0)
                {
                    if(matchStartColor(imageData, pixelPos - 4))
                    {
                        if(!reachLeft) {
                            pixelStack.push([x-1, y]);
                            reachLeft = true;
                        }
                    }
                    else if(reachLeft)
                    {
                        reachLeft = false;
                    }
                }

                if(x < canvas.width - 1)
                {
                    if(matchStartColor(imageData, pixelPos + 4))
                    {
                        if(!reachRight)
                        {
                            pixelStack.push([x+1, y]);
                            reachRight = true;
                        }
                    }
                    else if(reachRight)
                    {
                        reachRight = false;
                    }
                }
                pixelPos += canvas.width * 4;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function matchStartColor(layer, pixelPos)
    {
        return layer.data[pixelPos+3]==0;
    }

    function colorPixel(layer, pixelPos)
    {
        layer.data[pixelPos] = 0;
        layer.data[pixelPos+1] = 0;
        layer.data[pixelPos+2] = 0;
        layer.data[pixelPos+3] = 255;
    }

	function fileOnload(e) {
		var img = $('<img>', {src: e.target.result });
		var context = canvas.getContext('2d');
		var height = img[0].height;
		var width = img[0].width;

		img.load(function() {
			$("#canvas2d")[0].width = imgWidth = width;
			$("#canvas2d")[0].height = imgHeight = height;
            $("#canvas-container").width = imgWidth;
            $("#canvas-container").height = imgHeight;
            image.src = e.target.result;
            $("#content").height($(window).height() - 70);
            $("#content").width($(window).width() - 280);
		});
	}

    function addListeners(canvas) {
        canvas.addEventListener("mousemove", function (e) {
			findxy('move', e)
		}, false);
		canvas.addEventListener("mousedown", function (e) {
			findxy('down', e)
		}, false);
		canvas.addEventListener("mouseup", function (e) {
			findxy('up', e)
		}, false);
		canvas.addEventListener("mouseout", function (e) {
			findxy('out', e)
		}, false);
    }

	function init() {
        // Try to get WebGL canvas
        if(!window.fx)
        {
            alert("Could not load glfx.js, Please check your internet connection!");
            return;
        }
        try {
            /* global fx */
            canvasfx = fx.canvas();
        } catch (e) {
            alert("Sorry, but this browser doesn\'t support WebGL.Please see http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation");
            return;
        }
        // disable transform at the start
        document.getElementById('Transform').style.pointerEvents = 'none';
        $("#Transform").addClass("disabled");

        // initialize tooltip
        $('[data-toggle="tooltip"]').tooltip();

        image = document.getElementById('image');
		canvas = document.getElementById('canvas2d');
		ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;
		addListeners(canvas);
	}

	function color(obj) {
		switch (obj.id) {
			case "green":
				x = "green";
				break;
			case "blue":
				x = "blue";
				break;
			case "red":
				x = "red";
				break;
			case "yellow":
				x = "yellow";
				break;
			case "orange":
				x = "orange";
				break;
			case "black":
				x = "black";
				break;
			case "white":
				x = "white";
				break;
		}
		if (x == "white") y = 14;
		else y = 4;
	}

	function draw() {
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.strokeStyle = x;
		ctx.lineWidth = y;
		ctx.stroke();
		ctx.closePath();
	}

    function drawEllipse(x1, y1, x2, y2) {
        var radiusX = (x2 - x1) * 0.5,
            radiusY = (y2 - y1) * 0.5,
            centerX = x1 + radiusX,
            centerY = y1 + radiusY,
            step = 0.01,
            a = step,
            pi2 = Math.PI * 2 - step;

        ctx.beginPath();
        ctx.moveTo(centerX + radiusX * Math.cos(0),
                   centerY + radiusY * Math.sin(0));

        for(; a < pi2; a += step) {
            ctx.lineTo(centerX + radiusX * Math.cos(a),
                       centerY + radiusY * Math.sin(a));
        }
        ctx.fill();
        ctx.closePath();
        ctx.strokeStyle = '#000';
        ctx.stroke();
    }

	function findxy(res, e) {
		if (res == 'down' && drawing == true) {
    		prevX = currX;
    		prevY = currY;
    		currX = e.layerX - canvas.offsetLeft;
    		currY = e.layerY - canvas.offsetTop;

    		flag = true;
    		dot_flag = true;
    		if(dot_flag) {
    			ctx.beginPath();
    			ctx.fillStyle = x;
    			ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;
            }
        }
        if (res == 'down' && drawingOval == true && transformStarted == false)
        {
            numOvalPoints ++;
            var tmpx = e.layerX - canvas.offsetLeft;
            var tmpy = e.layerY - canvas.offsetTop;
            ovalPoints.push(tmpx, tmpy);
            if(numOvalPoints == 4)
            {
                var minrangex = 99999;
                var maxrangex = 0;
                var minrangey = 99999;
                var maxrangey = 0;
                for(var i=0; i<ovalPoints.length; i+=2)
                {
                    if(ovalPoints[i] < minrangex)
                        minrangex = ovalPoints[i];
                    if(ovalPoints[i] > maxrangex)
                        maxrangex = ovalPoints[i];
                }
                for(i=1; i<ovalPoints.length; i+=2)
                {
                    if(ovalPoints[i] < minrangey)
                        minrangey = ovalPoints[i];
                    if(ovalPoints[i] > maxrangey)
                        maxrangey = ovalPoints[i];
                }
                ovalPoints = [];
                drawEllipse(minrangex, minrangey, maxrangex, maxrangey);
            }
        }
        if (res == 'up' || res == "out") {
    		flag = false;
    	}
    	if (res == "move") {
    		if(flag) {
    			prevX = currX;
    			prevY = currY;
    			currX = e.layerX - canvas.offsetLeft;
    			currY = e.layerY - canvas.offsetTop;
    			draw();
    		}
        }
	}
});
