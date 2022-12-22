import moment from 'moment';
export default function (value) {
  return value
    ? moment(String(value)).format('hh:mm:ssA-DD/MM/YYYY')
    : 'Unknow';
}
