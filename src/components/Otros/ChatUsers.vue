<template>
    <div class="min-h-screen mt-4 p-4 bg-gray-50">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <!-- Sidebar with conversations -->
          <div class="md:col-span-1 bg-gray-50 border-r border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h2 class="text-gray-900 text-lg font-semibold">Comunicaciones</h2>
            </div>
            <div class="space-y-1 p-2">
              <div 
                v-for="chat in chats" 
                :key="chat.id"
                @click="selectChat(chat)"
                class="p-3 rounded-lg cursor-pointer transition-all duration-200"
                :class="selectedChat?.id === chat.id ? 
                  'bg-gray-200 shadow-sm' : 
                  'hover:bg-gray-100'"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span class="text-gray-700 font-medium">{{ chat.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="text-gray-900 font-medium text-sm">{{ chat.name }}</p>
                    <p class="text-gray-500 text-xs">{{ chat.lastMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Chat area -->
          <div class="md:col-span-3 flex flex-col h-[80vh] bg-white">
            <!-- Chat header -->
            <div class="p-4 border-b border-gray-200 bg-white">
              <div v-if="selectedChat" class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span class="text-gray-700 font-medium">{{ selectedChat.name.charAt(0) }}</span>
                </div>
                <div>
                  <h3 class="text-gray-900 font-semibold">{{ selectedChat.name }}</h3>
                  <p class="text-gray-500 text-sm">{{ selectedChat.members }} miembros</p>
                </div>
              </div>
            </div>
  
            <!-- Messages -->
            <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messageContainer">
              <div v-for="message in messages" :key="message.id" class="flex flex-col">
                <div 
                  :class="[
                    'max-w-[80%] rounded-lg p-3 break-words shadow-sm',
                    message.sender === 'user' 
                      ? 'bg-gray-100 ml-auto' 
                      : 'bg-white border border-gray-200'
                  ]"
                >
                  <p class="text-sm text-gray-900">{{ message.text }}</p>
                  <div class="flex items-center mt-1 space-x-2">
                    <span class="text-xs text-gray-500">{{ message.time }}</span>
                    <span v-if="message.sender === 'user'" class="text-xs text-gray-500">
                      {{ message.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Message input -->
            <div class="p-4 border-t border-gray-200 bg-white">
              <form @submit.prevent="sendMessage" class="flex space-x-2">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="Redactar mensaje..."
                  class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all duration-200"
                />
                <button 
                  type="submit"
                  class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  
  const chats = ref([
    { 
      id: 1, 
      name: 'Comité CUJAE', 
      lastMessage: 'Agenda para la próxima sesión',
      members: 12
    },
    { 
      id: 2, 
      name: 'Comité primario', 
      lastMessage: 'Revisión de propuestas',
      members: 8
    },
    { 
      id: 3, 
      name: 'Asuntos Estratégicos', 
      lastMessage: 'Análisis del último informe',
      members: 15
    },
  ])
  
  const messages = ref([
    { 
      id: 1, 
      text: 'Se ha compartido la agenda actualizada para la próxima sesión ordinaria.', 
      sender: 'other', 
      time: '10:00',
      status: 'Enviado' 
    },
    { 
      id: 2, 
      text: 'Confirmado. Procederé a la revisión de los puntos principales.', 
      sender: 'user', 
      time: '10:01',
      status: 'Leído' 
    },
  ])
  
  const selectedChat = ref(chats.value[0])
  const newMessage = ref('')
  const messageContainer = ref(null)
  
  const selectChat = (chat) => {
    selectedChat.value = chat
  }
  
  const sendMessage = async () => {
    if (!newMessage.value.trim()) return
  
    const message = {
      id: messages.value.length + 1,
      text: newMessage.value,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Enviado'
    }
  
    messages.value.push(message)
    newMessage.value = ''
  
    await nextTick()
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  }
  
  onMounted(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
  </script>