module.exports.ERRORS = {
  PASSWORD_INVALID: 'The password should be at least of six characters with 1 capital letter and 1 digit.',
  ACCOUNT_EXISTS: 'User with this email/username already exists.',
  USER_NOT_REGISTERED: 'User is not registered.',
  USER_INACTIVE: 'Your account has been deactivated. Please contact administrator.',
  INVALID_CREDENTIALS: 'You have entered invalid credentials.',
  NOT_ADMIN: 'Only admin can perform this action.',
  NOT_AUTHORIZED: 'You are not authorized user to view this content. Please contact administrator.',
  NO_ROOFTOP_ASSIGNED: 'You do not have any rooftop assigned. Please contact administrator.',
  SELECT_ROOFTOP: 'Please select rooftop.',
  SELECT_VALID_ROOFTOP: 'Please select valid rooftop. Unable to connect inventory database.',
  DATA_NOT_FOUND: 'Data not found.',
  INTERNAL_SERVER: 'The server encountered an internal error and was unable to complete your request. Please contact administrator.'
};

module.exports.MESSAGES = {
  PASSWORD_UPDATED: 'Password updated successfully.',
  ACCOUNT_UPDATED: 'Account information updated successfully.',
  LOGGED_IN: 'Successfully logged in',
  DATA_SAVED: 'Data saved successfully.',
  DATA_UPDATED: 'Data updated successfully.',
  DATA_DELETED: 'Data deleted successfully.'
};

module.exports.ROLES = ['dealerAssociate', 'dealerManager', 'dealerAdmin', 'vifAssociate', 'vifManager', 'vifAdmin'];

module.exports.AD_SOURCE_TYPES = {
  TV: 'TV',
  RADIO: 'Radio',
  NEWSPAPER: 'Newspaper',
  INTERNET: 'Internet',
  BILLBOARD: 'Billboard',
  LOCATION: 'Location',
  MAGAZINE: 'Magazine',
  DIRECT_MAIL: 'Direct Mail',
  EVENT: 'Event'
};

module.exports.CRM_PROVIDER_FILE_TYPES = {
  ADF: 'ADF/XML',
  STAR: 'STAR/XML',
  HTML: 'HTML',
  TXT: 'TXT'
};

module.exports.SEARCH_FIELDS = {
  'Name': 'name',
  'First Name': 'name.first',
  'Last Name': 'name.last',
  'Address': 'address',
  'Phone': 'phone',
  'Email': 'email'
};

module.exports.PHONE_NUMBER_TYPES = {
  CELL: 'Cell',
  HOME: 'Home',
  WORK: 'Work',
  DIRECT: 'Direct'
};

module.exports.USER_RELATIONSHIPS = {
  FATHER: 'Father',
  MOTHER: 'Mother',
  SPOUSE: 'Spouse',
  BROTHER: 'Brother',
  SISTER: 'Sister',
  SON: 'Son',
  DAUGHTER: 'Daughter',
  BOY_FRIEND: 'Boy Friend',
  GIRL_FRIEND: 'Girl Friend',
  FRIEND: 'Friend',
  NEIGHBOR: 'Neighbor',
  PARTNER: 'Partner'
};

module.exports.USER_PERMISSIONS = {
  VIEW_CUSTOMERS: 'View Customers',
  EDIT_CUSTOMERS: 'Edit Customers',
  EDIT_FINANCE_TERMS: 'Edit Finance Terms',
  ADD_SOURCE: 'Add Source',
  UPDATE_RESULTS: 'Update Results',
  DESK_DEAL: 'Desk Deal',
  ADD_APPRAISAL: 'Add Appraisal',
  ADD_USERS: 'Add Users',
  EDIT_ROAD_TO_SALE: 'Edit Road To Sale',
  EDIT_INVENTORY: 'Edit Inventory',
  VIEW_VEHICLE_COST: 'View Vehicle Cost'
};

