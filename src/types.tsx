export interface Mandant {
  id: number;
  description: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
}

export interface UserInfo {
  id: string;
  kode: string;
  name: string;
  vorname: string;
  funktion?: any;
  prozentGruen: number;
  prozentGelb: number;
  benID: string;
  geschlecht: number;
  depotid: string;
  barcode?: any;
  teamids: string;
  modifydate: string;
  inaktiv: number;
  mitarbzeitmontag: number;
  mitarbzeitdienstag: number;
  mitarbzeitmittwoch: number;
  mitarbzeitdonnerstag: number;
  mitarbzeitfreitag: number;
  mitarbzeitsamstag: number;
  mitarbzeitsonntag: number;
  mitarboutlookname?: any;
  firmaid: string;
  adrid?: any;
  sprid?: any;
  suchbegriff?: any;
  bezeichnung?: any;
  zusatz?: any;
  strasse?: any;
  hausnummer?: any;
  land?: any;
  plz?: any;
  ort?: any;
  provinz?: any;
  isonr?: any;
  mwstnr?: any;
  steuernr?: any;
  telefon?: any;
  fax?: any;
  email: string;
  url?: any;
  maplat: number;
  maplong: number;
  maplatlongstatus: number;
  gesperrt: string;
  anredeAdresse?: any;
  emailpec?: any;
  verbintyp: number;
}

export interface Expense {
  id: string;
  description: string;
  description2: string;
  price: string;
  date: Date;
}

export interface CustomerDto {
  id: string;
  description: string;
}
export interface ExpenseDetail {
  id: string;
  date: Date;
  docNumber: string;
  expensesType: string;
  expensesTypeId: string;
  description: string;
  reason: string;
  paymentType: string;
  paymentTypeId: string;
  price: string;
  annotation: string;
  images: string[];
  companyPays: boolean;
  customer: CustomerDto;
  km: number;
  fromTo: string;
  ammount: number;
  currencyId: string;
}

export interface ExpenseType {
  id: string;
  description: string;
  type: number;  // 1 = spesen , 2 km
  suggestedPrice: number;
}

export interface PaymentType {
  id: string;
  description: string;
  label: string;  // for radio button
}

export interface Currency {
  id: string;
  description: string;
  defaultCurrency: string;
  symbol: string;
}

export interface ServerSettings {
  isCustomerEnabled: boolean;
  hasUploadImagePermission: boolean;
  hasFormRecognition: boolean;
  resizeImage: { maxWidth: number, maxHeight: number, quality: number }
}

export interface Customer {
  id: string;
  description: string;
}
export interface Company {
  id: string;
  description: string;
}

export interface PostExpense {
  date: Date;
  docnumber: string;
  ExpensesTypeId: string;
  description: string;
  reason: string;
  paymentType: string;
  price: number;
  CurrencyID: string;
  annotation: string;
  images: string[];
  companyPays: boolean;
  CustomerID: string;
  km: number;
  fromTo: string;
}

export interface PostImage {
  id: string;
  image: string;
  fileName?: string;
}

export interface ImageWithId {
  image: string,
  id: string
}

export interface FormRecognition {
  image: string;
}
