import io from 'socket.io-client';

import { modelTocommit } from '../../lib/storeUtils.js';

export function registerModels({ commit, state }, routes) {
    state.changes.socket.emit('listen', routes);

    state.changes.socket.on('listening', (models) => {
        const modelsToRoutes = {};
        models.forEach((model, index) => {
            console.log(`Listen to ${model} changes`);
            modelsToRoutes[model] = routes[index];
        });
        commit('ADDMODELSTOROUTES', modelsToRoutes);
    });
}

export function initListeners({ commit, state }) {
    state.changes.socket.on('create', (doc) => {
        const route = state.changes.modelsToRoutes[doc.model];
        if (state.objects[route].findIndex(object => (object.id === doc.data.id)) === -1) {
            commit(modelTocommit[route].add, [doc.data]);
        }
    });

    state.changes.socket.on('update', (doc) => {
        const route = state.changes.modelsToRoutes[doc.model];
        const index = state.objects[route].findIndex(object => (object.id === doc.data.to.id));

        if (index !== -1) {
            if (doc.data.to.isRemoved) {
                commit(modelTocommit[route].delete, doc.data.to);
            } else if (state.objects[route][index].editedAt !== doc.data.to.editedAt) {
                commit(modelTocommit[route].update, doc.data.to);
            }
        }
    });

    state.changes.socket.on('delete', (doc) => {
        const route = state.changes.modelsToRoutes[doc.model];

        if (state.objects[route].findIndex(object => (object.id === doc.data.id)) !== -1) {
            commit(modelTocommit[route].delete, doc.data);
        }
    });
}

export function initSocket({ commit, state }, token) {
    commit('CHANGESOCKET', io(config.api, {
        transportOptions: {
            polling: {
                extraHeaders: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    }));

    state.changes.socket.on('connected', () => {
        initListeners({ commit, state });
    });

    state.changes.socket.on('APIError', (error) => {
        console.error(error);
    });
}

export function closeSocket({ commit, state }) {
    state.changes.socket.close();

    commit('REMOVESOCKET');
}
