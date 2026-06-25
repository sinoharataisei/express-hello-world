const express = require('express')
const expressWs = require('express-ws')

const app = express()
expressWs(app)

const port = process.env.PORT || 3001
let connects = []

app.use(express.static('public'))

app.ws('/ws', (ws) => {
  connects.push(ws)

  ws.on('message', (message) => {
    const msg = JSON.parse(message)

    // ユーザーのメッセージを全員に送信
    connects.forEach((socket) => {
      if (socket.readyState === 1) {
        socket.send(message)
      }
    })

    // BOTの返信
    if (msg.type === 'chat') {
      let reply = ''

      if (msg.text.includes('こんにちは')) {
        reply = 'こんにちは！'
      } else if (msg.text.includes('おはよう')) {
        reply = 'おはよう！'
      } else if (msg.text.includes('こんばんは')) {
        reply = 'こんばんは！'
      } else if (msg.text.includes('疲れた')) {
        reply = '今日はゆっくり休もう！'
      } else if (msg.text.includes('勉強')) {
        reply = '勉強頑張って！'
      } else if (msg.text.includes('野球')) {
        reply = '好きな球団はどこ？'
      } else if (msg.text.includes('ありがとう')) {
        reply = 'どういたしまして！'
      } else {
        const replies = [
          'なるほど！',
          '面白いね！',
          'もっと教えて！',
          'へぇー！',
          'それでそれで？'
        ]

        reply = replies[Math.floor(Math.random() * replies.length)]
      }

      const botMessage = JSON.stringify({
        id: 'BOT',
        text: reply,
        type: 'chat'
      })

      setTimeout(() => {
        if (ws.readyState === 1) {
          ws.send(botMessage)
        }
      }, 1000)
    }
  })

  ws.on('close', () => {
    connects = connects.filter((conn) => conn !== ws)
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
