<template>
  <div class="container">
    <div class="header">
      <div class="title">Contacts</div>
      <div class="add-contact">
        <input v-model="nameContact" type="text" placeholder="Name of contact">
        <button class="btn" @click="addContact(nameContact)">Add contact</button>
      </div>
    </div>
    <hr>
    <div class="contacts">
      <ul>
        <li v-for="(contact, i) of contacts" :key="i">
          <router-link :to="`/contact/${contact.id}`">
            {{ contact.name }}
          </router-link>
          <div class="delete-icon" @click="deleteContact(contact)"><img src="../assets/delete.png" alt=""></div>
        </li>
      </ul>
    </div>
    <delete-contact-popup v-if="showPopup" :contact="selectedContact" v-on:hidePopup="hidePopup()"/>
  </div>
</template>

<script lang="ts">
    import { mapActions } from 'vuex'
    import DeleteContactPopup from "../components/delete-contact-popup.vue";

    export default {
        name: "contact-list",
        components: {DeleteContactPopup},
        data() {
            return {
                nameContact: '',
                showPopup: false,
                selectedContact: {}
            }
        },
        methods: {
            ...mapActions(['getContacts', 'addContactToDb']),
            async deleteContact (contact) {
                this.showPopup = true;
                this.selectedContact = contact;
            },
            async addContact (name) {
                if (!name.trim()) {
                    return;
                }
                await this.addContactToDb({contact: {id: this.contacts.length + 1, name, aboutContact: []}});
                this.$store.commit('APPEND_CONTACT', name);
                this.nameContact = '';
            },
            hidePopup() {
                this.showPopup = false;
            }
        },
        computed: {
            contacts () {
                return this.$store.state.contacts
            }
        },
        async created () {
            await this.getContacts();
        }
    }
</script>

<style lang="scss" scoped>
  button {
    padding: 12px 23px;
    border-radius: 25px;
    background-color: #42b983;
    border: none;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }
  button:focus {
    outline: none;
  }
  input {
    padding: 10px;
    border-radius: 25px;
    border: 2px solid #42b983;
    margin: 15px;
  }
  input:focus {
    outline: none;
  }
  .container {
    text-align: center;
    margin: 0 auto;

    .header {
      margin: 0 auto;
      color: #42b983;
      font-weight: bold;
      .title {
        font-size: 2rem;
        text-align: center;
      }
      .add-contact {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
      }
    }
    .contacts {
      ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        li {
          font-size: 1.3rem;
          display: flex;
          a {
            text-decoration: none;
            color: #504e4e;
          }
          .delete-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
