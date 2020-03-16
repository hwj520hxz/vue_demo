import Vue from 'vue'
import { currency } from './currency'
import { dateTime } from './datetime'
import { cron } from './cron'
import { emptyFilter } from './emptyFilter'
import { thousandMark } from './thousandMark'
Vue.filter('cron', cron)
Vue.filter('currency', currency)
Vue.filter('dateTime', dateTime)
Vue.filter('emptyFilter', emptyFilter)
Vue.filter('thousandMark', thousandMark)
