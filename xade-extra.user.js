// ==UserScript==
// @name         Xade Extra
// @version      1.0.0
// @description  Utilidades añadidas al programa Xade de la xunta
// @author       Alvaro Beiro
// @license      GPL-3.0-or-later
// @updateURL    https://raw.githubusercontent.com/AlvaroBeiro/xade-extra/main/xade-extra.user.js
// @downloadURL  https://raw.githubusercontent.com/AlvaroBeiro/xade-extra/main/xade-extra.user.js
// @match        *://*.xunta.gal/xade*
// @run-at       document-end
// ==/UserScript==

const aplicarCambios = () => {
    if(window !== window.top && window.location.href.includes("ListaAlumnos")){  // vamos a ejecutar esto sólo en el frame que controla la lista de alumnos
        // obtenemos la lista de alumnos
        const tablaAlumnos = document.getElementById('datos_tb_tabla0');
        const listaAlumnos = tablaAlumnos.querySelectorAll(":scope tr");
        let arrayAlumnos = [];
        for(const tr of listaAlumnos){
            arrayAlumnos.push(tr.innerText);
        }

        // creamos un nuevo nodo antes del primero de la lista
        if (!tablaAlumnos.querySelector(".fila-insertada") && arrayAlumnos.length > 0) { // previene un bucle infinito y se asegura de actuar sólo cuando tengamos datos
            const botonAlumnos = document.createElement("tr");
            botonAlumnos.classList.add("fila-insertada");
            botonAlumnos.bgcolor="#CCDEEE";
            botonAlumnos.innerHTML = '<td id="tb_tabla0_Cell0_0" align="left" class="xTablaRowDat" style="color: rgb(0, 0, 0); height: 20px;"><div id="modalbtn" style="vertical-align:middle;overflow:hidden;width:183px;height:12px;">Lista completa</div></td>';
            listaAlumnos[0].parentNode.appendChild(botonAlumnos);

            // creamos el modal 
            const modal = document.createElement("div");
            modal.id = "modal";
            modal.style = "display: none; position: fixed; z-index: 99999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); ";
            let modaltext = '<div style="  background-color: rgb(245, 249, 252); margin: 15% auto; padding: 20px; border: 1px solid #888; border-radius: 5px; width: 80%; max-width: 900px;"><span id="closemodal" style="color: #285983; float: right; font-size: 20px; margin: 26px 5px 0 0; font-weight: bold;">&times;</span>';
            modaltext += '<h2 style="text-align: center; background-color: #6699CC; color: white; padding: 0.2em;">Lista de alumnos</h2>';
            modaltext += '<p style="font-family: Verdana, Arial, Helvetica, sans-serif;font-size: 11px;">Formato: ';
            modaltext += '<select name="formato" id="formato" class="textoc" style="font-family: Verdana, Arial, Helvetica, sans-serif;font-size: 11px; background-color: #D9E6F2; border: 1px solid #000000;">';
            modaltext += '<option value="apellidosnombre" style="">Apellidos, Nombre</option><option value="nombreapellidos">Nombre Apellidos</option><option value="nombrea">Nombre A.</option>';
            modaltext += '</select></p>';
            modaltext += '<ul id="listaAlumnosFormateada" style="text-align: left; font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px;">';

            for (const li of arrayAlumnos){
                modaltext += ('<li>' + li + '</li>');
            }


            modaltext += '</ul></div>';
            modal.innerHTML = modaltext;

            window.top.document.body.appendChild(modal);

            //añadimos las interacciones

            var modalbtn = document.getElementById("modalbtn");
            var modalclose = window.top.document.getElementById("closemodal");

            const selectFormato = window.top.document.getElementById("formato");
            selectFormato.addEventListener("change", actualizarLista);

            var listaFormateada = window.top.document.getElementById("listaAlumnosFormateada");


            // función para dar más formatos a la lista de alumnos
            function actualizarLista(){
                let formato = selectFormato.value;
                let tempText = '';
                if (formato == "apellidosnombre"){ // Formato: Apellido1 Apellido2 Nombre
                    for (const li of arrayAlumnos){
                        tempText += ('<li>' + li + '</li>');
                    }
                } else if (formato == "nombreapellidos"){ // Formato: Nombre Apellido1 Apellido2
                    for (const li of arrayAlumnos){
                        const arrayNombre = li.split(", ");
                        let apellidos = arrayNombre[0];
                        let nombre = arrayNombre[1];
                        tempText += ('<li>' + nombre + ' ' + apellidos + '</li>');
                    }
                } else { // Formato: Nombre A.
                    for (const li of arrayAlumnos){
                        const arrayNombre = li.split(", ");
                        let apellido = arrayNombre[0].charAt(0);
                        let nombre = arrayNombre[1];
                        tempText += ('<li>' + nombre + ' ' + apellido + '.</li>');
                    }
                }
                listaFormateada.innerHTML = tempText;

            }

            modalbtn.onclick = function(){
                modal.style.display = "block";
            }

            modalclose.onclick = function(){
                modal.style.display = "none";
            }

            window.top.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }

        }
    }
};

aplicarCambios(); // aplicamos los cambios la primera vez que se ejecuta el script
const observer = new MutationObserver(aplicarCambios); // Creamos un observer que ejecute el script de nuevo cuando se detectem modificaciones
observer.observe(document.body, { childList: true, subtree: true });