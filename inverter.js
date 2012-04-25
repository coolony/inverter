/*!
 * Coolony Inverter
 * Copyright(c) 2011 Pierre Matri <pierre.matri@coolony.com>
 * MIT Licensed
 */
 
var module = module || {};
module.exports = module.exports || {};


/*
 * RegExps
 */
 
var REGEXP_FLAGS = 'g'
  , LOOKAHEAD_LETTER = '([A-Za-z])?'
  , LOOKAHEAD_OPENING_PAREN = '(\\([^\\(\\):]*)?'
  , LOOKAHEAD_LETTER_OR_OPENING_PAREN = '((?:\\([^\\(\\):]*)?(?:[A_Za-z])?)?'
  , LOOKAHEAD_NOT_WHITESPACE_OR_CLOSING_BRACE = '([^\\s\\}])?'
  , LOOKBEHIND_NOT_CLOSING_PAREN = '(?![^\\)\\(]*\\))'
  , LOOKBEHIND_NOT_OPENING_BRACE = '(?![^\\{\\}]*\\{)'
  , UNITS = '(?:%|in|cm|mm|em|ex|pt|pc|px)'
  , POSSIBLY_NEGATIVE_QUANTITY = '(\\-?[0-9]+' + UNITS + '?)'
  , POSSIBLY_NEGATIVE_QUANTITY_SPACE = '[\\s]+' + POSSIBLY_NEGATIVE_QUANTITY
  , BODY_DIRECTION_RE = new RegExp(LOOKAHEAD_NOT_WHITESPACE_OR_CLOSING_BRACE
                                     + 'body[\\s]*\\{[^\\}]*direction[\\s]*:[\\s]*(ltr|rtl)'
                                   , REGEXP_FLAGS)
  , GRADIENT_RE = new RegExp('-gradient[\\s]*\\((' 
                               + '[^\\)]+'
                               + ')\\)'
                               + LOOKBEHIND_NOT_CLOSING_PAREN
                               + LOOKBEHIND_NOT_OPENING_BRACE
                             , REGEXP_FLAGS) // Stops at the first closing paren, which can be in the middle of the gradient definition
                                             // im case of nested parentheses. What we want to replace is before anyway. So it doesn't
                                             // matter.
  , GRADIENT_REPLACE_RE = new RegExp(LOOKAHEAD_LETTER + '(left|right|(?:\\-?\\d{1,3}deg))', REGEXP_FLAGS)
  , FOUR_PART_NOTATION_RE = new RegExp('([A-Za-z-]+)([\\s]*):([\\s]*)' 
                                         + POSSIBLY_NEGATIVE_QUANTITY
                                         + POSSIBLY_NEGATIVE_QUANTITY_SPACE
                                         + POSSIBLY_NEGATIVE_QUANTITY_SPACE
                                         + POSSIBLY_NEGATIVE_QUANTITY_SPACE
                                         + LOOKBEHIND_NOT_CLOSING_PAREN
                                         + LOOKBEHIND_NOT_OPENING_BRACE
                                       , REGEXP_FLAGS)
  , BORDER_RADIUS_RE = new RegExp('border-radius([\\s]*):([\\s]*)' 
                                    + POSSIBLY_NEGATIVE_QUANTITY
                                    + '(?:' + POSSIBLY_NEGATIVE_QUANTITY_SPACE + ')?'
                                    + '(?:' + POSSIBLY_NEGATIVE_QUANTITY_SPACE + ')?'
                                    + '(?:' + POSSIBLY_NEGATIVE_QUANTITY_SPACE + ')?'
                                    + '([\\s]+/[\\s]+'
                                    + POSSIBLY_NEGATIVE_QUANTITY
                                    + '(?:' + POSSIBLY_NEGATIVE_QUANTITY_SPACE + ')?'
                                    + '(?:' + POSSIBLY_NEGATIVE_QUANTITY_SPACE + ')?'
                                    + '(?:' + POSSIBLY_NEGATIVE_QUANTITY_SPACE + ')?'
                                    + ')?'
                                    + LOOKBEHIND_NOT_CLOSING_PAREN
                                    + LOOKBEHIND_NOT_OPENING_BRACE
                                  , REGEXP_FLAGS)
  , LEFT_RIGHT_RE = new RegExp(LOOKAHEAD_LETTER_OR_OPENING_PAREN + '(left|right)'
                                 + LOOKBEHIND_NOT_CLOSING_PAREN
                                 + LOOKBEHIND_NOT_OPENING_BRACE
                               , REGEXP_FLAGS)
  , CURSOR_RE = new RegExp('cursor[\\s]*:[\\s]*(?:n|s)?((e|w)-resize)'
                             + LOOKBEHIND_NOT_CLOSING_PAREN
                             + LOOKBEHIND_NOT_OPENING_BRACE
                           , REGEXP_FLAGS)
  , URL_BASE_RE = LOOKAHEAD_LETTER + 'url[\\s]*\\((?:(?:[^\\)]*[^A-Za-z0-9])|(?:[\\s]*))'
  , URL_LTR_RTL_RE = new RegExp(URL_BASE_RE
                                  + '(rtl|ltr)'
                                  + '[^A-Za-z0-9]'
                                , REGEXP_FLAGS)
  , URL_LEFT_RIGHT_RE = new RegExp(URL_BASE_RE
                                     + '(left|right)'
                                     + '[^A-Za-z0-9]'
                                   , REGEXP_FLAGS);


/*
 * CSS transformation rules
 */
 
