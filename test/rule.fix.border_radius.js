var inverter = require('../index');

describe('inverter.rules.fixLeftRight', function() {

  it('should correctly replace with only one part', function() {
    inverter.rules.fixBorderRadius('.test{border-radius:4px;}').should.be.equal('.test{border-radius:4px;}');
    inverter.rules.fixBorderRadius('.test{border-radius:3px 2px;}').should.be.equal('.test{border-radius:2px 3px;}');
    inverter.rules.fixBorderRadius('.test{border-radius:3px 2px 5px;}').should.be.equal('.test{border-radius:2px 3px 2px 5px;}');
    inverter.rules.fixBorderRadius('.test{border-radius:1px 2px 3px 4px;}').should.be.equal('.test{border-radius:2px 1px 4px 3px;}');
  });
  
  it('should correctly replace with two parts', function() {
    inverter.rules.fixBorderRadius('.test{border-radius:4px / 4px;}').should.be.equal('.test{border-radius:4px / 4px;}');
    inverter.rules.fixBorderRadius('.test{border-radius:3px 2px / 8px 9px;}').should.be.equal('.test{border-radius:2px 3px / 9px 8px;}');
    inverter.rules.fixBorderRadius('.test{border-radius:3px 2px 5px / 1px -4px 8px;}').should.be.equal('.test{border-radius:2px 3px 2px 5px / -4px 1px -4px 8px;}');
    inverter.rules.fixBorderRadius('.test{border-radius:1px 2px 3px 4px / 5px 6px 7px 8px;}').should.be.equal('.test{border-radius:2px 1px 4px 3px / 6px 5px 8px 7px;}');
  });
});