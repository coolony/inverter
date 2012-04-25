var inverter = require('../index');

describe('inverter.rules.fixFourPartNotation', function() {

  it('should correctly replace with only one part', function() {
    inverter.rules.fixFourPartNotation('.test{margin:1px 2px 3px 4px;}').should.be.equal('.test{margin:1px 4px 3px 2px;}');
  });
  
  it('should not interfere with border-radius', function() {
    inverter.rules.fixFourPartNotation('.test{border-radius:1px 2px 3px 4px;}').should.be.equal('.test{border-radius:1px 2px 3px 4px;}');
  });
  
  it('should work with whitespace', function() {
    inverter.rules.fixFourPartNotation('.test{ margin  \t\n : \n 1px  2px  3px   4px ;}').should.be.equal('.test{ margin  \t\n : \n 1px 4px 3px 2px ;}');
  });
  
});