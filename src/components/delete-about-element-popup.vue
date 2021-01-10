<template>
  <div>
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h3>Confirm delete</h3>
          </div>
          <div class="btn-group">
            <button class="btn" @click="deleteInfo()">Delete</button>
            <button class="btn" @click="$emit('hidePopup', 'deletePopupCancel')">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapActions} from "vuex";

    export default {
        name: "delete-about-element-popup",
        props: ['aboutItem', 'contact'],
        methods: {
            ...mapActions(['addContactToDb']),
            async deleteInfo () {
                let contacts = this.contacts;
                this.$store.commit('SET_LAST_ACTIVE', {infoElement: this.aboutItem, action: 'delete'});
                this.contact.aboutContact = this.contact.aboutContact.filter((item) => item.id !== this.aboutItem.id);
                contacts.forEach((item) => {
                    if (item.id === this.contact.id) {
                        item.aboutContact = this.contact.aboutContact;
                    }
                });
                await this.addContactToDb({ contact: this.contact });
                this.$store.commit('SET_CONTACTS', contacts);
                this.$emit('hidePopup', 'deletePopupCancel');
            },
        },
        computed: {
            contacts () {
                return this.$store.state.contacts
            }
        }
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
</style>
