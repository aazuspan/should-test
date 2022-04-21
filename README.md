# should:test

- ☑️ Write one-line unit tests in the [Google Earth Engine](https://earthengine.google.com/) code editor
- ⚙️ Evaluate client or server-side objects asynchronously

## Quickstart

First, import the `should:test` module into your script.

```javascript
var should = require("users/aazuspan/should:test");
```

Then write your first test.

```javascript
should.equal(ee.Number(42), 42, "Check numbers are equal");
```

Hit `run` and the test will evaluate and let you know if it passed ✅ or failed 🛑. Write more tests and `should:test` will run them and summarize the results, printing out any errors that occur.

## Usage

### Server and Client Objects

Tests in `should:test` work transparently with client- and server-side objects. For example, both of the following work:

```javascript
var year = 2022;
should.beGreater(year, 2010);
```

```javascript
var year = ee.Image("LANDSAT/LC09/C02/T1_L2/LC09_001006_20220404").date().get("year");
should.beGreater(year, 2010);
```

Tests with Earth Engine objects run asynchronously and report their results when finished, so there's no risk of freezing the browser with `getInfo`.

### Filtering Tests
By default, all the tests you've called will evaluate when you run your script. To filter tests that run, call `should.settings.skip` and/or `should.settings.run` at the top of your script. These functions match a regular expression pattern against the test descriptions and skip or run accordingly.

```javascript
should.settings.run("band");

should.contain(image.bandNames(), "SR_B4", "check for band"); // run
should.beLess(collection.size(), 100, "compare size"); // skipped
```

### Writing Complex Tests
In order to run each test, the `should` assertion needs to be called. For organization, you can combine the assertion and any setup steps needed into a function and call that function, like so:

```javascript
// Build the test
var myTest = function() {
    var l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2");
    var geom = ee.Geometry.Point([-112.690234375, 41.13290902574011]);
    var col = l9.filterBounds(geom);
    var cloudless = col.filter(ee.Filter.lt("CLOUD_COVER", 1));

    should.beGreater(cloudless.size(), 100, "check # of cloud-free images");
};

// Run the test
myTest();
```

For convenience, you can skip naming and calling your test function using `should.utils.call`, like so:

```javascript
// Build and run the test
should.utils.call(function() {
    var l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2");
    var geom = ee.Geometry.Point([-112.690234375, 41.13290902574011]);
    var col = l9.filterBounds(geom);
    var cloudless = col.filter(ee.Filter.lt("CLOUD_COVER", 1));

    should.beGreater(cloudless.size(), 100, "check # of cloud-free images");
});
```

