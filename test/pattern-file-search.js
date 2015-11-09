var recursiveFileList = require('..')
var expect = require('chai').expect
describe("pattern file search", function() {
  it("makes a list of files, ignoring vendor", function(done) {
    recursiveFileList(__dirname + '/fixtures', null, [/^\./,/node_modules/,/vendor/], function(err, list) {
      ;[
        __dirname + '/fixtures/file4.txt',
        __dirname + '/fixtures/dir1/file1.js',
        __dirname + '/fixtures/dir1/file3.txt',
      ].forEach(function(path) {
        expect(list.indexOf(path)).not.to.equal(-1)
      })

      ;[
        __dirname + '/fixtures/vendor/file5.txt',
        __dirname + '/fixtures/dir1/node_modules/file2.js',
        __dirname + '/fixtures/.hiddenfile',
      ].forEach(function(path) {
        expect(list.indexOf(path)).to.equal(-1)
      })
      done()
    })
  })

  it("filters files based on a pattern", function(done) {
    recursiveFileList(__dirname + '/fixtures', /\.js$/, function(err, list) {
      ;[
        __dirname + '/fixtures/dir1/file1.js',
      ].forEach(function(path) {
        expect(list.indexOf(path)).not.to.equal(-1)
      })

      ;[
        __dirname + '/fixtures/file4.txt',
        __dirname + '/fixtures/dir1/file3.txt',
      ].forEach(function(path) {
        expect(list.indexOf(path)).to.equal(-1)
      })

      done()
    })
  })

  it("fails on a bad directory", function(done) {
    recursiveFileList(__dirname + '/fixtures/this-dir-does-not-exist', function(err, list) {
      expect(list).not.to.be.ok
      expect(err.code).to.equal('ENOENT')
      done()
    })
  })

})
