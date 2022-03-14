/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
/**
 * Script varios en JavaScript escritos por Eliezer Hernández, eliohernandez94@gmail.com.com. * 
 * @author Eliezer Hernández * 
 * @version 1.0
 * Fecha		CR	     Nombre				Descripcion
 * ------------	-------- ------------------- ---------------------------------------------
 * 09/01/2021	ENC-1	 Eliezer Hernandez	Validaciones globales.
 
 * LAST LINE HISTORY
 * */

class solReact {//Soluciones en ReactJS
    /** * Validar si un campo es vacio 
     * @param myfield	Campo (<input>)
     * @return	 true si el campo es vacio
     */
    isNull(myfield) {
        return this.isNull2(myfield, myfield.name);
    }
    isNull2(myfield, myfieldname) {
        if (myfield.type === "select-one" && (myfield.value === "" || myfield.value === "0" || myfield.value === "-1")) {
            this.setInvalid(myfield, "Este campo no puede quedar vacío." + ((myfieldname === null) ? "" : " (" + myfieldname + ")"));
            return (true);
        }
        else {
            if (myfield.value === "") {
                this.setInvalid(myfield, "Este campo no puede quedar vacío." + ((myfieldname === null) ? "" : " (" + myfieldname + ")"));
                return (true);
            }
            else {
                this.setValid(myfield);
                return (false);
            }
        }
    }

    setValid(myfield) {
        if (myfield) {
            if (myfield.style) {
                if (myfield.className === "mdt" || myfield.className === "mdtR") {
                    myfield.style.background = "none repeat-x scroll center bottom #fffff9";
                }
                else {
                    myfield.style.background = "none repeat-x scroll center bottom #FFFFFF";
                }
                myfield.style.borderColor = "#28a745";
                myfield.style.backgroundImage = "";
            }
            if (document.getElementById(myfield.name + '_img'))
                document.getElementById(myfield.name + '_img').src = 'images/validated.gif';
            if (document.getElementById(myfield.name + '_span')) {
                document.getElementById(myfield.name + '_span').style.display = "none";
            }
            if(document.getElementById(myfield.name)){
                document.getElementById(myfield.name).style.borderColor = "#28a745";
            }
        }
    }

    setInvalid(myfield, msg) {
        if(msg===undefined || msg===''){
            msg= "Campo requerido";
        }
        if (document.getElementById(myfield.name + '_img'))
            document.getElementById(myfield.name + '_img').src = 'images/exclamation.gif';
        if (document.getElementById(myfield.name + '_span')) {
            document.getElementById(myfield.name + '_span').innerHTML = msg;
            document.getElementById(myfield.name + '_span').style.display = "block";
            document.getElementById(myfield.name + '_span').style.fontSize = '80%';
            document.getElementById(myfield.name + '_span').style.marginTop = '.25rem';
            document.getElementById(myfield.name + '_span').style.color = "#dc3545";
        } else {
            alert(msg);
        }
        if (myfield.style) {
            if (myfield.className === "mdt" || myfield.className === "mdtR")
                myfield.style.background = "none repeat-x scroll center bottom #ffff99";
            else{
                myfield.style.background = "none repeat-x scroll center bottom #FFFFFF";
                myfield.style.backgroundImage = "url(images/invalid_line.gif)";
                myfield.style.borderColor = "#dc3545";
                if(document.getElementById(myfield.name)){
                    document.getElementById(myfield.name).style.borderColor = "#dc3545";
                }
                
            }            
        }
    }

    /*** Validar si un campo contiene un numero positivo valido (entero o flotante, no vacio).* 
    * @param myfield	Campo (<input>)
    * @return	 true si el campo es valido
    */
    setInvalidPrimeReact(myfield, msg) {
        if(msg===undefined || msg===''){
            msg= "Campo requerido";
        }
        if (document.getElementById(myfield.name + '_span')) {
            document.getElementById(myfield.name + '_span').innerHTML = msg;
            document.getElementById(myfield.name + '_span').style.display = "block";
            document.getElementById(myfield.name + '_span').style.fontSize = '80%';
            document.getElementById(myfield.name + '_span').style.marginTop = '.25rem';
            document.getElementById(myfield.name + '_span').style.color = "#dc3545";
        }
        if(document.getElementById(myfield.name)){
            document.getElementById(myfield.name).classList.add("p-invalid");
        }
    }

    /*** Validar si un campo contiene un numero positivo valido (entero o flotante, no vacio).* 
    * @param myfield	Campo (<input>)
    * @return	 true si el campo es valido
    */
    setValidPrimeReact(myfield, msg) {    
    if(document.getElementById(myfield.name)){
        document.getElementById(myfield.name).classList.remove("p-invalid");
        document.getElementById(myfield.name).style.borderColor = "#28a745";
    }
    if (document.getElementById(myfield.name + '_span')) {
        document.getElementById(myfield.name + '_span').style.display = "none";
    }
}

