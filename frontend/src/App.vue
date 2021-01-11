<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vit2e" />
  <SimpleForm :action='(data) => $api.authService.login(data)'>

    <template v-slot:fields='props'>
      <input  type="username" v-model='props.fields.username'>
      <input  type="password" v-model='props.fields.password'>
    </template>
  </SimpleForm>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import SimpleForm from './components/form/SimpleForm.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    SimpleForm
  }
}
</script>
