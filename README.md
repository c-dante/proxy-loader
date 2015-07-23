# mockpack (proxy-loader)
I really didn't like existing dependency injecting loaders and mocking when using AMD/CommonJS in a webpack environment.

Using [webpack](webpack.github.io) as a bundler with resolve loaders and plugins is great. Testing with that is less-great.

# Use
Really targeted toward webpack. Have the `proxy-loader` module installed, set up `moduleLoaders` if needed.
```
// Get the factory-wrapped module
var MyModuleFactory = require('proxy-loader!./my/module');

// Create instances of your module with overridden require statements
var myModuleMocked = MyModuleFactory({
  '../services/some/dep': mockDependency,
  '../services/some/other/dep': {
    otherDepFunction: function(){ return true; }
  }
});

// now myModuleMocked has overridden dependencies for '../services/some/dep' and '../services/some/other/dep'
```

[See the example](/example/entry.js)
Run the example with:
```
$> npm install
$> gulp compile
$> node ./bin/main.bundle.js
```

#### Existing proxy/mock/etc modules:
* [inject-loader](https://github.com/plasticine/inject-loader)
* [Squire.js](https://github.com/iammerrick/Squire.js/)
* [proxyquire](https://github.com/thlorenz/proxyquire)

## Isn't this exactly like inject-loader?
Yes. Except webpack makes a new dependency and module for each loader string. That means each of the following are completely new dependencies:
```
var mockA = require('inject!./myModule');
var mockB = require('inject?lib/something!./myModule');
var mockC = require('inject?-lib/something!./myModule');
```

I also did not like having to specify what I'll be mocking at require time. For unit tests, I prefer:
```
var ProxyFactory = require('proxy!./module/under/test');

it('Should test some things', function()
{
  var mock = ProxyFactory({
  // override only some things
  });
  
  // use mock
});

it('Should test some different things', function()
{
  var mock = ProxyFactory({
  // override different things
  });
  
  // use mock
});
```

## Methodology
1. Use [webpack](webpack.github.io) to compile the application together.
2. For unit testing, wrap modules to mock in `proxy-loader`. This is similar to the [inject-loader](https://github.com/plasticine/inject-loader).
3. Use the returned proxy loader function to mock any dependencies and return the mocked module.

This is almost the exact same process as [inject-loader](https://github.com/plasticine/inject-loader), but instead of forcing you to pick which modules get injected at requrie time, you get a function that can mock dependencies whenever.
