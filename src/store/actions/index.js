import * as appActions from './app';

import * as cardBlockActions from './cardBlock';

import * as globalActions from './global';

export default { ...appActions, ...cardBlockActions, ...globalActions };
