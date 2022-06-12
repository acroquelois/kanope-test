import axios from 'axios'
import fs from 'fs'

const json = JSON.parse(fs.readFileSync('data.json', 'utf8'))
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const numberToHexLittleEndian = (number) => {
  const n = getRandomInt(2) ? number * 1.01 : number * 0.99
  let string = Math.floor(n).toString(16).padStart(4, '0')
  return string.slice(2) + string.slice(0, 2)
}

const main = async () => {
  while (true) {
    try {
      const data = {
        imei: '866802022363388',
        devices: {},
      }
      const numberOfDevice = getRandomInt(4) + 1
      console.log(numberOfDevice)
      for (let i = 0; i < numberOfDevice; i += 1) {
        const deviceIndex = getRandomInt(json.devices.length)
        const dataIndex = getRandomInt(json.data.length)
        data.devices[json.devices[deviceIndex]] = {
          rssi: json.data[dataIndex].rssi,
          data:
            '0201040319430409094f524d41524556310d03' +
            numberToHexLittleEndian(json.data[dataIndex].temperature_1 * 100) +
            numberToHexLittleEndian(json.data[dataIndex].temperature_1 * 100) +
            numberToHexLittleEndian(json.data[dataIndex].humidity * 100) +
            numberToHexLittleEndian(json.data[dataIndex].pressure),
        }
      }
      await axios({
        method: 'POST',
        url: 'http://localhost:3030/callback',
        data,
      })
      console.log(data)
    } catch (e) {
      console.log(e)
    }
    await delay(60000) /// waiting 1 minutes.
  }
}

main()