var rules = module.exports.rules = {

  // Change `direction: ltr` to `direction: rtl` and the opposite, only in body
  fixBodyDirection: function(str){
    return str.replace(BODY_DIRECTION_RE, function($0, $1, $2){
      return $1 ?
        $0 :
        ($0.slice(0, -3) + ($2 == 'ltr' ? 'rtl' : 'ltr'));
    })
  },
  
  // Transform `left` to `right` and the opposite, except for ids, classes, and inside urls
  fixLeftRight: function(str){
    return str.replace(LEFT_RIGHT_RE, function($0, $1, $2){
      return $1 ?
        $0 :
        ($2 == 'right') ?
          'left' :
          'right'
    });
  },
  
  // Changes, for example, `cursor: nw-resize` to `cursor: ne-resize`
  fixCursor: function(str){
    return str.replace(CURSOR_RE, function($0, $1, $2){
      return $0.slice(0, -$1.length) + ($2 == 'w' ? 'e' : 'w') + '-resize';
    });
  },
  
  // Fixes border radius
  // This case is special because of the particularities of border-radius
  fixBorderRadius: function(str){
    return str.replace(BORDER_RADIUS_RE, 
      function(){
        var ret = 'border-radius' + arguments[1]
                                  + ':'
                                  + arguments[2]
                                  + reorderBorderRadius(arguments[3],
                                                        arguments[4],
                                                        arguments[5],
                                                        arguments[6]);
        if(arguments[7])
          ret += ' / ' + reorderBorderRadius(arguments[8],
                                             arguments[9],
                                             arguments[10],
                                             arguments[11]);
                                             
        return ret;
      }
    );
  },
  
  // Fixes four part notation, for example `border: 1px 2px 3px 4px` will be rewritten to `border: 1px 4px 3px 2px`
  fixFourPartNotation: function(str){
    return str.replace(FOUR_PART_NOTATION_RE, 
      function(){
        if(arguments[1] == 'border-radius') return arguments[0]
        return arguments[1] + arguments[2] + ':' + arguments[3]
                            + [arguments[4], arguments[7], arguments[6], arguments[5]].join(' ');
      }
    );
  },
  
  // Fixes gradients
  fixGradient: function(str){
    return str.replace(GRADIENT_RE, fixGradient);
  },
  
  // Fix LTR/RTL in URLs
  fixUrlLtrRtl: function(str){
    return str.replace(URL_LTR_RTL_RE, function(){
      if(arguments[1]) return arguments[0];
      return arguments[0].substr(0, arguments[0].length - 4)
               + (arguments[2] == 'ltr' ? 'rtl' : 'ltr')
               + arguments[0].slice(-1);
    });
  },
  
  // Fix left/right in URLs
  fixUrlLeftRight: function(str){
    return str.replace(URL_LEFT_RIGHT_RE, function(){
      if(arguments[1]) return arguments[0];
      return arguments[0].substr(0, arguments[0].length - arguments[2].length - 1)
               + (arguments[2] == 'left' ? 'right' : 'left')
               + arguments[0].slice(-1);
    });
  }
  
}


/**
 * Inverts a CSS string
 *
 * @param {String} str CSS string
 * @param {Object} options (Optional)
 * @return {String} Inverted CSS
 * @api public
 */
 
function invert(str, options){

  if(!options) options = {};
  if(!options.exclude) options.exclude = [];
  
  for(var rule in rules) {
  
    // Pass excluded rules
    if(options.exclude.indexOf(rule) != -1) continue;
    
    // Run rule
    str = rules[rule](str, options);
    
  }
  
  return str;

}


/**
 * Reorders border radius values for opposite direction
 * 
 * reorderBorderRadius(A, B, C, D) -> 'B A D C'
 * reorderBorderRadius(A, B, C) -> 'B A B C'
 * reorderBorderRadius(A, B) -> 'B A'
 * reorderBorderRadius(A) -> 'A'
 *
 * @param {String} p1 First element
 * @param {String} p2 (Optional) Second element
 * @param {String} p3 (Optional) Third element
 * @param {String} p4 (Optional) Fourth element
 * @return {String} Result
 * @api private
 */
 
function reorderBorderRadius(p1, p2, p3, p4){
  if(p4)
    return [p2, p1, p4, p3].join(' ');
  if(p3)
    return [p2, p1, p2, p3].join(' ');
  if(p2)
    return [p2, p1].join(' ');
  else
    return p1;
}


/**
 * Fixes most gradient definitions
 *
 * Replaces `left` with `right`, `X(X(X))deg` to `-X(X(X))deg`, and the opposites
 *
 * fixGradient("-webkit-gradient(linear, left bottom, right top, color-stop(0%,#000), color-stop(100%,#fff))")
 *   -> "fixGradient("-webkit-gradient(linear, right bottom, left top, color-stop(0%,#000), color-stop(100%,#fff))")"
 * fixGradient("background: linear-gradient(45deg, #000 0%, #fff 100%)")
 *   -> "linear-gradient(-45deg, #000 0%,#fff 100%)"
 */
 
function fixGradient(str) {
  var ret = str.replace(GRADIENT_REPLACE_RE, function($0, $1, $2){
    return $1 ?
      $0 :
      ($2 == 'right') ?
        'left' :
        ($2 == 'left') ?
          'right' :
          (parseInt($2) % 180 == 0) ?
            $2 :
            ($2.substr(0,1) == '-') ?
              $2.substr(1) :
              ('-' + $2);
    });
  return ret;
}


/**
 * Module exports
 */
module.exports.invert = invert;