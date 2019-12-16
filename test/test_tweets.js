// Tests

var expect = require('chai').expect;

describe('Test parse and extract hashtags function', function() {
  var tweets = require('../app/controllers/tweets.js');
  
  it('Expected behaivor: extract and store hashtags', function(done) {
    var testCase = '#bobo, #, n#, #, # 1, f, #a';
    var expectedResult = ['bobo','a'];

    var result = tweets.parseHashtag(testCase);

    expect(result).to.eql(expectedResult);
    done();
  });
  
  it('Expected behaivor: return empty array', function(done) {
    var testCase = 'python, go, ##';

    var result = tweets.parseHashtag(testCase);

    expect(result).to.eql([]);
    done();
  });

  it('Expected behaivor: return empty array', function(done) {
    var testCase = '';

    var result = tweets.parseHashtag(testCase);

    expect(result).to.eql([]);
    done();
  });

  it('Expected behaivor: return empty array', function(done) {
    var testCase = '## #';

    var result = tweets.parseHashtag(testCase);

    expect(result).to.eql([]);
    done();
  });
});