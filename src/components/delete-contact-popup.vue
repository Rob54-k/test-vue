<template>
  <div>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Confirm delete {{ contact.name }}</h3>
          </div>
          <div class="btn-group">
            <button class="btn" @click="deleteContact()">Delete</button>
            <button class="btn" @click="$emit('hidePopup')">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "delete-contact-popup",
        props: ['contact'],
        methods: {
            async deleteContact () {
                let contacts = this.contacts;
                contacts = contacts.filter((item) => item.id !== this.contact.id);
                this.$store.commit('SET_CONTACTS', contacts);
                await this.$store.dispatch('deleteContactFromDb', { contact: this.contact });
                this.$emit('hidePopup');
            },
        },
        computed: {
            contacts () {
                return this.$store.state.contacts
            }
        },
    }
</script>

<style scoped>
  button {
    padding: 12px 23px;
    border-radius: 25px;
    background-color: #42b983;
    border: none;
    color: white;
    font-weight: bold;
    margin: 10px;
    cursor: pointer;
  }
  button:focus {
    outline: none;
  }
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.3s ease;
  }

  .modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
