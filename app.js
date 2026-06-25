const express = require('express')
const expressWs = require('express-ws')

const app = express()
expressWs(app)

const port = process.env.PORT || 3001
let connects = []

app.use(express.static('public'))

app.ws('/ws', (ws, req) => {
  connects.push(ws)

  ws.on('message', (message) => {
    console.log('Received:', message)

    // JSON文字列をオブジェクトに変換
    const msg = JSON.parse(message)

    // 全員に送信
    connects.forEach((socket) => {
      if (socket.readyState === 1) {
        socket.send(message)
      }
    })

    // チャットメッセージの場合はBOTが返事する
    if (msg.type === 'chat') {
      let reply = ''

      if (msg.text.includes('こんにちは')) {
        reply = 'こんにちは！'
      } else if (msg.text.includes('おはよう')) {
        reply = 'おはよう！'
      } else if (msg.text.includes('こんばんは')) {
        reply = 'こんばんは！'
      } else if (msg.text.includes('元気')) {
        reply = '元気だよ！'
      } else if (msg.text.includes('好き')) {
        reply = 'ありがとう！'
      } else if (msg.text.includes('疲れた')) {
        reply = '今日はゆっくり休もう！'
      } else if (msg.text.includes('勉強')) {
        reply = '勉強頑張って！'
      } else if (msg.text.includes('野球')) {
        reply = '野球いいね！好きなチームは？'
      } else {
        const replies = [
          'へぇー！',
          'それでそれで？',
          'もっと教えて！',
          '面白いね！',
          'なるほど！'
        ]

        reply = replies[Math.floor(Math.random() * replies.length)]
      }

      const botMessage = JSON.stringify({
        id: 'BOT',
        text: reply,
        type: 'chat'
      })

      // 1秒後にBOTが返信
      setTimeout(() => {
        if (ws.readyState === 1) {
          ws.send(botMessage)
        }
      }, 1000)
    }

    // お絵描きデータの場合はそのまま送信
    if (msg.type === 'paint') {
      connects.forEach((socket) => {
        if (socket.readyState === 1) {
          socket.send(message)
        }
      })
    }
  })

  ws.on('close', () => {
    connects = connects.filter((conn) => conn !== ws)
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
