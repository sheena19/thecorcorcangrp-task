export interface Address {
  StreetNumber: string;
  StreetName: string;
  City: string;
}

export interface OpenHouse {
  Date: string;
  StartTime: string;
  EndTime: string;
}

export interface Listing {
  ID: string;
  Type: string;
  Transaction: string;
  Price: string;
  OpenHouses: OpenHouse[];
}

export interface Property {
  Address: Address;
}

export interface Item {
  Listing: Listing;
  Property: Property;
}
