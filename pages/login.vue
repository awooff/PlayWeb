<template>
  <div class="login-container text-black">
    <UCard class="login-card">
      <template #header>
        <h2 class="login-title">Welcome Back</h2>
        <p class="login-subtitle">Sign in to your PlayEngine account</p>
      </template>

      <UForm 
        ref="formRef"
        :validate="validate" 
        :state="state" 
        @submit="handleLogin" 
        class="login-form"
      >
        <div class="form-group">
          <UFormField label="Username or Email" name="identifier">
            <UInput 
              v-model="state.identifier"
              placeholder="Enter your username or email"
              :disabled="loading"
              class="form-input"
            />
          </UFormField>
        </div>

        <div class="form-group">
          <UFormField label="Password" name="password">
            <UInput 
              v-model="state.password"
              type="password"
              placeholder="Enter your password"
              :disabled="loading"
              class="form-input"
            />
          </UFormField>
        </div>

        <div class="form-options">
          <div class="remember-me">
            <UCheckbox 
              v-model="state.rememberMe" 
              :disabled="loading"
              label="Remember me"
            />
          </div>
          <NuxtLink to="/forgot-password" class="forgot-link">
            Forgot password?
          </NuxtLink>
        </div>

        <div class="form-actions">
          <UButton 
            type="submit" 
            :loading="loading"
            :disabled="loading"
            class="login-button"
            block
          >
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </UButton>
        </div>

        <div class="form-footer">
          <p class="register-link">
            Don't have an account? 
            <NuxtLink to="/register" class="link">Create one here</NuxtLink>
          </p>
        </div>
      </UForm>

      <!-- Success/Error Messages -->
      <UAlert 
        v-if="successMessage" 
        color="green" 
        variant="soft" 
        :title="successMessage"
        class="alert"
      />
      
      <UAlert 
        v-if="errorMessage" 
        color="red" 
        variant="soft" 
        :title="errorMessage"
        class="alert"
      />
    </UCard>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { z } from 'zod'

// Define page meta
definePageMeta({
  auth: false, // Allow unauthenticated users
  layout: 'auth' // Use auth layout if you have one
})

// Form reference
const formRef = ref()

// Form state using reactive (required by NuxtUI)
const state = reactive({
  identifier: '',
  password: '',
  rememberMe: false
})

// Form validation state
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Validation schema using Zod (NuxtUI's preferred validation)
const schema = z.object({
  identifier: z.string()
    .min(1, 'Username or email is required')
    .min(3, 'Please enter a valid username or email'),
  password: z.string()
    .min(1, 'Password is required')
})

const validate = (state) => {
  try {
    schema.parse(state)
    return []
  } catch (error) {
    return error.errors?.map(err => ({
      path: err.path.join('.'),
      message: err.message
    })) || []
  }
}

// Handle form submission
const handleLogin = async (event) => {
  // Clear previous messages
  successMessage.value = ''
  errorMessage.value = ''

  // Get validated form data from event
  const formData = event.data

  loading.value = true

  try {
    // Call your login API endpoint - this should handle Lucia session creation
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        identifier: formData.identifier,
        password: formData.password,
        rememberMe: formData.rememberMe
      },
      // Ensure cookies are included in the request/response
      credentials: 'include'
    })

    successMessage.value = 'Login successful! Redirecting...'

    // Set the user cookie for navbar and session state
    const userData = {
      username: response.username,
      email: response.email
    }
    const userCookie = useCookie('user', { sameSite: 'strict' })
    userCookie.value = userData
    
    // Refresh the user session data (if needed)
    refreshCookie('auth-session')
    
    await navigateTo('/home', { replace: true })

  } catch (error) {
    console.error('Login error:', error)
    
    // Handle different error scenarios
    if (error.data?.message) {
      errorMessage.value = error.data.message
    } else if (error.statusCode === 401) {
      errorMessage.value = 'Invalid username/email or password'
    } else if (error.statusCode === 404) {
      errorMessage.value = 'Account not found'
    } else if (error.statusCode === 429) {
      errorMessage.value = 'Too many login attempts. Please try again later.'
    } else {
      errorMessage.value = 'An error occurred while signing in. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

// Clear the user cookie on logout (for completeness)
if (process.client) {
  const clearUserCookie = () => {
    const userCookie = useCookie('user')
    userCookie.value = null
  }
  // Listen for logout navigation (optional, for SPA UX)
  if (window) {
    window.addEventListener('logout', clearUserCookie)
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgb(249 250 251); /* bg-gray-50 */
}

.login-card {
  width: 100%;
  max-width: 28rem; /* max-w-md */
  background-color: white;
  border: 2px solid rgb(209 213 219); /* border-gray-300 */
  border-radius: 0;
  box-shadow: none;
  border-style: inset;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  text-align: center;
  margin: 0;
}

.login-subtitle {
  font-size: 0.875rem;
  color: rgb(107 114 128); /* text-gray-500 */
  text-align: center;
  margin: 0.5rem 0 0 0;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

.login-form {
  padding: 1.5rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  font-size: 0.875rem;
  color: black;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

.forgot-link {
  font-size: 0.875rem;
  color: rgb(29 78 216); /* text-blue-700 */
  text-decoration: underline;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

.forgot-link:hover {
  background-color: rgb(254 249 195); /* bg-yellow-100 */
}

.forgot-link:visited {
  color: rgb(91 33 182); /* text-purple-800 */
}

.form-actions {
  margin: 2rem 0 1.5rem 0;
}

.form-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgb(229 231 235); /* border-gray-200 */
}

.register-link {
  font-size: 0.875rem;
  color: rgb(107 114 128); /* text-gray-500 */
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  margin: 0;
}

.link {
  color: rgb(29 78 216); /* text-blue-700 */
  text-decoration: underline;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

.link:hover {
  background-color: rgb(254 249 195); /* bg-yellow-100 */
}

.link:visited {
  color: rgb(91 33 182); /* text-purple-800 */
}

.alert {
  margin-top: 1rem;
}

:deep(.card .card-header) {
  background-color: rgb(229 231 235); /* bg-gray-200 */
  border-bottom: 1px solid rgb(209 213 219); /* border-gray-300 */
  padding: 1.5rem;
  margin: -1.5rem -1.5rem 0 -1.5rem;
}

:deep(.login-button) {
  background-color: rgb(29 78 216); /* bg-blue-700 */
  border: 2px solid rgb(29 78 216);
  border-radius: 0;
  color: white;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-weight: 600;
  padding: 0.75rem 1rem;
}

:deep(.login-button:hover:not(:disabled)) {
  background-color: rgb(30 64 175); /* bg-blue-800 */
  border-color: rgb(30 64 175);
}

:deep(.login-button:disabled) {
  background-color: rgb(156 163 175); /* bg-gray-400 */
  border-color: rgb(156 163 175);
  cursor: not-allowed;
}

:deep(.form-input input) {
  border: 2px solid rgb(209 213 219); /* border-gray-300 */
  border-radius: 0;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 0.875rem;
}

:deep(.form-input input:focus) {
  border-color: rgb(29 78 216); /* border-blue-700 */
  box-shadow: 0 0 0 1px rgb(29 78 216);
}
</style>
