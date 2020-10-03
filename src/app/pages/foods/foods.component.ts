import {Component, DoCheck, OnDestroy, OnInit} from "@angular/core";
import {BehaviorSubject, Subscription} from "rxjs";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {NgbModal, NgbModalConfig} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {FoodService} from "../../shared/services/food.service";

@Component({
  templateUrl: './foods.component.html'
})

export class FoodsComponent implements OnInit, OnDestroy, DoCheck {
  subcriptions: Subscription[] = [];

  totalItems: number;
  itemsPerPage = 5;
  page = 0;

  dataSearch = '';
  state = false;

  dataFood: any[] = [];
  // data modal
  modalTitle = '';
  foodForm: FormGroup;
  // modal edit create
  fileImage: any;
  imagenUrl: any;
  indexRest = null;

  arrayPage = [];

  imgAsync = new BehaviorSubject<string>('../assets/image/logo-edit.png');

  constructor(private foodService: FoodService,
              private modalService: NgbModal,
              private config: NgbModalConfig,
              private router: Router) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.initForm();
    this.loadAll('nombre');
  }

  initForm() {
    this.foodForm = new FormGroup({
      nombre: new FormControl('',
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(150)])),
      descripcion: new FormControl('',
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(300)])),
    });
  }

  loadAll(dataTipo: string) {
    this.subcriptions.push(
      this.foodService.getFootList({
        page: this.page,
        size: this.itemsPerPage,
        sort: [dataTipo]
      })
        .subscribe(
          next => {
            this.arrayPage = [];
            this.totalItems = parseFloat(next.headers.get('X-Total-Count')) || 10;
            const dataIn = (this.totalItems % this.itemsPerPage) * this.itemsPerPage === this.totalItems ? (this.totalItems % this.itemsPerPage) : (this.totalItems % this.itemsPerPage) + 1;
            this.dataFood = next.body;
            for (let i = 1; i <= dataIn+1; i++) {
              this.arrayPage.push(i + '');
            }
          },
          error => {
            console.error('Error al solicitar ' + error);
          }
        ));
  }

  searchSubmit(searchForm: NgForm) {
    const search = searchForm.value.search;
  }

  pageItem(numero: number) {
    this.page = numero-1;
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

  ngOnDestroy(): void {
    this.subcriptions.forEach(item => item.unsubscribe());
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.foodForm.controls[controlName];
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
    this.modalTitle = 'Nuevo comida';
    this.foodForm.setValue({
      nombre: '',
      descripcion: ''
    });
    this.modalService.open(content, {size: 'xl'}).result.then((result) => {
      result.imagen = this.imagenUrl;

      this.subcriptions.push(
        this.foodService.createFood(result)
          .subscribe((response: any) => {

            this.dataFood = response;
            Swal.fire({
              title: 'Se ha creado un comida con exito!',
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

  openEditR(content, data, index) {
    this.indexRest = index;
    this.imagenUrl = data.logo;
    this.imgAsync.next(data.logo || '../assets/image/logo-edit.png');
    this.modalTitle = 'Editar comida';
    this.foodForm.setValue({
      nombre: data.nombre,
      descripcion: data.descripcion
    });

    this.modalService.open(content, {size: 'xl'}).result.then((result) => {
      result.imagen = this.imagenUrl;

      this.imgAsync.next(this.imagenUrl || '../assets/image/logo-edit.png');
      this.subcriptions.push(
        this.foodService.updateFood(index, result)
          .subscribe((response: any) => {

            this.dataFood = response;
            Swal.fire({
              title: 'Se ha actualisado el comida con exito!',
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
      this.imgAsync.next(this.dataFood[index].logo || '../assets/image/logo-edit.png');
    });
  }

  changeImage(content) {
    var response = '';
    this.modalService.open(content).result.then((result) => {
      response = `Closed with: ${result}`;
      //cargar imagen
      this.imagenUrl = result.logoImagen;
      Swal.fire({
        title: 'Se ha guardado la imagen con exito',
        icon: 'success',
        confirmButtonText: 'Continuar'
      })
    }, (reason) => {
      if (!!this.indexRest) {
        this.imgAsync.next(this.dataFood[this.indexRest].logo);
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

        this.dataFood.splice(index, 1);
        Swal.fire(
          'Eliminado!',
          'Tu dato ha sido eliminado.',
          'success'
        )
      }
    })
  }

  ngDoCheck() {
    if (this.state) {
      this.loadAll('nombre');
      this.state = false;
    }
  }
}
