export const parseQueryString = query => {
  return (query.replace(/^\?/, '').split('&') || []).reduce((acc, d) => {
    const [k, v] = d.split('=')
    if (k) {
      acc[k] = v
    }
    return acc
  }, {})
}

export const encodeQueryString = obj => {
  const q = Object.keys(obj).map(k => {
    return [k, obj[k]].join('=')
  })

  return q && q.length ? `?${q.join('&')}` : ''
}
