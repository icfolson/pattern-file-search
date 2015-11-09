# Pattern File Search

![Travis CI Status](https://travis-ci.org/icfolson/pattern-file-search.svg?branch=master)

Recursively searches a directory for files matching a pattern, optionally
ignoring a pattern.

## FAQ

### Why would I use this instead of jergason/recursive-read-dir

1. We have inclusive pattern matching. Use this to do things like "find all the
javascript files in this directory"
2. Our comments don't say ["woop woop"](https://github.com/jergason/recursive-readdir/blob/master/index.js#L36), like a Juggalo
3. We have a depencency on caolan/async, so your build will be more robust
(read: larger, bloated)

### What exactly do the patterns match?

The include pattern matches only the filename. The exclude pattern matches the
filename, or any directory in the path (but only one path segment at a time).

## Usage

    // List everything
    var fileList = require('pattern-file-search')
    fileList('/some/base/directory', function(err, list) {
    	// boom
    })

    // List everything matching pattern
    fileList('/some/base/directory', /pattern.to.match/, function(err, list) {
    	// boom
    })

    // Exclude files matching pattern
    fileList('/some/base/directory', /pattern.to.match/, /pattern.to.exclude/, function(err, list) {
    	// boom
    })
