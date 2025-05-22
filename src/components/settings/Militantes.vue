<template>
  <div class="container mx-auto py-8 px-4">
    <!-- Search and Add -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div class="relative w-full sm:w-80">
        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
            v-model="searchQuery"
            type="search"
            placeholder="Buscar miembros..."
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <button
          @click="openAddMemberModal"
          class="inline-flex items-center justify-center bg-button rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-button/90 h-10 px-4 py-2"
      >
        <PlusCircle class="mr-2 h-4 w-4" />
        Añadir
      </button>
    </div>

    <!-- Members Table -->
    <div class="rounded-md border">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&_tr]:border-b">
        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nombre</th>
          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Correo</th>
          <th class="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Organización</th>
          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Estado</th>
          <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"></th>
        </tr>
        </thead>
        <tbody class="[&_tr:last-child]:border-0">
        <tr
            v-for="member in filteredMembers"
            :key="member.id"
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
        >
          <td class="p-4 align-middle">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span class="text-sm font-medium">{{ getInitials(member) }}</span>
              </div>
              <div>
                <div class="font-medium">{{ member.firstname }} {{ member.lastname }}</div>
                <div class="text-sm text-muted-foreground">{{ member.phone }}</div>
              </div>
            </div>
          </td>
          <td class="p-4 align-middle">{{ member.email }}</td>
          <td class="p-4 align-middle text-center capitalize">{{ member.organization }}</td>
          <td class="p-4 align-middle">
              <span
                  :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  member.estado
                    ? 'bg-green-50 text-green-700 border border-green-300'
                    : 'bg-red-50 text-red-700 border border-red-300'
                ]"
              >
                {{ member.estado ? 'Active' : 'Inactive' }}
              </span>
          </td>
          <td class="p-4 align-middle">
            <div class="flex items-center gap-2">
              <button
                  @click="openEditMemberModal(member)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
              >
                <span class="sr-only">Edit</span>
                <Pencil class="h-4 w-4" />
              </button>
              <button
                  @click="toggleMemberStatus(member)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
              >
                <span class="sr-only">Toggle Status</span>
                <component :is="member.estado ? UserX : UserCheck" class="h-4 w-4" />
              </button>
              <button
                  @click="confirmDeleteMember(member)"
                  class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <span class="sr-only">Delete</span>
                <Trash class="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="filteredMembers.length === 0">
          <td colspan="6" class="p-4 text-center text-muted-foreground">
            No hay militantes.
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between py-4">
      <div class="text-sm text-muted-foreground">
        Showing <span class="font-medium">{{ filteredMembers.length }}</span> of <span class="font-medium">{{ members.length }}</span> members
      </div>
      <div class="flex items-center space-x-2">
        <button
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage === 1"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          Previous
        </button>
        <button
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage === totalPages"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Member Form Modal -->
    <div v-if="showMemberModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 class="text-lg font-semibold leading-none tracking-tight">{{ isEditing ? 'Edit Member' : 'Add Member' }}</h2>
          <p class="text-sm text-muted-foreground">
            {{ isEditing ? 'Update member information' : 'Fill in the details to add a new member' }}
          </p>
        </div>
        <form @submit.prevent="saveMember" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="firstname" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First Name</label>
              <input
                  id="firstname"
                  v-model="currentMember.firstname"
                  type="text"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="First name"
                  required
              />
            </div>
            <div class="space-y-2">
              <label for="lastname" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last Name</label>
              <input
                  id="lastname"
                  v-model="currentMember.lastname"
                  type="text"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Last name"
                  required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label for="email" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
            <input
                id="email"
                v-model="currentMember.email"
                type="email"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Email address"
                required
            />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="organization" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Organization</label>
              <select
                  id="organization"
                  v-model="currentMember.organization"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
              >
                <option value="" disabled>Select organization</option>
                <option value="pcc">PCC</option>
                <option value="ujc">UJC</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="space-y-2">
              <label for="core" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Core</label>
              <select
                  id="core"
                  v-model="currentMember.core.name"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
              >
                <option value="" disabled>Select core</option>
                <option value="CEIS">CEIS</option>
                <option value="CEIGE">CEIGE</option>
                <option value="CEIM">CEIM</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label for="phone" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone</label>
              <input
                  id="phone"
                  v-model="currentMember.phone"
                  type="text"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Phone number"
                  required
              />
            </div>
            <div class="space-y-2">
              <label for="status" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Status</label>
              <div class="flex items-center space-x-2 pt-2">
                <button
                    type="button"
                    role="checkbox"
                    aria-checked="true"
                    data-state="checked"
                    value="on"
                    @click="currentMember.estado = !currentMember.estado"
                    class="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    :class="{ 'bg-primary': currentMember.estado }"
                >
                  <CheckIcon v-if="currentMember.estado" class="h-3 w-3 text-white" />
                </button>
                <label for="status" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {{ currentMember.estado ? 'Active' : 'Inactive' }}
                </label>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label for="address" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Address</label>
            <input
                id="address"
                v-model="currentMember.address"
                type="text"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Address"
                required
            />
          </div>

          <div class="flex justify-end gap-2">
            <button
                type="button"
                @click="closeMemberModal"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Cancel
            </button>
            <button
                type="submit"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {{ isEditing ? 'Save Changes' : 'Add Member' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 class="text-lg font-semibold leading-none tracking-tight">Delete Member</h2>
          <p class="text-sm text-muted-foreground">
            Are you sure you want to delete this member? This action cannot be undone.
          </p>
        </div>
        <div class="flex justify-end gap-2">
          <button
              type="button"
              @click="showDeleteModal = false"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Cancel
          </button>
          <button
              type="button"
              @click="deleteMember"
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  Search,
  PlusCircle,
  Pencil,
  Trash,
  UserX,
  UserCheck
} from 'lucide-vue-next'


// Sample data
const members = ref([
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    organization: "pcc",
    estado: true,
    address: "123 Main St",
    phone: "555-1234",
    core: {
      name: "CEIS",
    },
  },
  {
    id: 2,
    firstname: "Talia",
    lastname: "Arrue",
    email: "taliasalasarrue@gmail.com",
    organization: "pcc",
    estado: true,
    address: "ave 41 e/ 16 y 18",
    phone: "52332232",
    core: {
      name: "CEIS",
    },
  },
  {
    id: 3,
    firstname: "Maria",
    lastname: "Rodriguez",
    email: "maria.rodriguez@example.com",
    organization: "ujc",
    estado: true,
    address: "456 Oak Ave",
    phone: "555-5678",
    core: {
      name: "CEIGE",
    },
  },
  {
    id: 4,
    firstname: "Carlos",
    lastname: "Perez",
    email: "carlos.perez@example.com",
    organization: "pcc",
    estado: false,
    address: "789 Pine St",
    phone: "555-9012",
    core: {
      name: "CEIM",
    },
  },
  {
    id: 5,
    firstname: "Ana",
    lastname: "Martinez",
    email: "ana.martinez@example.com",
    organization: "ujc",
    estado: true,
    address: "321 Elm St",
    phone: "555-3456",
    core: {
      name: "CEIS",
    },
  },
])

