import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import Swal from "sweetalert2";

@Component({
  selector: 'app-food',
  template: `
    <div class="row px-3 d-flex align-items-center app-map"
         [ngClass]="{ 'div-map': dataI.stateMap }">
      <div class="col-md-3 p-0 position-static index-1"
           [ngStyle]="{display: dataI.stateMap === false ? 'none' : 'block'}">
        <ul class="nav navbar-nav mr-auto border-map"
            id="sidebar"
            role="tablist">
          <li class="nav-item active mx-auto">
            <button class="btn btn-outline-primary my-2 mx-2 mx-sm-1" (click)="openEditFood()">
              <i class="icon ion-md-create"></i>
            </button>
          </li>
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
export class FoodComponent implements OnInit {

  @Input() dataI: any;
  @Input() foodP: any;
  @Output() clickButtonE = new EventEmitter<any>();
  @Output() clickButtonD = new EventEmitter<any>();
  @Input() index: any;
  description = '';

  ngOnInit() {
    this.description = this.dataI.descripcion;
  }

  openEditFood() {
    this.clickButtonE.emit('edit');
  }

  openDeleteFood() {
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

  mapStateMap(item: any) {
    this.dataI.stateMap = !this.dataI.stateMap;
  }
}
