'use strict'

const DotKernel = require('./dot-kernel')

module.exports = (id) => {
  return {
    initial () { return new DotKernel() },
    join (s1, s2) { return s1.join(s2) },
    valueOf (s) {
      let acc = 0
      for(let value of s.ds.values()) {
        acc += value
      }
      return acc
    },
    mutators: {
      inc (s, by = 1) {
        let [r, base] = mutateFor(s)
        return r.join(s.add(id, base + by))
      },
      dec (s, by = 1) {
        let [r, base] = mutateFor(s)
        return r.join(s.add(id, base - by))
      }
    }
  }

  function mutateFor(s) {
    let r = new DotKernel()
    let base = 0
    for(let it of s.ds) {
      const [key, value] = it
      const dot = DotKernel.dotForKey(key)
      const dotId = dot[0]
      if (id === dotId) {
        base = Math.max(base, value)
        r = r.join(s.removeDot(dot))
      }
    }

    return [r, base]
  }
}