const DB_NAME = 'contactsdb';
const STORAGE_NAME = 'contacts';
const DB_VERSION = 1;
let DB;

export default {
    async getDb () {
        return new Promise((resolve, reject) => {
            if (DB) {
                return resolve(DB);
            }
            const request = window.indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = e => {
                console.log('Error opening db', e);
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('Error');
            };

            request.onsuccess = e => {
                DB = e.target.result;
                resolve(DB);
            };

            request.onupgradeneeded = e => {
                let db = e.target.result;
                db.createObjectStore(STORAGE_NAME, { autoIncrement: true, keyPath: 'id' });
            }
        })
    },
    async deleteContact (contact) {
        const db = await this.getDb();

        return new Promise(resolve => {
            const trans = db.transaction([STORAGE_NAME], 'readwrite');
            trans.oncomplete = () => {
                resolve();
            };

            const store = trans.objectStore(STORAGE_NAME);
            store.delete(contact.id);
        })
    },
    async getContacts () {
        let db = await this.getDb();

        return new Promise(resolve => {
            let trans = db.transaction([STORAGE_NAME], 'readonly');
            trans.oncomplete = () => {
                resolve(contacts);
            };

            const store = trans.objectStore(STORAGE_NAME);
            const contacts = [];

            store.openCursor().onsuccess = e => {
                const cursor = e.target.result;
                if (cursor) {
                    contacts.push(cursor.value);
                    cursor.continue();
                }
            };
        })
    },
    async saveContact (contact) {
        let db = await this.getDb();

        return new Promise(resolve => {
            let trans = db.transaction([STORAGE_NAME], 'readwrite');
            trans.oncomplete = () => {
                resolve()
            };

            let store = trans.objectStore(STORAGE_NAME);
            store.put(contact);
        })
    }
}
