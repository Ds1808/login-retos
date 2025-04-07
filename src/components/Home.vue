<template>
  <div class="container mt-4">
    <h1 class="mb-4">Mis Tareas</h1>

    <form @submit.prevent="crearTarea" class="mb-3">
      <input v-model="nuevaTarea.nombre" placeholder="Nombre de tarea" class="form-control mb-2" />
      <textarea v-model="nuevaTarea.notas" placeholder="Notas" class="form-control mb-2"></textarea>
      <button class="btn btn-primary" type="submit">Agregar</button>
    </form>

    <div v-if="tareas.length === 0">No hay tareas aún.</div>

    <div class="row">
      <div class="col">
        <h3>Pendiente</h3>
        <draggable :modelValue="tareasPendientes" @update:modelValue="onTareasUpdate" group="tareas" itemkey="id">
          <template #default="{ element }">
            <div :key="element.id" class="list-group-item">
              <div class="me-auto">
                <strong>{{ element.nombre }}</strong>
                <br />
                <small>{{ element.notas }}</small>
              </div>
              <button class="btn btn-sm btn-warning me-2" @click="seleccionarEdicion(tarea)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="borrarTarea(element.id)">Eliminar</button>
            </div>
          </template>
        </draggable>
      </div>

      <div class="col">
        <h3>En Progreso</h3>
        <draggable :modelValue="tareasEnProgreso" @update:modelValue="onTareasUpdate" group="tareas" itemkey="id">
          <template #default="{ element }">
            <div :key="element.id" class="list-group-item">
              <div class="me-auto">
                <strong>{{ element.nombre }}</strong>
                <br />
                <small>{{ element.notas }}</small>
              </div>
              <button class="btn btn-sm btn-warning me-2" @click="seleccionarEdicion(tarea)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="borrarTarea(element.id)">Eliminar</button>
            </div>
          </template>
        </draggable>
      </div>

      <div class="col">
        <h3>Completada</h3>
        <draggable :modelValue="tareasCompletadas" @update:modelValue="onTareasUpdate" group="tareas" itemkey="id">
          <template #default="{ element }">
            <div :key="element.id" class="list-group-item">
              <div class="me-auto">
                <strong>{{ element.nombre }}</strong>
                <br />
                <small>{{ element.notas }}</small>
              </div>
              <button class="btn btn-sm btn-warning me-2" @click="seleccionarEdicion(tarea)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="borrarTarea(element.id)">Eliminar</button>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <div v-if="modoEdicion" class="mt-4">
      <h3>Editar tarea</h3>
      <form @submit.prevent="guardarEdicion">
        <input v-model="tareaEditada.nombre" placeholder="Nuevo nombre" class="form-control mb-2" />
        <textarea v-model="tareaEditada.notas" placeholder="Nuevas notas" class="form-control mb-2"></textarea>
        <button class="btn btn-success" type="submit">Guardar</button>
        <button class="btn btn-secondary ms-2" @click="cancelarEdicion">Cancelar</button>
      </form>
    </div>

    <div>
      <button @click="cerrarSesion" class="btn btn-outline-secondary mt-3">Cerrar sesión</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import draggable from 'vuedraggable'
import { agregarTarea, getTareas, eliminarTarea, editarTarea } from '../firebase/firebase'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

const tareas = ref([]) 
const nuevaTarea = ref({ nombre: '', notas: '' })
const tareasPendientes = ref([]) 
const tareasEnProgreso = ref([]) 
const tareasCompletadas = ref([]) 
const modoEdicion = ref(false)
const tareaEditada = ref({ id: '', nombre: '', notas: '' })

const cargarTareas = async () => {
  tareas.value = await getTareas()
 
  tareasPendientes.value = tareas.value.filter(tarea => tarea.estado === 'pendiente')
  tareasEnProgreso.value = tareas.value.filter(tarea => tarea.estado === 'progreso')
  tareasCompletadas.value = tareas.value.filter(tarea => tarea.estado === 'completada')
}

const crearTarea = async () => {
  if (!nuevaTarea.value.nombre) return
  await agregarTarea(nuevaTarea.value.nombre, nuevaTarea.value.notas, 'pendiente') // Estado pendiente por defecto
  nuevaTarea.value = { nombre: '', notas: '' }
  await cargarTareas()
}

const borrarTarea = async (id) => {
  await eliminarTarea(id)
  await cargarTareas()
}

const seleccionarEdicion = (tarea) => {
  modoEdicion.value = true
  tareaEditada.value = { ...tarea }
}

const cancelarEdicion = () => {
  modoEdicion.value = false
  tareaEditada.value = { id: '', nombre: '', notas: '' }
}

const guardarEdicion = async () => {
  await editarTarea(tareaEditada.value.id, tareaEditada.value.nombre, tareaEditada.value.notas)
  cancelarEdicion()
  await cargarTareas()
}

const router = useRouter()

const cerrarSesion = async () => {
  await signOut(getAuth())
  router.push('/login')
}

const onTareasUpdate = () => {
  // Aquí puedes actualizar el estado de las tareas después de un cambio
  console.log('Tareas actualizadas');
}

onMounted(() => {
  cargarTareas()
})
</script>  
  <style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1, h3 {
  text-align: center;
  color: #2c3e50;
}

form {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

button.btn-primary {
  background-color: #007bff;
  color: white;
}

button.btn-primary:hover {
  background-color: #0056b3;
}

button.btn-warning {
  background-color: #ffc107;
  color: #333;
}

button.btn-warning:hover {
  background-color: #e0a800;
}

button.btn-danger {
  background-color: #dc3545;
  color: white;
}

button.btn-danger:hover {
  background-color: #b02a37;
}

button.btn-success {
  background-color: #28a745;
  color: white;
}

button.btn-success:hover {
  background-color: #1e7e34;
}

button.btn-secondary {
  background-color: #6c757d;
  color: white;
}

button.btn-secondary:hover {
  background-color: #545b62;
}

.list-group {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.list-group-item {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s ease;
}

.list-group-item:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>