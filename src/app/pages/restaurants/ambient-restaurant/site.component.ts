import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import Swal from "sweetalert2";

@Component({
  selector: 'app-site',
  template: `
    <div class="row px-3 d-flex align-items-center app-map"
         [ngClass]="{ 'div-map': dataI.stateMap }">
      <div class="col-md-3 p-0 position-static index-1"
           [ngStyle]="{display: dataI.stateMap === false ? 'none' : 'block'}">
        <ul class="nav navbar-nav mr-auto border-map"
            id="sidebar"
            role="tablist">
          <li class="nav-item active mx-auto">
            <button class="btn btn-outline-primary my-2 mx-2 mx-sm-1" (click)="openEditA()">
              <i class="icon ion-md-create"></i>
            </button>
          </li>
          <!--<li class="nav-item d-lg-block m-1">
            <button class="btn btn-outline-danger my-2 mr-md-2 mr-sm-1" (click)="openDeleteA()">
              <img class="img-icon" [src]="'../../assets/icon/delete.png'" alt="V"/>
            </button>
          </li>-->
        </ul>
      </div>

      <div class="col-md-9 tab-content pl-0 pr-2 py-1 movil-map"
           [ngStyle]="{display: dataI.stateMap === false ? 'none' : 'block'}">
        <div [ngClass]="{'mapView': true}"
             id="mapView{{ index }}">
          <img [src]="foodP" class="bg-impact-f" alt="">
        </div>
      </div>
      <div class="font-map mx-auto text-center"
           [ngStyle]="{
          display: dataI.stateMap === false ? 'none' : 'block'}">
        <a class="nav-link btn-primary btn-rounded font-close"
           (click)="mapStateMap(dataI)">
          <i class="fas fa-sort-up"></i> Cerrar
        </a>
      </div>
    </div>
  `
})
export class SiteComponent implements OnInit {
  @ViewChild('mapView', {static: false}) map: any;
  @ViewChild('streetView', {static: false}) street: any;

  @Input() dataI: any;
  @Input() foodP: any;
  @Output() clickButtonE = new EventEmitter<any>();
  @Output() clickButtonD = new EventEmitter<any>();
  @Input() index: any;
  description = '';

  ngOnInit() {
    this.description = this.dataI.descripcion;
  }

  mapStateMap(item: any) {
    this.dataI.stateMap = !this.dataI.stateMap;
  }

  openEditA() {
    this.clickButtonE.emit('edit');
  }

  openDeleteA() {
    Swal.fire({
      title: 'Esta seguro de eliminar?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clickButtonD.emit('delete');
        Swal.fire(
          'Eliminado!',
          'Tu dato ha sido eliminado.',
          'success'
        )
      }
    })
  }
}
