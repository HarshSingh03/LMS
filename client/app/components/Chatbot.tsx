"use client"
import { useTheme } from 'next-themes'
import { Fab, Webchat, Container, StylesheetProvider, Header, MessageList, RichBlockMessage, useWebchat } from '@botpress/webchat'
import { useState } from 'react'


require('dotenv').config()
function Chat() {
 const {client, messages, isTyping,user} = useWebchat({
  clientId:'38ffdfda-315f-4537-a40c-14bc2da261a2',
 })
  const headerConfiguration = {
    botName:'Learning Assistant',
    botDescription:'Your personal learning assistant',

}
 

  const { theme, setTheme } = useTheme()
  const [isWebchatOpen, setIsWebchatOpen] = useState(false)
  const toggleWebchat = (state: boolean) => {
    setIsWebchatOpen((prevState) => state)
  }
  const botId = '38ffdfda-315f-4537-a40c-14bc2da261a2';

  return (
    <>
      <Container
       style={{
        width: '30%',
        height: '90%',
        display: isWebchatOpen ? 'flex' : 'none',
        position: 'fixed',
        bottom: '90px',
        right: '20px',
      }}>
      <StylesheetProvider
       color={theme==='dark'?"ffffff":"333333"}
       themeMode={theme==='dark'?"dark":"light"}
       radius={2}
       variant='solid'
             />
      <Header 
      closeWindow={() => toggleWebchat(false)}
      configuration={headerConfiguration}/>

      <MessageList>

      </MessageList>


      <Webchat
        clientId={botId} // Your client ID here
        configuration={headerConfiguration}
        
        style={{
          width: '30%',
          height: '90%',
          display: isWebchatOpen ? 'flex' : 'none',
          position: 'fixed',
          bottom: '90px',
          right: '20px',
        }}
      >
        </Webchat>
      </Container>

      <Fab onClick={() => toggleWebchat(true)} style={{ position: 'fixed', bottom: '20px', right: '20px', height:'30px', width:'30px' }} />
    </>
  )
}

export default Chat