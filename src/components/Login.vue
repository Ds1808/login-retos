<template>
  <div>
    <div class="container" v-if="isLogin">
      <div class="row">
        <div class="col-md-10">
          <div class="padre">
            <div class="card card-body" id="card1">
              <form @submit.prevent="handleSubmit">
                <h2 class="title">Inicio sesión</h2>
                <input
                  type="email"
                  placeholder="Ingresar correo"
                  class="cajatexto"
                  v-model="formData.email"
                />
                <input
                  type="password"
                  placeholder="Ingresar contraseña"
                  class="cajatexto"
                  v-model="formData.password"
                />
                <button class="btnform" type="submit">Ingresar</button>
                <p>
                  ¿Crea una cuenta?
                  <a class="loginLink" @click.prevent="toggleLogin">Registrarse</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container" v-else>
      <div class="row">
        <div class="col-md-7">
          <div class="padre">
            <div class="card card-body" id="card1">
              <form @submit.prevent="handleSubmit">
                <h2 class="title">Registro</h2>
                <input
                  type="email"
                  placeholder="Ingresar correo"
                  class="cajatexto"
                  v-model="formData.email"
                />
                <input
                  type="password"
                  placeholder="Ingresar contraseña"
                  class="cajatexto"
                  v-model="formData.password"
                />
                <button class="btnform" type="submit">Registrarse</button>
                <p>
                  ¿Ya tienes una cuenta?
                  <a class="loginLink" @click.prevent="toggleLogin">Login</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '../css/login.css'
import { loginUsuario, registerUsuario } from '../firebase/firebase.js'

const isLogin = ref(true)
const router = useRouter()

const formData = ref({
  email: '',
  password: '',
  error: ''
})

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await loginUsuario(formData.value.email, formData.value.password)
    } else {
      await registerUsuario(
        formData.value.email,
        formData.value.password,
      )
    }
    // Redirigir al home después de login o registro exitoso
    router.push('/')
  } catch (err) {
    formData.value.error = err.message
    console.error('Error en autenticación:', err.message)
  }
}

const toggleLogin = () => {
  isLogin.value = !isLogin.value
}
</script>
