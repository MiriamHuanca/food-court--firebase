import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {Subscription} from "rxjs";
import {RestaurantService} from "../../../shared/services/restaurant.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

import Swal from "sweetalert2";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AmbientService} from "../../../shared/services/ambient.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  templateUrl: './ambient-restaurant.component.html'
})

export class AmbientRestaurantComponent implements OnInit, OnDestroy {
  subcriptionsI: Subscription[] = [];

  restaurant: any;
  id: number;

  ambient = [];
  ambientForm: FormGroup;

  imageUrlP = 'https://www.paginasiete.bo/u/fotografias/m/2019/8/13/f608x342-276345_306068_68.jpg';
  // data modal
  modalTitle = '';

  constructor(private restaurantService: RestaurantService,
              private ambientService: AmbientService,
              private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute) {
    this.ambientForm = new FormGroup({
      nombre: new FormControl('',
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(150)])),
      descripcion: new FormControl('',
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(300)])),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.loadRestaurant(this.id);
    });
  }

  loadRestaurant(id: number) {
    this.subcriptionsI.push(
      this.restaurantService.getRestaurantId(id).subscribe(
        next => {
          this.restaurant = next.body;
          this.restaurant.latitud = parseFloat(next.body.latitud);
          this.restaurant.longitud = parseFloat(next.body.longitud);
          const data = [];
          this.restaurant.restauranteAmbientes.forEach(item => {
            data.push({
              id: item.tipoAmbiente.id,
              nombre: item.tipoAmbiente.nombre,
              descripcion: item.tipoAmbiente.descripcion,
              stateMap: false
            });
          })
          this.ambient = data;
        },
        error => {
          Swal.fire({
            title: 'Intente mas tarde!',
            text: 'Ocurrio un error',
            icon: 'error',
            confirmButtonText: 'Ok'
          })
        }
      ));
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.ambientForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  deleteEventAmbient(event, index) {
    if (event === 'delete') {
      this.ambient.splice(index);
    }
  }

  editEventAmbient(event, content, index, data) {
    if (event === 'edit') {
      this.modalTitle = 'Editar datos';
      this.ambientForm.setValue({
        nombre: data.nombre,
        descripcion: data.descripcion
      });
      var response = '';
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.subcriptionsI.push(
          this.ambientService.updateAmbient(this.ambient[index].id,result)
            .subscribe((response: any) => {
              this.loadRestaurant(this.id);
              Swal.fire({
                title: 'Se ha actualizado con exito!',
                icon: 'success',
                confirmButtonText: 'Continuar'
              })
            }, error => {
              Swal.fire({
                title: 'Intente mas tarde!',
                text: 'Ocurrio un error',
                icon: 'error',
                confirmButtonText: 'Continuar'
              })
            })
        );
      }, (reason) => {
        response = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  mapState(state: any) {
    state.stateMap = !state.stateMap;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  ngOnDestroy() {
    this.subcriptionsI.forEach(item => item.unsubscribe());
  }
}
