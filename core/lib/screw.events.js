(function(jQuery) {
  jQuery(Screw)
    .bind('loaded', function() {    
      jQuery('.describe, .it')
        .click(function() {
          document.location = location.href.split('?')[0] + '?' + jQuery(this).fn('selector');
          return false;
        })
        .focus(function() {
          return jQuery(this).addClass('focused');
        })
        .bind('scroll', function() {
          document.body.scrollTop = jQuery(this).offset().top;
        });

      jQuery('.it')
        .bind('enqueued', function() {
          jQuery(this).addClass('enqueued');
        })
        .bind('running', function() {
          jQuery(this).addClass('running');
        })
        .bind('passed', function() {
          jQuery(this).addClass('passed');
        })
        .bind('failed', function(e, reason) {
          jQuery(this)
            .addClass('failed')
            .append(jQuery('<p class="error" />').text(reason.toString()))

          var file = reason.fileName || reason.sourceURL;
          var line = reason.lineNumber || reason.line;          
          if (file || line) {
            jQuery(this).append(jQuery('<p class="error" />').text('line ' + line + ', ' + file));
          }
        })
    })
    .bind('before', function() {
      jQuery('.status').text('Running...');
    })
    .bind('after', function() {
      jQuery('.status').fn('display')
    })
})(jQuery);