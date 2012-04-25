var inverter = require('../index');

describe('inverter.rules.fixCursor', function() {

  it('should correctly replace', function() {
    inverter.rules.fixCursor('body{cursor:nw-resize;}').should.be.equal('body{cursor:ne-resize;}');
    inverter.rules.fixCursor('body{cursor:ne-resize;}').should.be.equal('body{cursor:nw-resize;}');
    inverter.rules.fixCursor('body{cursor:e-resize;}').should.be.equal('body{cursor:w-resize;}');
    inverter.rules.fixCursor('body{cursor:w-resize;}').should.be.equal('body{cursor:e-resize;}');
  });
  
  it('should ignore other rules', function() {
    inverter.rules.fixCursor('body{color:red;cursor:nw-resize;border:0;}').should.be.equal('body{color:red;cursor:ne-resize;border:0;}');
  });
  
  it('should work with whitespaces', function() {
    inverter.rules.fixCursor('body{   \t\n cursor\t   \n\n :\n\t \tnw-resize  \t\n;}').should.be.equal('body{   \t\n cursor\t   \n\n :\n\t \tne-resize  \t\n;}');
  });
  
});