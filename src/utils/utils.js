function toIndianDateFormat(mongoDate) {
  const date = new Date(mongoDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;

}

function getInitials(name) {
  const nameArray = name?.split(' ')
  const intialsArray = nameArray?.map((n) => n[0])
  return intialsArray?.join('')
}


export {
  toIndianDateFormat,
  getInitials
}
