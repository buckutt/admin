import account      from './components/account/routes';
import alerts       from './components/alerts/routes';
import articles     from './components/articles/routes';
import categories   from './components/categories/routes';
import dashboard    from './components/dashboard/routes';
import devices      from './components/devices/routes';
import events       from './components/events/routes';
import fundations   from './components/fundations/routes';
import groups       from './components/groups/routes';
import home         from './components/home/routes';
import logout       from './components/logout/routes';
import participants from './components/participants/routes';
import periods      from './components/periods/routes';
import points       from './components/points/routes';
import promotions   from './components/promotions/routes';
import purchases    from './components/purchases/routes';
import treasury     from './components/treasury/routes';
import users        from './components/users/routes';
import webservices  from './components/webservices/routes';
import wikets       from './components/wikets/routes';

export default [].concat(
    account,
    alerts,
    articles,
    categories,
    dashboard,
    devices,
    events,
    fundations,
    groups,
    home,
    logout,
    participants,
    periods,
    points,
    promotions,
    purchases,
    treasury,
    users,
    webservices,
    wikets
);
