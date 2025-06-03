<template>
  <div class="register-container">
    <UCard class="register-card">
      <template #header>
        <h2 class="register-title">Create Your Account</h2>
        <p class="register-subtitle">Join PlayEngine and start building amazing games</p>
      </template>

      <UForm 
        :schema="schema" 
        :state="state" 
        @submit="handleRegister"
        class="register-form"
      >
        <div class="form-group">
          <UFormGroup label="Username" name="username">
            <UInput 
              v-model="state.username"
              placeholder="Enter your username"
              :disabled="loading"
              class="form-input"
            />
          </UFormGroup>
        </div>

        <div class="form-group">
          <UFormGroup label="Email Address" name="email">
            <UInput 
              v-model="state.email"
              type="email"
              placeholder="Enter your email"
              :disabled="loading"
              class="form-input"
            />
          </UFormGroup>
        </div>

        <div class="form-group">
          <UFormGroup label="Password" name="password">
            <UInput 
              v-model="state.password"
              type="password"
              placeholder="Create a password"
              :disabled="loading"
              class="form-input"
            />
          </UFormGroup>
        </div>

        <div class="form-group">
          <UFormGroup label="Confirm Password" name="confirmPassword">
            <UInput 
              v-model="state.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              :disabled="loading"
              class="form-input"
            />
          </UFormGroup>
        </div>

        <div class="form-actions">
          <UButton 
            type="submit" 
            :loading="loading"
            :disabled="loading"
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
import { z } from "zod";

// Define page meta
definePageMeta({
	auth: false,
	layout: "auth",
});

const schema = z
	.object({
		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.regex(
				/^[a-zA-Z0-9_]+$/,
				"Username can only contain letters, numbers, and underscores",
			),
		email: z.string().email("Please enter a valid email address"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(
				/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Password must contain at least one uppercase letter, one lowercase letter, and one number",
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

// Form state
const state = reactive({
	username: "",
	email: "",
	password: "",
	confirmPassword: "",
});

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Handle form submission
const handleRegister = async (event) => {
	// Clear previous messages
	successMessage.value = "";
	errorMessage.value = "";

	loading.value = true;

	try {
		// The form data is already validated by Zod at this point
		const validatedData = event.data;

		// Call your registration API endpoint
		const { data } = await $fetch("/api/auth/register", {
			method: "POST",
			body: {
				username: validatedData.username,
				email: validatedData.email,
				password: validatedData.password,
			},
		});

		successMessage.value =
			"Account created successfully! Please check your email to verify your account.";

		setTimeout(() => {
			navigateTo("/login");
		}, 2000);
	} catch (error) {
		console.error("Registration error:", error);

		if (error.data?.message) {
			errorMessage.value = error.data.message;
		} else if (error.statusCode === 409) {
			errorMessage.value = "Username or email already exists";
		} else {
			errorMessage.value =
				"An error occurred while creating your account. Please try again.";
		}
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgb(249 250 251);
}

.register-card {
  width: 100%;
  max-width: 28rem;
  background-color: white;
  border: 2px solid rgb(209 213 219);
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
  color: rgb(107 114 128);
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
  border-top: 1px solid rgb(229 231 235);
}

.login-link {
  font-size: 0.875rem;
  color: rgb(107 114 128);
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  margin: 0;
}

.link {
  color: rgb(29 78 216);
  text-decoration: underline;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
}

.link:hover {
  background-color: rgb(254 249 195);
}

.link:visited {
  color: rgb(91 33 182);
}

.alert {
  margin-top: 1rem;
}

:deep(.card .card-header) {
  background-color: rgb(229 231 235);
  border-bottom: 1px solid rgb(209 213 219);
  padding: 1.5rem;
  margin: -1.5rem -1.5rem 0 -1.5rem;
}

:deep(.register-button) {
  background-color: rgb(29 78 216);
  border: 2px solid rgb(29 78 216);
  border-radius: 0;
  color: white;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-weight: 600;
  padding: 0.75rem 1rem;
}

:deep(.register-button:hover:not(:disabled)) {
  background-color: rgb(30 64 175);
  border-color: rgb(30 64 175);
}

:deep(.register-button:disabled) {
  background-color: rgb(156 163 175);
  border-color: rgb(156 163 175);
  cursor: not-allowed;
}

:deep(.form-input input) {
  border: 2px solid rgb(209 213 219);
  border-radius: 0;
  font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 0.875rem;
}

:deep(.form-input input:focus) {
  border-color: rgb(29 78 216);
  box-shadow: 0 0 0 1px rgb(29 78 216);
}
</style>
