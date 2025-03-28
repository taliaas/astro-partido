import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
    state: () => ({
        showSidePanel: false
    }),
    actions: {
        toggleSidePanel() {
            this.showSidePanel = !this.showSidePanel
        }
    }
})