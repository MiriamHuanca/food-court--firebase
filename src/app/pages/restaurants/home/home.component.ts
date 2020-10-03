import {Component, DoCheck, OnDestroy, OnInit} from "@angular/core";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

import Swal from "sweetalert2";

import {AmbientService} from "../../../shared/services/ambient.service";
import {FoodService} from "../../../shared/services/food.service";
import {RestaurantService} from "../../../shared/services/restaurant.service";

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

@Component({
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, DoCheck, OnDestroy {
  subcriptions: Subscription[] = [];

  totalItems: number;
  itemsPerPage = 4;
  page = 0;

  dataSearch = '';
  state = false;
  tipo: string;
  listaTipo = ['Todo', 'Nombre', 'Telefono', 'Direccion'];
  listaEstado = [{estado: 'activo'}, {estado: 'inactivo'}];
  listaFoods = [];
  listaAmbients = [];

  //dataRestaurant: Restaurant[] = [];
  dataRestaurant: any[] = [];
  // data modal
  modalTitle = '';
  restaurantForm: FormGroup;
  // modal edit create
  fileImage: any;
  imagenUrl: any;
  indexRest = null;
  // MAP
  lat: any;
  lng: any;
  zoom = 18;
  markers: marker[];
  arrayPage = [];

  imgAsync = new BehaviorSubject<string>('../assets/image/logo-edit.png');

  constructor(private restaurantService: RestaurantService,
              private foodService: FoodService,
              private ambientService: AmbientService,
              private modalService: NgbModal,
              private config: NgbModalConfig,
              private router: Router) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.initForm();
    this.loadAll('nombre');
    this.loadAmbient('nombre');
    this.loadComidas('nombre');
  }

  initForm() {
    this.restaurantForm = new FormGroup({
      nombre: new FormControl('',
        Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])),
      descripcion: new FormControl('',
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])),
      telefono: new FormControl(null,
        Validators.compose([Validators.required, Validators.minLength(5)])),
      estado: new FormControl('',
        Validators.compose([Validators.required])),
      logo: new FormControl(''),
      horario: new FormControl('',
        Validators.compose([Validators.required, Validators.maxLength(30)])),
      latitud: new FormControl(null,
        Validators.compose([Validators.required])),
      longitud: new FormControl(null,
        Validators.compose([Validators.required])),
      direccion: new FormControl('',
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(300)])),
      idTipoComida: new FormControl(null,
        Validators.compose([Validators.required])),
      restauranteAmbientes: new FormControl([],
        Validators.compose([Validators.required])),
    });
  }

  loadAll(dataTipo: string) {
    this.subcriptions.push(
      this.restaurantService.getRestaurantsList({
        page: this.page,
        size: this.itemsPerPage,
        sort: [dataTipo]
      })
        .subscribe(
          next => {
            this.dataRestaurant = next.body;
            this.dataRestaurant.forEach((element: any) => {
              if (element.logo === '') {
                element.logo = '../assets/image/logo-edit.png';
              }
            });
            this.arrayPage = [];
            this.subcriptions.push(
              this.restaurantService.getRestaurantCount().subscribe(item => {
                this.totalItems = +item.body;
              })
            );
            this.totalItems = 10;
            const dataIn = (this.totalItems % this.itemsPerPage) * this.itemsPerPage === this.totalItems ? (this.totalItems % this.itemsPerPage) : (this.totalItems % this.itemsPerPage) + 1;

            for (let i = 1; i <= dataIn; i++) {
              this.arrayPage.push(i + '');
            }

          },
          error => {
            Swal.fire({
              title: 'Intente mas tarde!',
              text: 'Ocurrio un error',
              icon: 'error',
              confirmButtonText: 'Continuar'
            })
          }
        ));
  }

  loadAmbient(dataTipo: string) {
    this.subcriptions.push(
      this.ambientService.getAmbientList({
        page: 0,
        size: 10,
        sort: [dataTipo]
      }).subscribe(
        next => {
          this.listaAmbients = next.body || [{id: null, nombre: 'Ninguno'}];
        },
        error => {
          console.error('Error al solicitar ' + error);
        }
      ));
  }

  loadComidas(dataTipo: string) {
    this.subcriptions.push(
      this.foodService.getFootList({
        page: 0,
        size: 10,
        sort: [dataTipo]
      }).subscribe(
        next => {
          this.listaFoods = next.body || [{id: null, nombre: 'Ninguno'}];
        },
        error => {
          console.error('Error al solicitar ' + error);
        }
      ));
  }

  searchSubmit(searchForm: NgForm) {
    const search = searchForm.value.search;
    //this.loadAll(search);
  }

  pageItem(numero: number) {
    this.page = numero - 1;
    this.state = true;
  }

  nextChange() {
    this.page++;
    this.state = true;
  }

  beforeChange() {
    this.page--;
    this.state = true;
  }

  ngDoCheck() {
    if (this.state) {
      this.loadAll('nombre');
      this.state = false;
    }
  }

  ngOnDestroy(): void {
    this.subcriptions.forEach(item => item.unsubscribe());
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.restaurantForm.controls[controlName];
    if (!control) {
      return false;
    }
    const result = control.hasError(validationType) && (control.dirty || control.touched);
    return result;
  }

  openCreateR(content) {
    this.indexRest = null;
    this.imagenUrl = null;
    this.imgAsync.next('../assets/image/logo-edit.png');
    this.modalTitle = 'Nuevo restaurante';
    this.restaurantForm.setValue({
      nombre: '',
      descripcion: '',
      telefono: '',
      estado: '',
      logo: '',
      horario: '',
      latitud: -33.4372,
      longitud: -70.6506,
      direccion: '',
      idTipoComida: null,
      restauranteAmbientes: []
    });
    this.modalService.open(content, {size: 'xl'}).result.then((result) => {
      result.logo = this.imagenUrl;
      const resAmb = [];
      result.restauranteAmbientes.forEach(item => {
        resAmb.push({idTipoAmbiente: item})
      })
      //result.restauranteAmbientes = resAmb;
      result.restauranteAmbientes = [];
      this.subcriptions.push(
        this.restaurantService.createRestaurant(result)
          .subscribe((response: any) => {
            this.loadAll('nombre');
            Swal.fire({
              title: 'Se ha creado un restaurante con exito!',
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
      this.imgAsync.next('../assets/image/logo-edit.png');
    });
  }

  mapClicked(event) {
    this.markers = [{
      lat: event.coords.lat,
      lng: event.coords.lng,
      draggable: true
    }];
    this.restaurantForm.patchValue({
      latitud: event.coords.lat,
      longitud: event.coords.lng
    });
  }

  markerDragEnd(event) {
    this.markers = [{
      lat: event.coords.lat,
      lng: event.coords.lng,
      draggable: true
    }];
    this.restaurantForm.patchValue({
      latitud: event.coords.lat,
      longitud: event.coords.lng
    });
  }

  openEditR(content, data, index) {
    this.indexRest = index;
    this.imagenUrl = data.logo;
    this.imgAsync.next(data.logo || '../assets/image/logo-edit.png');
    this.modalTitle = 'Editar restaurante';
    this.restaurantForm.setValue({
      nombre: data.nombre,
      descripcion: data.descripcion,
      telefono: data.telefono,
      estado: data.estado,
      logo: data.logo,
      horario: data.horario,
      latitud: data.latitud,
      longitud: data.longitud,
      direccion: data.direccion,
      idTipoComida: data.tipoComida?.id,
      restauranteAmbientes: data.restauranteAmbientes.map((item) => item?.tipoAmbiente?.id)
    });

    this.modalService.open(content, {size: 'xl'}).result.then((result) => {
      result.logo = this.imagenUrl;
      //result.restauranteAmbientes = [{idTipoAmbiente: result.restauranteAmbientes}];
      result.restauranteAmbientes = [];
      this.imgAsync.next(this.imagenUrl || '../assets/image/logo-edit.png');
      this.subcriptions.push(
        this.restaurantService.updateRestaurant(index, result)
          .subscribe((response: any) => {
            this.loadAll('nombre');
            Swal.fire({
              title: 'Se ha actualisado el restaurante con exito!',
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
      this.imgAsync.next(this.dataRestaurant[index].logo || '../assets/image/logo-edit.png');
    });
  }

  changeImage(content) {
    var response = '';
    this.modalService.open(content).result.then((result) => {
      response = `Closed with: ${result}`;
      this.restaurantService.preAddAndUpdatePost(this.fileImage);
      this.imagenUrl = result.logoImagen;
      Swal.fire({
        title: 'Se ha guardado la imagen con exito',
        icon: 'success',
        confirmButtonText: 'Continuar'
      })
    }, (reason) => {
      if (!!this.indexRest) {
        this.imgAsync.next(this.dataRestaurant[this.indexRest].logo);
      } else {
        this.imgAsync.next('../assets/image/logo-edit.png');
      }
    });

  }

  handleImage(event: any): void {
    this.fileImage = event.target.files[0];
  }

  openDeleteR(item, index) {
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
        this.dataRestaurant.splice(index, 1);
        Swal.fire(
          'Eliminado!',
          'Tu dato ha sido eliminado.',
          'success'
        )
      }
    })
  }

  detailRestaurant(id: string) {
    this.router.navigate(['pages/restaurants/detail', id]);
  }

  ambientRestaurant(id: string) {
    this.router.navigate(['pages/restaurants/ambient', id]);
  }
}
