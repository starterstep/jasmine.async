// Jasmine.Async, v0.1.0
// Copyright (c)2012 Muted Solutions, LLC. All Rights Reserved.
// Distributed under MIT license
// http://github.com/derickbailey/jasmine.async
module.exports = (function(global){

  // Private Methods
  // ---------------
  
  function runAsync(block, timeout){
    return function(){
      var done = false;
      var complete = function(){ done = true; };

      runs(function(){
            try{
                block.call(this,complete);
            } catch ( error ){
                complete();
                throw error;
            }
      });

      waitsFor(function(){
        return done;
      }, null, timeout);
    };
  }

  // Constructor Function
  // --------------------

  function AsyncSpec(spec){
    this.spec = spec;
  }

  // Public API
  // ----------

  AsyncSpec.prototype.beforeEach = function(block){
    this.spec.beforeEach(runAsync(block));
  };

  AsyncSpec.prototype.afterEach = function(block){
    this.spec.afterEach(runAsync(block));
  };

  AsyncSpec.prototype.it = function(description, block, timeout){
    // For some reason, `it` is not attached to the current
    // test suite, so it has to be called from the global
    // context.
    global.it(description, runAsync(block, timeout));
  };

  return AsyncSpec;
})(this);