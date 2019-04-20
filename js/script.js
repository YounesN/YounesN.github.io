(function ($) {
  // writes the string
  //
  // @param jQuery $target
  // @param String str
  // @param Numeric cursor
  // @param Numeric delay
  // @param Function cb
  // @return void
  function typeString($target, str, cursor, delay, cb) {
    $target.html(function (_, html) {
      return html + str[cursor];
    });

    if (cursor < str.length - 1) {
      setTimeout(function () {
      typeString($target, str, cursor + 1, delay, cb);
      }, delay);
    }
    else {
      cb();
    }
  }

  // clears the string
  //
  // @param jQuery $target
  // @param Numeric delay
  // @param Function cb
  // @return void
  function deleteString($target, delay, cb) {
    var length;

    $target.html(function (_, html) {
      length = html.length;
      return html.substr(0, length - 1);
    });

    if (length > 1) {
      setTimeout(function () {
        deleteString($target, delay, cb);
      }, delay);
    }
    else {
      cb();
    }
  }

    // jQuery hook
  $.fn.extend({
    teletype: function (opts) {
      var settings = $.extend({}, $.teletype.defaults, opts);

      return $(this).each(function () {
        (function loop($tar, idx) {
          // type
          typeString($tar, settings.text[idx], 0, settings.delay, function () {
            // delete
            setTimeout(function () {
              deleteString($tar, settings.delay, function () {
                loop($tar, (idx + 1) % settings.text.length);
              });
            }, settings.pause);
          });
        }($(this), 0));
      });
    }
  });

    // plugin defaults  
  $.extend({
    teletype: {
      defaults: {
        delay: 100,
        pause: 2000,
        text: []
      }
    }
  });
}(jQuery));



$( document ).ready(function() {
  $('#cursor').teletype({
    text: ['_', ' '],
    delay: 0,
    pause: 500
  });

  $('#changing-text').teletype({
    text: [
      'software developer,',
      'collaborative worker,',
      'tea drinker,',
      'noun verber.'
    ]
  });

  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });

  var skills = {"C/C++": 95, "CUDA": 90, "Python": 90, "PHP": 85, "Javascript": 80,
    "OpenMP": 70, "MPI":70};
  var tools = {"Git": 95, "VS Code": 95, "Jupyter": 85, "Grace": 85, "CLion": 80,
    "SVN": 70, "Visual Studio": 70, "Code::Blocks": 65, "NVIDIA Nsight": 65};

  jQuery.each(skills, function(i, val) {
    var el = $("#skills");
    el.html(el.html() + fillSkill(i, val));
  });

  jQuery.each(tools, function(i, val) {
    var el = $("#tools");
    el.html(el.html() + fillSkill(i, val));
  });

  function fillSkill(skill, percent) {
    var str = "<div class=\"col-sm-2\"><h4>";
    str += skill;
    str += "</h4></div><div class=\"col-sm-4\"><div class=\"progress custom-progress\">";
    str += "<div class=\"progress-bar progress-bar-striped bg-success\" role=\"progressbar\" style=\"width: ";
    str += percent;
    str += "%\" aria-valuenow=\"";
    str += percent;
    str += "\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div></div></div>";
    return str;
  }
});