    /*** Validar si un campo contiene un numero positivo valido (entero o flotante, no vacio).* 
    * @param myfield	Campo (<input>)
    * @return	 true si el campo es valido
    */
    isNumberPos(myfield) {
        var chkNum = true;
        if ((myfield.value !== '' && myfield.value.indexOf('.') === 0)) {
            myfield.value = '0' + myfield.value;
        }
        if (myfield.value === "") {
            this.setInvalid(myfield, "Este campo tiene que contener un número POSITIVO.");
            myfield.value = '0';
            chkNum = (false);
        }
        else if (!this.check_only_digits(myfield)) {
            if (myfield.value === "")
                myfield.value = '0';
            chkNum = (false);
        }
        if ((myfield.value !== '' && isNaN(myfield.value)) || myfield.value.indexOf('.') !== myfield.value.lastIndexOf('.')) {
            this.setInvalid(myfield, "Número no válido. Verifíquelo.");
            myfield.value = "0";
            chkNum = (false);
        }
        if (chkNum) {
            this.setValid(myfield);
        }
        return chkNum;
    }
    /*** Valida que el campo solo contiene los caracteres: 0123456789 y el punto.* 
    * Modifica el valor del campo quitando lo caracteres no permitidos.* 
    * @param myfield	Campo (<input>)
    * @return	 true si solo contienia caracteres permitidos, false si contenia caracteres prohibido y entonces es quito modificando el valor del campo 
    */
    check_only_digits(myfield) {
        return this.check_entry(myfield,
            "0123456789.",
            "Solo números positivos son aceptados. No espacio, subraya, etc..."
        );
    }
    check_entry(myfield, valid, msg) {
        var ok = "yes";
        var temp = "";
        for (var i = 0; i < myfield.value.length; i++) {
            temp = "" + myfield.value.substring(i, i + 1);
            if (valid.indexOf(temp) === -1) { ok = "no"; }
        }
        if (ok === "no") {
            temp = "";
            myfield.value = myfield.value.toUpperCase();
            for (let i = 0; i < myfield.value.length; i++) {
                if (valid.indexOf(myfield.value.charAt(i)) === "-1") { }
                else { temp += myfield.value.charAt(i); }
            }
            myfield.value = temp;
            this.setInvalid(myfield, msg + " Valor modificado para hacer cumplir la regla. Verifíquelo!");
            return (false);
        }
        else {
            this.setValid(myfield);
            return (true);
        }
    }
    /**
* Validar si un campo contiene una hora valida (formato hh:mm) y en un cierto rango de fechas, y no este vacia.
* 
* @param myfield	Campo (<input>)
* @return	 true si la hora es valida
*/
    check_Hr(myfield) {
        this.check_entry(myfield,
            "0123456789:",
            "El formato de la hora no esta correcto. El formato es hh:mm. Valor modificado para hacer cumplir la regla. VERIFICALO!"
        );
        if (myfield.value.length < 1 || myfield.value.length > 5
            || (myfield.value.length > 2 && myfield.value.indexOf(":") === -1)
            || (myfield.value.length > 2 && myfield.value.length < 5)
        ) {
            this.setInvalid(myfield, "La hora es obligatoria. El formato es hh:mm");
            return false;
        } else {

            var hr = myfield.value.substring(0, 1);
            if (myfield.value.length > 1) { hr = myfield.value.substring(0, 2); }
            var minu = '0';
            if (myfield.value.length < 1) { minu = 'NA'; }
            if (myfield.value.length === 5) { minu = myfield.value.substring(3, 5); }
            if ((isNaN(hr)) || (isNaN(minu))) {
                this.setInvalid(myfield, "La hora es obligatoria. El formato es hh:mm");
                return false;
            }
            else if ((hr > 23) || (minu > 59)) {
                this.setInvalid(myfield, "La hora es obligatoria. El formato es hh:mm");
                return false;
            }
            else {
                this.setValid(myfield);
                return true;
            }
        }
    }
    parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        //var date = new Date(1572575093*1000);//Convertir fecha unix a fecha normal javascript
        return JSON.parse(window.atob(base64));
    }
    getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if(pair[0] === variable) {
                return pair[1];
            }
        }
        return undefined;
    }

    /**
    * Limpiar formulario , poner todos valores en vacio.
    * 
    * @param  form	Id form (<form>)
    * @param  form	Id del field de excepcion field (<input o cualquier otro>)
    * @return	 true Si todo correcto
    */
    cleanFormExceptThis= async (myForm,myfield)=> {
        let form = document.getElementById(myForm);
        for(var i=0;i<form.elements.length;i++){
            console.log(form.elements[i].type);
            if(form.elements[i].type==='text'&&form.elements[i].name!==myfield){
                form.elements[i].value='';
            }
        }
        return true;
    }

    /**
    * Funcion que retorna html interpretado para recat, en lugar de usar innerhtml
    * 
    * @param  text	texto a formatear
    * @return texto formateado
    */
    createMarkup(text) {
        return {__html: text};
    }

    /**
    * Funcion que retorna html interpretado para recat, en lugar de usar innerhtml
    * 
    * @param  myform id del formulario a validar
    * @return valida campo a campo todos los requeridos
    */
    validateForm(myform) {
        let form = document.getElementById(myform)
        for(var i=0;i<form.elements.length;i++){
            console.log(form.elements[i].required);
            if(form.elements[i].required){
                if(form.elements[i].value===''){
                    console.error("deberia llenarse: "+form.elements[i].name)
                    this.setInvalidPrimeReact(form.elements[i])
                }else{
                    this.setValidPrimeReact(form.elements[i])
                }                
            }
        }
    }

}//Fin Class

export default new solReact();