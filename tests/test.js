// Test the tests

var should = require("users/aazuspan/should:test");

// should.run("pass")
// should.skip("pass")


should.equal(4, 4, "eq pass")
should.equal(ee.Number(4), 4, "eq pass EE")
should.notEqual(4, 5, "neq pass")
should.notEqual(ee.Number(4), 5, "neq pass EE")
should.beGreater(4, 3, "gt pass");
should.beGreater(4, ee.Number(3), "gt pass EE");
should.beGreaterOrEqual(4, 4, "gte pass");
should.beGreaterOrEqual(ee.Number(4), 4, "gte pass EE");
should.beLess(10, 13, "lt pass");
should.beLess(ee.Number(10), ee.Number(13), "lt pass EE");
should.beLessOrEqual(4, 4, "lte pass");
should.beLessOrEqual(4, ee.Number(4), "lte pass EE");

should.equal(4, 5, "eq fail")
should.equal(ee.Number(4), 5, "eq fail EE")
should.notEqual(4, 4, "neq fail")
should.notEqual(ee.Number(4), 4, "neq fail EE")
should.beGreater(4, 4, "gt fail");
should.beGreater(ee.Number(4), 4, "gt fail EE");
should.beGreaterOrEqual(4, 5, "gte fail");
should.beGreaterOrEqual(4, ee.Number(5), "gte fail EE");
should.beLess(1, -1, "lt fail");
should.beLess(1, ee.Number(-1), "lt fail EE");
should.beLessOrEqual(4, 3, "lte fail");
should.beLessOrEqual(4, ee.Number(3), "lte fail EE");


should.contain(["This", "That"], "This", "in array passes")
should.contain(["That"], "This", "in array fails")
should.contain(ee.List(["This", "That"]), "This", "in ee.List passes")
should.contain(ee.List(["That"]),"This", "in ee.List fails")


should.notContain(["That"], "This", "notIn array passes")
should.notContain(["This", "That"], "This", "notIn array fails")
should.notContain(ee.List(["That"]), "This", "notIn ee.List passes")
should.notContain(ee.List(["This", "That"]), "This", "notIn ee.List fails")


should.throw(function() {  }, "Throw fails")
should.throw(function() { throw new Error() }, "Throw passes")
should.notThrow(function() { ee.Image.size() }, "notThrow fails")
should.notThrow(function() {  }, "notThrow passes")