var async = require('async')
  , fs    = require('fs')
  , path  = require('path')

function matchAnyPattern(patterns, string) {
  if (!Array.isArray(patterns)) {
    patterns = [patterns]
  }

  for (var i = 0, len = patterns.length; i < len; ++i) {
    if (patterns[i].test(string)) {
      return true
    }
  }
}

module.exports = function(dir, /* optional */ pattern, /* optional */ excludePattern, cb) {
  // pattern, excludepattern are optional
  if (!cb && !excludePattern) {
    cb = pattern
    pattern = void 0
  } else if (!cb) {
    cb = excludePattern
    excludePattern = void 0
  }

  // list files in provided directory
  fs.readdir(dir, function(err, files) {
    var outputFiles = []
    if (err) {
      if (err.code === 'ENOTDIR') {
        files = ['']
      } else {
        cb(err)
        return
      }
    }
    var dirs = []

    // exclude excludePattern
    if (excludePattern) {
      files = files.filter(function(file) {
        return !matchAnyPattern(excludePattern, file)
      })
    }

    files = files.map(function(file) {
      return path.join(dir, file)
    })
      
    async.map(files, fs.stat, function(err, results) {
      // Figure out which ones are directores that we need to recurse into
      files.forEach(function(file, i) {
        if (results[i].isDirectory()) {
          dirs.push(file)
        } else {
          outputFiles.push(file)
        }
      })

      // match pattern
      if (pattern) {
        outputFiles = outputFiles.filter(function(file) {
          return matchAnyPattern(pattern, path.basename(file))
        })
      }

      // Recurse
      if (dirs.length) {
        async.parallel(dirs.map(function(dir) {
          return function(cb) {
            module.exports(dir, pattern, excludePattern, cb)
          }
        }), function(err, allDirFiles) {
          if (err) {
            cb(err)
            return
          }

          allDirFiles.forEach(function(dirFiles) {
            outputFiles = outputFiles.concat(dirFiles)
          })
          cb(null, outputFiles)
        })

        return
      }

      cb(null, outputFiles)
    })
  })
}
