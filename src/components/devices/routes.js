import Devices                from './Devices.vue';
import DevicesCreate          from './DevicesCreate.vue';
import DevicesList            from './DevicesList.vue';
import DevicesEdit            from './DevicesEdit.vue';
import DevicesEditAssign      from './DevicesEditAssign.vue';
import DevicesEditObject      from './DevicesEditObject.vue';
import DevicesEditSsl         from './DevicesEditSsl.vue';

export default [
    {
        path     : '/devices',
        component: Devices,
        children : [
            { path: '', component: DevicesList },
            { path: 'create', component: DevicesCreate }
        ]
    },
    {
        path     : '/devices/edit/:id',
        component: DevicesEdit,
        children : [
            { path: '', component: DevicesEditObject },
            { path: 'assign', component: DevicesEditAssign },
            { path: 'ssl', component: DevicesEditSsl }
        ]
    }
];
