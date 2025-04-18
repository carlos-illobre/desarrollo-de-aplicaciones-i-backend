import { randomUUID } from 'node:crypto';

export interface Entregadto{
  id: string;
  repartidorEmail: string;
  cliente: string;
  fechaEntrega: string;
  estado: string;
  direccion: string;
  
  constructor(repartidorEmail: string, cliente: string, fechaEntrega: string, estado: string, direccion: string){
	this.id =  randomUUID();
	this.repartidorEmail = repartidorEmail;
	this.cliente = cliente;
	this.fechaEntrega = fechaEntrega;
	this.estado = estado;
	this.direccion = direccion;
  }
}


