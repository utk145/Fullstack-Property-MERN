import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:7000"
      // jo bhi request /api se aari hogi uske peeche yeh append ho jaayega and not only that, ek proxy laga di jaayegi ki jo request aari hai woh issi url se aari hai. Soo now vite app jahaan bhi chal rahi ho, server ko lagega ki request same origin server se aari hai.
    }
  },
  plugins: [react()],
})
