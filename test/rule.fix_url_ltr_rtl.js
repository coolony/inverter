var inverter = require('../index');

describe('inverter.rules.fixUrlLtrRtl', function() {

  it('should work correctly', function() {
    inverter.rules.fixUrlLtrRtl('.foo{background:url("rtl.png")}').should.be.equal('.foo{background:url("ltr.png")}');
    inverter.rules.fixUrlLtrRtl('.foo{background:url(rtl.png)}').should.be.equal('.foo{background:url(ltr.png)}');
    inverter.rules.fixUrlLtrRtl('.foo{background:url(foo-rtl.png)}').should.be.equal('.foo{background:url(foo-ltr.png)}');
    inverter.rules.fixUrlLtrRtl('.foo{background:url(foo.rtl.png)}').should.be.equal('.foo{background:url(foo.ltr.png)}');
  });
  
  it('should ignore non-standalone rtl / ltr', function() {
    inverter.rules.fixUrlLtrRtl('.foo{background:url("rtla.png")}').should.be.equal('.foo{background:url("rtla.png")}');
    inverter.rules.fixUrlLtrRtl('.foo{background:url(foortl.png)}').should.be.equal('.foo{background:url(foortl.png)}');
  });
  
});