module.exports.DEPARTMENTS = {
  GENERAL: 'General',
  SALES: 'Sales',
  SERVICE: 'Service',
  PARTS: 'Parts'
};

module.exports.ACTIVITY_TYPES = {};

module.exports.SALE_TYPES = {
  CASH: 'Cash',
  FINANCE: 'Finance',
  LEASE: 'Lease',
  WHOLESALE: 'Wholesale'
};

module.exports.CUSTOMER_RELATIONSHIPS = {
  FATHER: 'Father',
  MOTHER: 'Mother',
  SPOUSE: 'Spouse',
  BROTHER: 'Brother',
  SISTER: 'Sister',
  SON: 'Son',
  DAUGHTER: 'Daughter',
  BOY_FRIEND: 'Boy Friend',
  GIRL_FRIEND: 'Girl Friend',
  FRIEND: 'Friend',
  NEIGHBOR: 'Neighbor',
  PARTNER: 'Partner',
  CO_BUYER: 'co-buyer'
};

module.exports.CUSTOMER_STAGES = {
  OPPORTUNITY: 'Opportunity',
  PROSPECT: 'Prospect',
  SOLD: 'Sold',
  SERVICE: 'Service',
  PARTS: 'Parts',
  ACCESSORIES: 'Accessories',
  INACTIVE: 'Inactive',
  FUTURE: 'Future'
};

module.exports.CUSTOMER_RESULTS = {
  ANGRY: 'Angry',
  BUSTED_DEAL: 'Busted Deal',
  CANNOT_FINANCE: 'Cannot Finance',
  DELIVERY_ONLY: 'Delivery Only',
  FACTORY_ORDER: 'Factory Order',
  DELIVERED: 'Delivered',
  DEPOSIT: 'Deposit',
  HAD_TO_RUN: 'Had to Run',
  HOT_PROSPECTS: 'Hot Prospects',
  IN_FOR_PARTS: 'In For Parts',
  IN_FOR_SERVICE: 'In For Service',
  JUST_LOOKING: 'Just Looking',
  NEEDS_SPOUSE: 'Needs Spouse',
  NO_COMMITMENT: 'No Commitment',
  NO_MONEY: 'No Money',
  UNREALISTIC: 'Unrealistic',
  UPSIDE_DOWN: 'Upside Down',
  WANTS_SPECIFIC: 'Wants Specific'
};

module.exports.INTEREST_TYPES = {
  DESIRE: 'Desire',
  TRADE_IN: 'TradeIn'
};

module.exports.VEHICLE_TYPES = {
  CAR: 'Car',
  TRUCK: 'Truck',
  VAN: 'Van',
  SUV: 'SUV',
  BOAT: 'Boat',
  MOTORCYCLE: 'Motorcycle'
};

module.exports.STATUS_TYPES = {
  TRANSPORTING: 'Transporting',
  AVAILABLE: 'Available',
  PENDING: 'Pending',
  SOLD: 'Sold',
  TRADE_IN: 'TradeIn',
  WHOLESALE: 'Wholesale',
  DEMO: 'Demo',
  APPRAISAL: 'Appraisal',
  CONSIGNMENT: 'Consignment',
  SERVICE_LOANER: 'Service Loaner',
  SERVICE_WARRANTY: 'Service Warranty',
  SERVICE_INTERNAL: 'Service Internal',
  SERVICE_CUSTOMER_PAY: 'Service Customer Pay'
};

module.exports.STOCK_TYPES = {
  NEW: 'New',
  USED: 'Used',
  DEMO: 'Demo',
  WHOLESALE: 'Wholesale'
};

module.exports.LOG_TYPES = {
  NEW_VISIT: 'UP',
  BE_BACK: 'BB',
  PHONE_UP: 'PU',
  INTERNET_LEAD: 'IL',
  SERVICE: 'S'
};

module.exports.ROAD_TO_SALE_STATUSES = {
  NONE: 'None',
  LIKE: 'Like',
  DISLIKE: 'Dislike'
};
