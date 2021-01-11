import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api/idb'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    contacts: [],
    lastAction: null
  },
  mutations: {
    SET_CONTACTS (state, contacts) {
      state.contacts = contacts;
    },
    SET_LAST_ACTIVE (state, lastAction) {
      state.lastAction = lastAction;
    },
    APPEND_CONTACT (state, name) {
      state.contacts.push({id: state.contacts.length + 1, name: name, aboutContact: []});
    }
  },
  actions: {
    addContactToDb ({ commit }, { contact }) {
      return api.saveContact(contact);
    },
    async getContacts ({ commit }) {
      let contacts = await api.getContacts();
      commit('SET_CONTACTS', contacts);
    },
    deleteContactFromDb ({ commit }, { contact }) {
      return api.deleteContact(contact)
    },
  },
  modules: {
  }
})
