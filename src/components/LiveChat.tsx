import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function LiveChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<
    { text: string; sender: 'user' | 'support' }[]
  >([{ text: 'Hello! How can I help you today?', sender: 'support' }])
  const [inputMessage, setInputMessage] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && chatRef.current) {
      chatRef.current.style.transform = 'scale(1)'
      chatRef.current.style.opacity = '1'
    }
  }, [isOpen])

  const toggleChat = () => {
    if (!isOpen && chatRef.current) {
      chatRef.current.style.transform = 'scale(0)'
      chatRef.current.style.opacity = '0'
    }
    setIsOpen(!isOpen)
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }])
      setInputMessage('')
      // Simulate a response from support
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: 'Thank you for your message. Our team will get back to you soon.',
            sender: 'support',
          },
        ])
      }, 1000)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <Card
          ref={chatRef}
          className="w-80 h-96 flex flex-col overflow-hidden shadow-lg absolute bottom-0 right-0 transition-all duration-300 ease-out bg-white"
          style={{
            transformOrigin: 'bottom right',
            transform: 'scale(0)',
            opacity: 0,
          }}
        >
          <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Live Support</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-white hover:text-purple-200"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close chat</span>
            </Button>
          </div>
          <div className="flex-grow overflow-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${message.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-900'}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={sendMessage}
            className="p-4 border-t border-purple-200"
          >
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow focus:ring-purple-500 focus:border-purple-500 bg-white border-neutral-300"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Button
        onClick={toggleChat}
        className={`rounded-full w-14 h-14 shadow-lg bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label={isOpen ? 'Close live chat' : 'Open live chat'}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  )
}
