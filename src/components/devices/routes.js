import Devices           from './Devices.vue';
import DevicesCreate     from './DevicesCreate.vue';
import DevicesList       from './DevicesList.vue';

import DeviceShow        from './device/DeviceShow.vue';
import DeviceShowDetails from './device/DeviceShowDetails.vue';
import DeviceEditAssign  from './device/DeviceEditAssign.vue';
import DeviceEditObject  from './device/DeviceEditObject.vue';
import DeviceEditSsl     from './device/DeviceEditSsl.vue';

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
        path     : '/devices/:id',
        component: DeviceShow,
        children : [
            { path: '', component: DeviceShowDetails },
            { path: 'edit', component: DeviceEditObject },
            { path: 'assign', component: DeviceEditAssign },
            { path: 'ssl', component: DeviceEditSsl }
        ]
    }
];
