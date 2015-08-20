var Pass = require('stream').PassThrough
var Deque = require('double-ended-queue')

function timer (name) {
  console.time(name)
  return function () {console.timeEnd(name)}
}

function bench_pre_stream (n) {
  var t = timer('pre stream')
  var pass = new Pass({objectMode: true})
  pass.on('data', function () {})
  pass.once('end', function () {
    t()
    if (n) bench_pre_stream(n - 1)
  })
  var i = 100000; while (i--) pass.write({})
  pass.end()
}

function bench_post_stream (n) {
  var t = timer('post stream')
  var pass = new Pass({objectMode: true})
  var i = 100000; while (i--) pass.write({})
  pass.end()
  pass.on('data', function () {})
  pass.once('end', function () {
    t()
    if (n) bench_post_stream(n - 1)
  })
}

function bench_deque (n) {
  while (n--) {
    var t = timer('deque')
    var queue = new Deque()
    var i = 100000; while (i--) queue.enqueue({})
    while (queue.dequeue()) {}
    t()
  }
}

bench_deque(10)
bench_post_stream(10)
bench_pre_stream(10)
