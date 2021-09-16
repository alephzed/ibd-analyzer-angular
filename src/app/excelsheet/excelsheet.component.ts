import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { IBDRating } from '../ibd-rating';

@Component({
  selector: 'app-excelsheet',
  templateUrl: './excelsheet.component.html',
  styleUrls: ['./excelsheet.component.css']
})
export class ExcelsheetComponent implements OnInit {

  data: [][] | undefined;
  willDownload = false;
  constructor() { }

  ngOnInit(): void {
  }

  onFileChange(evt: any): void {
    const target: DataTransfer = evt.target as DataTransfer;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstring: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstring, { type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      console.log(ws);
      this.data = (XLSX.utils.sheet_to_json(ws, {header: 1}));
      console.log('data length: ' + this.data.length);
      this.data = this.data.slice(11, this.data.length - 8);
      console.log(this.data);
      // const ratings: IBDRating[] = this.data.map( t => ({
      //   symbol: t[0],
      //   price: t[1],
      //   priceChange: t[2],
      //   pricePctChange: t[3],
      //   epsRating: t[4],
      //   rsRating: t[5],
      //   industryGroupRS: t[6],
      //   smrRating: t[7],
      //   accDisRating: t[8],
      //   volumePctChange: t[9],
      //   volume: t[10]       
      // } as IBDRating ));

      this.data.forEach( (stock) => {
        // const rating: IBDRating[] = stock.map( t => ({
        //     symbol: t[0],
        //   price: t[1],
        //   priceChange: t[2],
        //   pricePctChange: t[3],
        //   epsRating: t[4],
        //   rsRating: t[5],
        //   industryGroupRS: t[6],
        //   smrRating: t[7],
        //   accDisRating: t[8],
        //   volumePctChange: t[9],
        //   volume: t[10]
        // } as IBDRating[]));
        // console.log( 'rating: ' + rating);
        // ratings.forEach(s => {
          // console.log('rating: ' + s);
        // });
        const x: IBDRating = {};
        stock.forEach( (datapoint, index) => {
          console.log('data point/index: ' + datapoint + '/' + index);
          if (index === 0) {
            x.symbol = datapoint;
          }
          if (index === 1) {
            x.price = datapoint;
          }
          if (index === 2) {
            x.priceChange = datapoint;
          }
          if (index === 3) {
            x.pricePctChange = datapoint;
          }
          if (index === 4) {
            x.pricePctChange = datapoint;
          }
        });
        console.log('stock: ' + x);

      });
      const dataString = JSON.stringify(this.data);
      this.setDownload(dataString);
      return this.data;
    };

    reader.readAsBinaryString(target.files[0]);
  }

  // onFileChange2(ev: any): void {
  //   let workBook: XLSX.WorkBook;
  //   let jsonData = null;
  //   const reader = new FileReader();
  //   const file = ev.target.files[0];
  //   reader.onload = (event) => {
  //     const data = reader.result;
  //     workBook = XLSX.read(data, { type: 'binary' });
  //     jsonData = workBook.SheetNames.reduce((initial, name) => {
  //       const sheet = workBook.Sheets[name];
  //       initial[name] = XLSX.utils.sheet_to_json(sheet);
  //       return initial;
  //     }, {});
  //     const dataString = JSON.stringify(jsonData);
  //     document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
  //     // this.setDownload(dataString);
  //   }
  //   reader.readAsBinaryString(file);
  // }

  setDownload(data: any): void {
    this.willDownload = true;
    setTimeout(() => {
      const el: Element | null = document.querySelector('#download');
      if (el !== null) {
        el.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
        el.setAttribute('download', 'xlsxtojson.json');
      }
    }, 1000);
  }

}
