export class EmergencyLocationDto {
  lat?: number;
  lng?: number;
  accuracy?: number;
  timestamp?: number;
}

export class EmergencyDto {
  location?: EmergencyLocationDto;
}