// UI state
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const showMemberModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const memberToDelete = ref(null)

const { militantes, page } = defineProps<{
  militantes: any,
  page: number
}>();

// Current member being edited or added
const currentMember = reactive({
  id: 0,
  firstname: '',
  lastname: '',
  email: '',
  organization: '',
  estado: true,
  address: '',
  phone: '',
  core: {
    name: ''
  }
})

// Computed properties
const filteredMembers = computed(() => {
  if (!searchQuery.value) {
    return militantes.data
  }
  if (!Array.isArray(militantes.data)) return [];
  const query = searchQuery.value.toLowerCase()
  return militantes.data.filter(member =>
      member.firstname.toLowerCase().includes(query) ||
      member.lastname.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.organization.toLowerCase().includes(query) ||
      member.core.name.toLowerCase().includes(query)
  )
})

const totalPages = militantes.total

// Methods
const getInitials = (member) => {
  return `${member.firstname.charAt(0)}${member.lastname.charAt(0)}`
}

const openAddMemberModal = () => {
  isEditing.value = false
  resetCurrentMember()
  showMemberModal.value = true
}

const openEditMemberModal = (member) => {
  isEditing.value = true
  Object.assign(currentMember, JSON.parse(JSON.stringify(member)))
  showMemberModal.value = true
}

const closeMemberModal = () => {
  showMemberModal.value = false
  resetCurrentMember()
}

const resetCurrentMember = () => {
  currentMember.id = 0
  currentMember.firstname = ''
  currentMember.lastname = ''
  currentMember.email = ''
  currentMember.organization = ''
  currentMember.estado = true
  currentMember.address = ''
  currentMember.phone = ''
  currentMember.core.name = ''
}

const saveMember = () => {
  if (isEditing.value) {
    // Update existing member
    const index = members.value.findIndex(m => m.id === currentMember.id)
    if (index !== -1) {
      members.value[index] = JSON.parse(JSON.stringify(currentMember))
    }
  } else {
    // Add new member
    const newId = Math.max(0, ...members.value.map(m => m.id)) + 1
    currentMember.id = newId
    members.value.push(JSON.parse(JSON.stringify(currentMember)))
  }

  closeMemberModal()
}

const toggleMemberStatus = (member) => {
  const index = members.value.findIndex(m => m.id === member.id)
  if (index !== -1) {
    members.value[index].estado = !members.value[index].estado
  }
}

const confirmDeleteMember = (member) => {
  memberToDelete.value = member
  showDeleteModal.value = true
}

const deleteMember = () => {
  if (memberToDelete.value) {
    members.value = members.value.filter(m => m.id !== memberToDelete.value.id)
    memberToDelete.value = null
    showDeleteModal.value = false
  }
}
</script>
