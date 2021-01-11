<template>
  <div>
    <div class="contact">
      <div class="header">
        <div class="back-to-contact-list">
          <img src="../assets/back.png" alt="" @click="backToContactList()">
        </div>
        About {{ contact.name }}
      </div>
      <div class="added-info">
        <form @submit.prevent="addedField">
          <div class="input-block">
            <input type="text" placeholder="Name field" v-model.trim="newField.name">
            <input type="text" placeholder="Value" v-model.trim="newField.value">
          </div>
          <div class="btn-submit">
            <button>Added</button>
          </div>
        </form>
      </div>
      <div class="about-contact-field" v-for="(info,i) in contact.aboutContact" :key="i">
        <div class="about-info-block" v-if="info.id !== editedItem.id">
          <div class="field-name">{{ info.name }}</div>
          <div class="field-value">{{ info.value }}</div>
          <div class="delete-icon" @click="deleteInfo(info)"><img src="../assets/delete.png" alt=""></div>
          <div class="edit-block">
            <img @click="showEditBlock(info)" src="../assets/edit.png" alt="">
          </div>
        </div>
        <div class="edit-block-field" v-if="info.id === editedItem.id">
          <input type="text" placeholder="New field name" v-model.trim="editedItem.name">
          <input type="text" placeholder="New value" v-model.trim="editedItem.value">
          <div class="btn-group">
            <button @click="correctInfo()">Save</button>
            <button @click="showCancelPopup = true">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <div class="undo-btn">
      <button class="btn" @click="stepBack()" v-if="lastAction">Undo</button>
    </div>
    <delete-about-element-popup
      v-if="showDeletePopup"
      :aboutItem="deleteAboutElement"
      :contact="contact"
      v-on:hidePopup="hidePopup($event)"
    />
    <edit-info-cancel-popup
      v-if="showCancelPopup"
      v-on:hideCancelPopup="hidePopup($event)"
    />
  </div>
</template>

<script>
    import {mapActions} from "vuex";
    import DeleteAboutElementPopup from '../components/delete-about-element-popup';
    import EditInfoCancelPopup from '../components/edit-info-cancel-popup';

    export default {
        name: "contact",
        components: {DeleteAboutElementPopup, EditInfoCancelPopup},
        methods: {
            ...mapActions(['getContacts', 'addContactToDb']),
            async addedField() {
                if (!this.newField.name || !this.newField.value) {
                    return;
                }
                this.newField.id = Date.now();
                let newField = this.newField;
                this.$store.commit('SET_LAST_ACTIVE', {infoElement: newField, action: 'added'});

                this.contact.aboutContact.push(newField);

                this.$store.commit('SET_CONTACTS', this.contacts);
                await this.addContactToDb({ contact: this.contact });
                this.newField = {};
            },
            deleteInfo(info) {
                this.deleteAboutElement = info;
                this.showDeletePopup = true;
            },
            hidePopup(event) {
                switch (event) {
                    case ('correctCancel'):
                        this.showCancelPopup = false;
                        this.editedIndex = -1;
                        this.editedItem = {};
                        break;
                    case ('continueCorrect'):
                        this.showCancelPopup = false;
                        break;
                    case ('deletePopupCancel'):
                        this.showDeletePopup = false;
                        break;
                }
            },
            async stepBack() {
                let contacts = this.contacts;
                switch (this.lastAction.action) {
                    case "added":
                        this.contact.aboutContact = this.contact.aboutContact.filter((item) => item.id !== this.lastAction.infoElement.id);
                        contacts.forEach((item) => {
                            if (item.id === this.contact.id) {
                                item.aboutContact = this.contact.aboutContact;
                            }
                        });
                        await this.addContactToDb({ contact: this.contact });
                        this.$store.commit('SET_CONTACTS', contacts);
                        break;
                    case "delete":
                        this.contact.aboutContact.push(this.lastAction.infoElement);
                        this.$store.commit('SET_CONTACTS', contacts);
                        await this.addContactToDb({ contact: this.contact });
                        break;
                    case "edit":
                        this.contact.aboutContact.forEach((item) => {
                            if (item.id === this.lastAction.infoElement.id) {
                                item.name = this.lastAction.infoElement.name;
                                item.value = this.lastAction.infoElement.value;
                            }
                        });
                        this.$store.commit('SET_CONTACTS', contacts);
                        await this.addContactToDb({ contact: this.contact });
                        break;
                }
                this.$store.commit('SET_LAST_ACTIVE', null);
            },
            async correctInfo() {
                if (!this.editedItem.name || !this.editedItem.value) {
                    return;
                }
                if (this.editedIndex !== -1) {
                    await this.$store.commit('SET_LAST_ACTIVE', {infoElement: this.oldDataInfoElement, action: 'edit'});
                    Object.assign(this.contact.aboutContact[this.editedIndex], this.editedItem);
                }
                this.$store.commit('SET_CONTACTS', this.contacts);
                await this.addContactToDb({ contact: this.contact });
                this.editedIndex = -1;
                this.editedItem = {};
            },
            showEditBlock(info) {
                this.oldDataInfoElement = Object.assign({}, info);
                this.editedItem = Object.assign({}, info);
                this.editedIndex = this.contact.aboutContact.indexOf(info);
            },
            backToContactList() {
                this.$router.push('/');
            }
        },
        data() {
            return {
                contact: {},
                newField: {},
                showDeletePopup: false,
                showCancelPopup: false,
                deleteAboutElement: {},
                editedItem: {},
                editedIndex: -1,
                oldDataInfoElement: {}
            }
        },
        computed: {
            contacts () {
                return this.$store.state.contacts
            },
            lastAction () {
                return this.$store.state.lastAction
            }
        },
        async created() {
            await this.getContacts();
            this.contact = this.contacts.find((item) => item.id === Number(this.$route.params.id));
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
.contact {
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #42b983;
    font-weight: bold;
    font-size: 2rem;
    .back-to-contact-list {
      margin-right: 15px;
      display: flex;
      align-items: center;
      img {
        cursor: pointer;
        height: 35px;
        width: 35px;
      }
    }
  }
  .added-info {
    display: flex;
    justify-content: center;
    form {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      align-items: center;
      .input-block {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }

  .about-contact-field {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    .about-info-block {
      display: flex;
      align-items: center;
      .field-name {
        margin-right: 10px;
        font-size: 1.2rem;
      }
      .field-value {
        font-size: 1.2rem;
      }
      .edit-block {
        margin-left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      .delete-icon {
        margin-left: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
    .edit-block-field {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .btn-group {
        button {
          margin: 5px;
        }
      }
    }
  }
}
.undo-btn {
  margin-top: 40px;
}
</style>
