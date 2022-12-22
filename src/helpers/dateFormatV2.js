import moment from 'moment';
export default function (value) {
  return value ? moment(String(value)).format('DD/MM/YYYY') : 'Unknow';
}
