(function(jQuery) {
  jQuery(Screw).bind('loaded', function() {
    jQuery('.status').fn({
      display: function() {
        jQuery(this).text(
          jQuery('.passed').length + jQuery('.failed').length + ' test(s), ' + jQuery('.failed').length + ' failure(s)'
        );
      }
    });

		jQuery('body > .describe > .describes > .describe').fn({
			total_children: function() {
				return jQuery(this).find(".it").length;
			},
			
			total_passed: function() {
				return jQuery(this).find(".it.passed").length;
			},
			
			run_cleanup: function() {			
				if(jQuery(this).fn("total_children")  == jQuery(this).fn("total_passed")) {
					jQuery(this).children(".its").hide();
				}
			}			
		});

    jQuery('.describe').fn({
      parent: function() {
        return jQuery(this).parent('.describes').parent('.describe');
      },
      
      run_befores: function(name) {
        jQuery(this).fn('parent').fn('run_befores', name);
        jQuery(this).children('.befores').children('.before').fn('run', name);
      },
      
      run_afters: function(name) {
        jQuery(this).fn('parent').fn('run_afters', name);
        jQuery(this).children('.afters').children('.after').fn('run', name);
      },
      
      enqueue: function() {
        jQuery(this).children('.its').children('.it').fn('enqueue');
        jQuery(this).children('.describes').children('.describe').fn('enqueue');
      },
      
      selector: function() {
        return jQuery(this).fn('parent').fn('selector')
          + ' > .describes > .describe:eq(' + jQuery(this).parent('.describes').children('.describe').index(this) + ')';
      }
    });
  
    jQuery('body > .describe').fn({
      selector: function() { return 'body > .describe' }
    });
    
    jQuery('.it').fn({
      parent: function() {
        return jQuery(this).parent('.its').parent('.describe');
      },
      
      run: function() {
				var name = jQuery(this).find("h2").text();
        try {
          try {
            jQuery(this).fn('parent').fn('run_befores', name);
            jQuery(this).data('screwunit.run')();
          } finally {
            jQuery(this).fn('parent').fn('run_afters', name);
          }
          jQuery(this).trigger('passed');
        } catch(e) {
          jQuery(this).trigger('failed', [e]);
        }

				jQuery(this).parents('.focused').fn('run_cleanup');
      },
      
      enqueue: function() {
        var self = jQuery(this).trigger('enqueued');
        jQuery(Screw)
          .queue(function() {
            self.fn('run');
            setTimeout(function() { jQuery(Screw).dequeue() }, 0);
          });
      },
      
      selector: function() {
        return jQuery(this).fn('parent').fn('selector')
          + ' > .its > .it:eq(' + jQuery(this).parent('.its').children('.it').index(this) + ')';
      }
    });
    
    jQuery('.before').fn({
      run: function(name) { jQuery(this).data('screwunit.run')(name) }
    }); 
  
    jQuery('.after').fn({
      run: function(name) { jQuery(this).data('screwunit.run')(name) }
    });

    jQuery(Screw).trigger('before');
    var to_run = unescape(location.search.slice(1)) || 'body > .describe > .describes > .describe';
    jQuery(to_run)
      .focus()
      .eq(0).trigger('scroll').end()
      .fn('enqueue');
    jQuery(Screw).queue(function() { jQuery(Screw).trigger('after') });
  })
})(jQuery);
