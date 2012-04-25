var inverter = require('../index');

describe('inverter.rules.fixLeftRight', function() {

  it('should correctly replace with only one part', function() {
    inverter.rules.fixGradient('.test{background: -moz-linear-gradient(-45deg, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);}').should.be.equal('.test{background: -moz-linear-gradient(45deg, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);}');
    
    inverter.rules.fixGradient('.test{background: -webkit-gradient(linear, left top, right bottom, color-stop(10%,#7db9e8), color-stop(22%,#207cca), color-stop(23%,#2989d8), color-stop(100%,#1e5799));}').should.be.equal('.test{background: -webkit-gradient(linear, right top, left bottom, color-stop(10%,#7db9e8), color-stop(22%,#207cca), color-stop(23%,#2989d8), color-stop(100%,#1e5799));}');
    
    inverter.rules.fixGradient('.test{background: linear-gradient(270deg, #000 0%, #fff 100%)}').should.be.equal('.test{background: linear-gradient(-270deg, #000 0%, #fff 100%)}');
  });
  
  it('should not touch vertical gradients', function() {
    inverter.rules.fixGradient('.test{background: -moz-linear-gradient(180deg, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);}').should.be.equal('.test{background: -moz-linear-gradient(180deg, #1e5799 0%, #2989d8 50%, #207cca 51%, #7db9e8 100%);}');
    
    inverter.rules.fixGradient('.test{background: -webkit-gradient(linear, top, bottom, color-stop(10%,#7db9e8), color-stop(22%,#207cca), color-stop(23%,#2989d8), color-stop(100%,#1e5799));}').should.be.equal('.test{background: -webkit-gradient(linear, top, bottom, color-stop(10%,#7db9e8), color-stop(22%,#207cca), color-stop(23%,#2989d8), color-stop(100%,#1e5799));}');
    
    inverter.rules.fixGradient('.test{background: linear-gradient(top, #000 0%, #fff 100%)}').should.be.equal('.test{background: linear-gradient(top, #000 0%, #fff 100%)}');
  });
  
});