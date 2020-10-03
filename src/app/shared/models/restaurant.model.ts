export class Restaurant {
  constructor(
  public id: string,
  public nombre: string,
  public descripcion: string,
  public telefono: string,
  public estado: string,
  public logo: string,
  public horario: string,
  public latitud: number,
  public longitud: number,
  public direccion: string,
  public id_tipo_comida: string,
  public fecha_alta: string,
  public id_usuario_alta: string,
  public fecha_baja: Date,
  public id_usuario_baja: string,
  public fecha_desde: Date,
  public id_usuario_desde: string,
  public fecha_hasta: Date,
  public id_usuario_hasta: string
  ) {}
}
