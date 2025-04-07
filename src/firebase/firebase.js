// src/firebase/firebase.js
import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth"
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyBDNEmKXxZ0WmN71yaNo-SZ7UnFeXnB65E",
  authDomain: "monopoly-bank-3981c.firebaseapp.com",
  projectId: "monopoly-bank-3981c",
  storageBucket: "monopoly-bank-3981c.firebasestorage.app",
  messagingSenderId: "889178058588",
  appId: "1:889178058588:web:cab856e6f0aa85f8301b99"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Función para login
export const loginUsuario = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("Usuario logueado:", userCredential.user)
    // Aquí puedes redirigir o emitir un evento
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message)
  }
}

// Función para registrar usuario
export const registerUsuario = async (email, password, ) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, {
      displayName: email
    })
    console.log("Usuario registrado:", userCredential.user)
  } catch (error) {
    console.error("Error al registrar usuario:", error.message)
  }
}

export const checkAuthState = () => {
    const auth = getAuth()
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe() 
        resolve(user) // si hay un usuario lo retorna
      }, reject)
    })
  }

// Función para obtener tareas
    export const getTareas = async () => {
    const auth = getAuth()
    const user = auth.currentUser
    const q = query(collection(db, 'tareas'), where('uid', '==', user.uid))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
  // Agregar tarea en U
    export const agregarTarea = async (nombre, notas) => {
    const auth = getAuth()
    const user = auth.currentUser
    await addDoc(collection(db, 'tareas'), {
      nombre,
      notas,
      uid: user.uid
    })
  }
  
  // Eliminar tarea de U
  export const eliminarTarea = async (id) => {
    await deleteDoc(doc(db, 'tareas', id))
  }
  
  // Editar tarea
  export const editarTarea = async (id, nombre, notas) => {
    await updateDoc(doc(db, 'tareas', id), {
      nombre,
      notas
    })
  }