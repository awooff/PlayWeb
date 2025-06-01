<template>
  <div class="register-container">
    <UCard class="register-card">
      <template #header>
        <h2 class="register-title">Create Your Account</h2>
        <p class="register-subtitle">Join PlayEngine and start building amazing games</p>
      </template>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <UFormGroup label="Username" name="username" :error="errors.username">
            <UInput 
              v-model="form.username"
              placeholder="Enter your username"
              :disabled="loading"
              class="form-input"
              @blur="validateUsername"
            />
          </UFormGroup>
        </div>

        <div class="form-group">
          <UFormGroup label="Email Address" name="email" :error="errors.email">
            <UInput 
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              :disabled="loading"
              class="form-input"
              @blur="validateEmail"
            />
          </UFormGroup>
        </div>

        <div class="form-group">
          <UFormGroup label="Password" name="password" :error="errors.password">
            <UInput 
              v-model="form.password"
              type="password"
              placeholder="Create a password"
              :disabled="loading"
              class="form-input"
              @blur="validatePassword"
            />
          </UFormGroup>
        </div>

        <div class="form-group">
          <UFormGroup label="Confirm Password" name="confirmPassword" :error="errors.confirmPassword">
            <UInput 
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              :disabled="loading"
              class="form-input"
              @blur="validateConfirmPassword"
            />
          </UFormGroup>
        </div>

        <div class="form-actions">
          <UButton 
            type="submit" 
            :loading="loading"
            :disabled="!isFormValid || loading"
            class="register-button"
            block
          >
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </UButton>
        </div>

        <div class="form-footer">
          <p class="login-link">
            Already have an account? 
            <NuxtLink to="/login" class="link">Sign in here</NuxtLink>
          </p>
        </div>
      </form>

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
import { ref, computed } from 'vue'

// Define page meta
definePageMeta({
  auth: false, // Allow unauthenticated users
  layout: 'auth' // Use auth layout if you have one
})

// Form data
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Form state
const loading = ref(false)
const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const successMessage = ref('')
const errorMessage = ref('')

// Validation functions
const validateUsername = () => {
  if (!form.value.username) {
    errors.value.username = 'Username is required'
  } else if (form.value.username.length < 3) {
    errors.value.username = 'Username must be at least 3 characters'
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.value.username)) {
    errors.value.username = 'Username can only contain letters, numbers, and underscores'
  } else {
    errors.value.username = ''
  }
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = ''
  }
}

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.value.password)) {
    errors.value.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  } else {
    errors.value.password = ''
  }
}

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = ''
  }
}

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return form.value.username && 
         form.value.email && 
         form.value.password && 
         form.value.confirmPassword &&
         !errors.value.username &&
         !errors.value.email &&
         !errors.value.password &&
         !errors.value.confirmPassword
})

// Handle form submission
const handleRegister = async () => {
  // Clear previous messages
  successMessage.value = ''
  errorMessage.value = ''

  // Validate all fields
  validateUsername()
  validateEmail()
  validatePassword()
  validateConfirmPassword()

  if (!isFormValid.value) {
    errorMessage.value = 'Please fix the errors above'
    return
  }

  loading.value = true

  try {
    // Call your registration API endpoint
    const { data } = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      }
    })

    successMessage.value = 'Account created successfully! Please check your email to verify your account.'
    
    // Optional: Auto-redirect after successful registration
    setTimeout(() => {
      navigateTo('/login')
    }, 2000)

  } catch (error) {
    console.error('Registration error:', error)
    
    if (error.data?.message) {
      errorMessage.value = error.data.message
    } else if (error.statusCode === 409) {
      errorMessage.value = 'Username or email already exists'
    } else {
      errorMessage.value = 'An error occurred while creating your account. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgb(249 250 251); /* bg-gray-50 */
}

.register-card {
  width: 100%;
  max-width: 28rem; /* max-w-md */
  background-color: white;
  border: 2px solid rgb(209 213 219); /* border-gray-300 */
  border-radius: 0;
  box-shadow: none;
  border-style: inset;
}

.register-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  text-align: center;
  margin: 0;
}

.register-subtitle {
  font-size: 0.875rem;
  color: rgb(107 114 128); /* text-gray-500 */
  text-align: center;
  margin: 0.5rem 0 0 0;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

.register-form {
  padding: 1.5rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-actions {
  margin: 2rem 0 1.5rem 0;
}

.form-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgb(229 231 235); /* border-gray-200 */
}

.login-link {
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

:deep(.register-button) {
  background-color: rgb(29 78 216); /* bg-blue-700 */
  border: 2px solid rgb(29 78 216);
  border-radius: 0;
  color: white;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-weight: 600;
  padding: 0.75rem 1rem;
}

:deep(.register-button:hover:not(:disabled)) {
  background-color: rgb(30 64 175); /* bg-blue-800 */
  border-color: rgb(30 64 175);
}

:deep(.register-button:disabled) {
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