import Groups            from './Groups.vue';
import GroupsCreate      from './GroupsCreate.vue';
import GroupsList        from './GroupsList.vue';
import GroupsEdit        from './GroupsEdit.vue';
import GroupsEditObject  from './GroupsEditObject.vue';
import GroupsEditMembers from './GroupsEditMembers.vue';

export default [
    {
        path     : '/groups',
        component: Groups,
        children : [
            { path: '', component: GroupsList },
            { path: 'create', component: GroupsCreate }
        ]
    },
    {
        path     : '/groups/edit/:id',
        component: GroupsEdit,
        children : [
            { path: '', component: GroupsEditObject },
            { path: 'members', component: GroupsEditMembers }
        ]
    }
];
