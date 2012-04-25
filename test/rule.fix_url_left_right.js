var inverter = require('../index');

describe('inverter.rules.fixUrlLeftRight', function() {

  it('should work correctly', function() {
    inverter.rules.fixUrlLeftRight('.foo{background:url("left.png")}').should.be.equal('.foo{background:url("right.png")}');
    inverter.rules.fixUrlLeftRight('.foo{background:url(right.png)}').should.be.equal('.foo{background:url(left.png)}');
    inverter.rules.fixUrlLeftRight('.foo{background:url(bright-left.png)}').should.be.equal('.foo{background:url(bright-right.png)}');
    inverter.rules.fixUrlLeftRight('.foo{background:url(foo.left.png)}').should.be.equal('.foo{background:url(foo.right.png)}');
  });
  
  it('should ignore non-standalone left / right', function() {
    inverter.rules.fixUrlLeftRight('.foo{background:url("bright.png")}').should.be.equal('.foo{background:url("bright.png")}');
    inverter.rules.fixUrlLeftRight('.foo{background:url(righten.png)}').should.be.equal('.foo{background:url(righten.png)}');
  });
  
});