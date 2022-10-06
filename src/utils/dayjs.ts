import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear'
import * as weekday from 'dayjs/plugin/weekday'
import 'dayjs/locale/ru'

dayjs.extend(weekday)
dayjs.extend(isLeapYear)
dayjs.locale('ru')

export default dayjs
