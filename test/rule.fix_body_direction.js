var inverter = require('../index');

describe('inverter.rules.fixLeftRight', function() {

  it('should correctly replace', function() {
    inverter.rules.fixBodyDirection('body{direction:ltr;}').should.be.equal('body{direction:rtl;}');
    inverter.rules.fixBodyDirection('body{direction:rtl;}').should.be.equal('body{direction:ltr;}');
  });
  
  it('should ignore other rules', function() {
    inverter.rules.fixBodyDirection('body{line-height:10p;direction:ltr;margin:0;}').should.be.equal('body{line-height:10p;direction:rtl;margin:0;}');
  });
  
  it('should not replace anywhere but in body', function() {
    inverter.rules.fixBodyDirection('.foo{direction:ltr;}').should.be.equal('.foo{direction:ltr;}');
    inverter.rules.fixBodyDirection('abody{direction:ltr;}').should.be.equal('abody{direction:ltr;}');
    inverter.rules.fixBodyDirection('.body{direction:ltr;}').should.be.equal('.body{direction:ltr;}');
  });
  
  it('should work with whitespaces', function() {
    inverter.rules.fixBodyDirection('body{ direction   \t\n : \tltr\n;}').should.be.equal('body{ direction   \t\n : \trtl\n;}');
  });
  
});