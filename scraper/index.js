import fetch from 'node-fetch-extra'

export async function getDataFromURL(url) {
  let retryCount = 0
  let isValid = false
  let data = {}

  while (!isValid && retryCount < 4) {
    // Get data
    const dataReq = await fetch('/api/' + url)
    if (dataReq.status === 204) {
      // Empty result.
      // Just end the loop
      isValid = true
      return data
    } else {
      const res = (data = await dataReq.text())
      if (!res.startsWith('<') && res.trim().length > 0) {
        try {
          data = JSON.parse(data)
          isValid = true
        } catch (e) {
          // Oh well
          retryCount++
          // await sleep(100 * Math.floor(Math.random() * 50))
        }
      } else {
        retryCount++
        // await sleep(100 * Math.floor(Math.random() * 50));
      }
    }
  }
  return data
}
