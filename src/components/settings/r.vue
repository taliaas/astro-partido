<script setup lang="ts">
// Roles
const roles = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Acceso completo al sistema con todos los permisos',
    users: 2,
    permissions: 'Todos los permisos (32)',
    createdAt: '15 de enero, 2023',
  },
  {
    id: '2',
    name: 'Gestor',
    description: 'Puede gestionar contenido y usuarios pero no modificar configuraciones del sistema',
    users: 5,
    permissions: 'Permisos limitados (24)',
    createdAt: '3 de febrero, 2023',
  },
  {
    id: '3',
    name: 'Editor',
    description: 'Puede crear y editar documentos pero no eliminarlos',
    users: 12,
    permissions: 'Permisos de edición de contenido (16)',
    createdAt: '20 de marzo, 2023',
  },
  {
    id: '4',
    name: 'Visualizador',
    description: 'Acceso de solo lectura a documentos y contenido',
    users: 28,
    permissions: 'Permisos de solo vista (8)',
    createdAt: '5 de abril, 2023',
  },
  {
    id: '5',
    name: 'Invitado',
    description: 'Acceso limitado solo a documentos compartidos',
    users: 7,
    permissions: 'Permisos mínimos (4)',
    createdAt: '12 de mayo, 2023',
  },
]
</script>
