var inverter = require('../index');

describe('inverter.rules.fixLeftRight', function() {

  it('should correctly replace', function() {
    inverter.rules.fixLeftRight('.test{margin-left:10px;}').should.be.equal('.test{margin-right:10px;}');
    inverter.rules.fixLeftRight('.test{padding-right:10px;}').should.be.equal('.test{padding-left:10px;}');
    inverter.rules.fixLeftRight('.test{padding-right:10px;margin-left:10px;}').should.be.equal('.test{padding-left:10px;margin-right:10px;}');
    inverter.rules.fixLeftRight('.test{float:left;}').should.be.equal('.test{float:right;}');
  });
  
  it('should ignore other rules', function() {
    inverter.rules.fixLeftRight('.test{margin-left:10px;border:0;}').should.be.equal('.test{margin-right:10px;border:0;}');
  });
  
  it('should ignore left / right prepended by some letter', function() {
    inverter.rules.fixLeftRight('.test{margin-aleft:10px;}').should.be.equal('.test{margin-aleft:10px;}');
  });
  
  it('should ignore left / right in class definitions', function() {
    inverter.rules.fixLeftRight('.foo-left{}#left{}.left{}').should.be.equal('.foo-left{}#left{}.left{}');
  });
  
  it('should ignore left / right in URL definition', function() {
    inverter.rules.fixLeftRight('.foo{background:url("bright.png")}').should.be.equal('.foo{background:url("bright.png")}');
    inverter.rules.fixLeftRight('.foo{background:url("left.png")}').should.be.equal('.foo{background:url("left.png")}');
  });
  
});