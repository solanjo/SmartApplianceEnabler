import {HttpElectricityMeter} from '../../../../../main/angular/src/app/meter-http/http-electricity-meter';
import {MeterValueName} from '../../../../../main/angular/src/app/meter/meter-value-name';
import {HttpReadValue} from '../../../../../main/angular/src/app/http-read-value/http-read-value';
import {HttpRead} from '../../../../../main/angular/src/app/http-read/http-read';

export const httpMeter_2HttpRead_complete = new HttpElectricityMeter({
  httpReads: [
    new HttpRead({
      url: 'http://fritz.box/power',
      readValues: [
        new HttpReadValue({
          name: MeterValueName.Power,
          data: 'GET_POWER',
          path: '$.dws',
          extractionRegex: ',.Power.:(\\d+)',
          factorToValue: 10
        })
      ]
    }),
    new HttpRead({
      url: 'http://fritz.box/energy',
      readValues: [
        new HttpReadValue({
          name: MeterValueName.Energy,
          data: 'GET_ENERGY',
          path: '$.des',
          extractionRegex: ',.Energy.:(\\d+)',
          factorToValue: 0.1
        })
      ]
    })
  ]
});
