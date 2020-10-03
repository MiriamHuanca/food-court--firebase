import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {Subscription} from "rxjs";
import {RestaurantService} from "../../../shared/services/restaurant.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

import {Food} from "../../../shared/models/foot.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FoodService} from "../../../shared/services/food.service";

declare var googlemaps: any;

@Component({
  templateUrl: './detail-restaurant.component.html'
})

export class DetailRestaurantComponent implements OnInit, OnDestroy {
  subcriptionsI: Subscription[] = [];
  restaurant: any;
  id: number;
  food: any;
  imageUrlP = 'https://images-gmi-pmc.edge-generalmills.com/6c9c3378-79e4-4d1f-bbce-828b9a6f39bf.jpg';
  // data modal
  modalTitle = '';
  foodForm: FormGroup;

  constructor(private restaurantService: RestaurantService,
              private foodService: FoodService,
              private modalService: NgbModal,
              private router: Router,
              private route: ActivatedRoute) {
    this.foodForm = new FormGroup({
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
          this.food = this.restaurant['tipoComida'];
          this.food['stateMap'] = false;
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
    const control = this.foodForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  mapState(state: any) {
    state.stateMap = !state.stateMap;
  }

  deleteEventFood(event) {
    if (event === 'delete') {
      this.food = {id: null, nombre: '', descripcion: ''};
    }
  }

  editEventFood(event, content, data) {
    if (event === 'edit') {
      this.modalTitle = 'Editar datos';
      this.foodForm.setValue({
        nombre: data.nombre,
        descripcion: data.descripcion
      });
      var response = '';
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.subcriptionsI.push(
          this.foodService.updateFood(this.restaurant.idTipoComida,result)
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
