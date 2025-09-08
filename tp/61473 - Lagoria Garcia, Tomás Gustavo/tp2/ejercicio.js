'use strict';
// Funciones generales
class Contacto {
  constructor({id, nombre, apellido, telefono, email}) {
    this.id = Number(id);
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.email = email;
  }
  getNombreCompleto() {
    return `${this.apellido} ${this.nombre}`;
  }
  incluyeTexto(texto) {
    const textoMinuscula = texto.toLowerCase();
    return this.nombre.toLowerCase().includes(textoMinuscula) ||
           this.apellido.toLowerCase().includes(textoMinuscula) ||
           this.telefono.toLowerCase().includes(textoMinuscula) ||
           this.email.toLowerCase().includes(textoMinuscula);
  }
}
class Agenda {
  constructor() {
    this.contactos = [];
    this.ultimoId = 0;
  }
  agregarContacto(cont) {
    cont.id = ++this.ultimoId;
    this.contactos.push(cont);
  }
    eliminarContacto(id) {
    const index = this.contactos.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contactos.splice(index, 1);
      return true;
    }
}
actualizarContacto(contacto) {
const index=this.contactos.findIndex(c=>c.id===contacto.id);
if(index!==-1){
this.contactos[index]=contacto;
return true;
}
}
traerContacto(id){
return this.contactos.find(c=>c.id===id); }
traerTodosSegun(filtro= ''){ 
    let lista= this.contactos.filter(d=>d.incluyeTexto(filtro));
lista.sort((a,b)=>a.getNombreCompleto().localeCompare(b.getNombreCompleto()));
return lista;
}
}
 let datos= [
        {id:1,nombre:"Juan",apellido:"Pérez",telefono:"123-456-7890",email:"la@gmail.com"},
        {id:2,nombre:"María",apellido:"Gómez",telefono:"987-654-3210",email:"la@gmail.com" },
        {id:3,nombre:"Carlos",apellido:"López",telefono:"555-123-4567",email:"la@gmail.com" },
        {id:4,nombre:"Ana",apellido:"Martínez",telefono:"444-987-6543",email:"la@gmail.com"}
      ];
    let miAgenda= new Agenda();
    datos.forEach(d=>miAgenda.agregarContacto(new Contacto(d)));
window.Editar = Editar;
window.borrar = borrar;
window.agenda = miAgenda; 