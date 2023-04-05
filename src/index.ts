import EnvLoader from './class/EnvLoader';
EnvLoader.load();

import moment from 'moment-timezone';
moment.locale('id');
moment.tz.setDefault(`America/Porto_Velho`);

import client from './client';
client.start();