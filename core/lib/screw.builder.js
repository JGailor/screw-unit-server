var Screw = (function(jQuery) {
  var screw = {
    Unit: function(fn) {
      var contents = fn.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1];
      var fn = new Function("matchers", "specifications",
        "with (specifications) { with (matchers) { " + contents + " } }"
      );

      jQuery(Screw).queue(function() {
        Screw.Specifications.context.push(jQuery('body > .describe'));
        fn.call(this, Screw.Matchers, Screw.Specifications);
        Screw.Specifications.context.pop();
        jQuery(this).dequeue();
      });
    },

    Specifications: {
      context: [],

      describe: function(name, fn) {
        var describe = jQuery('<li class="describe" />')
          .append(jQuery('<h1 />').text(name))
          .append('<ol class="befores" />')
          .append('<ul class="its" />')
          .append('<ul class="describes" />')
          .append('<ol class="afters" />');

        this.context.push(describe);
        fn.call();
        this.context.pop();

        this.context[this.context.length-1]
          .children('.describes')
            .append(describe);
      },

      it: function(name, fn) {
        var it = jQuery('<li class="it" />')
          .append(jQuery('<h2 />').text(name))
          .data('screwunit.run', fn);

        this.context[this.context.length-1]
          .children('.its')
            .append(it);
      },

      before: function(fn) {
        var before = jQuery('<li class="before" />')
          .data('screwunit.run', fn);

        this.context[this.context.length-1]
          .children('.befores')
            .append(before);
      },

      after: function(fn) {
        var after = jQuery('<li class="after" />')
          .data('screwunit.run', fn);

        this.context[this.context.length-1]
          .children('.afters')
            .append(after);
      }
    }
  };

  jQuery(screw).queue(function() { jQuery(screw).trigger('loading') });
  jQuery(function() {
    jQuery('<div class="describe" />')
      .append('<h3 class="status" />')
      .append('<ol class="befores" />')
      .append('<ul class="describes" />')
      .append('<ol class="afters" />')
      .appendTo('body');

    jQuery(screw).dequeue();
    jQuery(screw).trigger('loaded');
  });
  return screw;
})(jQuery);