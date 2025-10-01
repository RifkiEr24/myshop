<script lang="ts" setup>
import Button from '@/components/ui/button/Button.vue';
import { FormField } from '@/components/ui/form';
import FormControl from '@/components/ui/form/FormControl.vue';
import FormItem from '@/components/ui/form/FormItem.vue';
import FormLabel from '@/components/ui/form/FormLabel.vue';
import FormMessage from '@/components/ui/form/FormMessage.vue';
import Input from '@/components/ui/input/Input.vue';

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import z from 'zod';

import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const auth = useAuthStore();
const submitError = ref<string>("");

const schema = toTypedSchema(z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
}));

const form = useForm({
  validationSchema: schema,
  initialValues: { username: '', password: '' },
});

const onSubmit = form.handleSubmit(async (values) => {
  submitError.value = "";
  try {
    await auth.signIn(values.username, values.password);
    router.push({ path: '/' }); 
  } catch (e: any) {
    console.log(e)
    submitError.value = e?.response?.data?.message ?? 'Login failed. Check your credentials.';
  }
});
</script>

<template>
  <div class="min-h-[100vh] flex items-center justify-center">
    <div class="border p-10 rounded-lg shadow-lg w-[360px]">
      <div class="text-lg font-semibold mb-4">Myshop Login Page</div>

      <form @submit="onSubmit" class="space-y-4">
        <FormField v-slot="{ componentField }" name="username">
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Enter Username Here" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Enter Password Here" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" :disabled="form.isSubmitting.value">
          <span v-if="form.isSubmitting.value">Signing in…</span>
          <span v-else>Submit</span>
        </Button>

        <p v-if="submitError" class="text-sm text-red-600 mt-2">{{ submitError }}</p>
      </form>
    </div>
  </div>
</template>
