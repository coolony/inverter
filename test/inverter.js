var inverter = require('../index')
  , fs = require('fs')
  , css_ltr = __dirname + '/fixtures/the_original.ltr.css'
  , css_rtl = __dirname + '/fixtures/the_original.rtl.css'
  , css_rtl_nogradient = __dirname + '/fixtures/the_original.rtl.nogradient.css';

describe('inverter', function() {

  var css_rtl_contents = fs.readFileSync(css_rtl).toString()
    , css_rtl_nogradient_contents = fs.readFileSync(css_rtl_nogradient).toString()
    , css_ltr_contents = fs.readFileSync(css_ltr).toString();

  it('should work correctly', function() {
    inverter.invert(css_ltr_contents).should.equal(css_rtl_contents);
  });
  
  it('should correctly ignore blacklisted fixes', function() {
    inverter.invert(css_ltr_contents, {exclude:['fixGradient']}).should.equal(css_rtl_nogradient_contents);
  });
  
});