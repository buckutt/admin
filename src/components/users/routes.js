import Users           from './Users.vue';
import UsersCreate     from './UsersCreate.vue';
import UsersList       from './UsersList.vue';
import UsersEdit       from './UsersEdit.vue';
import UsersEditObject from './UsersEditObject.vue';
import UsersEditMol    from './UsersEditMol.vue';
import UsersEditRights from './UsersEditRights.vue';
import UsersEditGroups from './UsersEditGroups.vue';

export default [
    {
        path     : '/users',
        component: Users,
        children : [
            { path: '', component: UsersList },
            { path: 'create', component: UsersCreate }
        ]
    },
    {
        path     : '/users/edit/:id',
        component: UsersEdit,
        children : [
            { path: '', component: UsersEditObject },
            { path: 'mol', component: UsersEditMol },
            { path: 'rights', component: UsersEditRights },
            { path: 'groups', component: UsersEditGroups }
        ]
    }
];
