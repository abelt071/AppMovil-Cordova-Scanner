/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

$cadenaQr= "";
$p ="";

$urlQr="";
$estatus="";



var existe_db;
var db;
var nom_db = "matc_qr"; 
var sqlQr  = "create table if not exists qr("+
         "id_qr INTEGER PRIMARY KEY AUTOINCREMENT,"+
         "fecha_consulta VARCHAR(20) not null,"+
         "url VARCHAR(500) not null,"+
         "estatus VARCHAR(2))";


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        leerQr();
        obtenerHora();
        consultarURL();
        guardarRegistro();
        iniciarFunciones();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent();
    },
    // Update DOM on a Received Event
    receivedEvent: function() {
         //alert("BD ");
        existe_db = window.localStorage.getItem("existe_db");
		db = window.openDatabase(nom_db,"1.0","base unidad habitacional",2000000);
		if(existe_db==null){
		  app.crearBD();
		}else{	
         //alert("la base: "+nom_db+" Existe");    
		 consultarQr();
		}
    },
    crearBD: function(){
         db.transaction(crearNuevaBD,errorBD,crearSuccess);
    }
};

app.initialize();

// Base de datos Qr
//************************************************
function crearNuevaBD(tx){   
    tx.executeSql('DROP TABLE IF EXISTS qr');	
	tx.executeSql(sqlQr);		
}


function errorBD(err){
  alert("Error SQL "+err.message);
}

function crearSuccess(){
   window.localStorage.setItem("existe_db",1);   
  // alert("Base Creada");    
}

//Funcion de consulta Qr.
//***********************************************
//***********************************************
function consultarQr(){
    //alert("Creando transaccion");
   db.transaction(obtenerQr,errorBD);
}

function obtenerQr(tx){
    //alert("Consultando Query");
    var query = "select * from qr";
    tx.executeSql(query,[],listarQr,errorBD);
}

//Funcion de consulta Qr validos.
//***********************************************
//***********************************************
function consultarQrVal(){
  db.transaction(obtenerQrVal,errorBD);
}

function obtenerQrVal(tx){
  var query = "select * from qr where estatus = 1";
  tx.executeSql(query,[],listarQr,errorBD);   
}
//Funcion de consulta Qr Invalidos
//***********************************************
//***********************************************
function consultarQrInVal(){
  db.transaction(obtenerQrInVal,errorBD);
}

function obtenerQrInVal(tx){
  var query = "select * from qr where estatus = 0";
  tx.executeSql(query,[],listarQr,errorBD);   
}


function listarQr(tx,results){        
    var tabla ="";       
   for(var i =0;i<results.rows.length;i++){
     var qr = results.rows.item(i);     
       //alert(qr.id_qr); 
       tabla+="<tr>";       
       tabla+="<td>";
       tabla+="<span>"+qr.id_qr+"</span>";
       tabla+="</td>";
       tabla+="<td>";
       tabla+="<span>"+qr.fecha_consulta+"</span>";
       tabla+="</td>";
       tabla+="<td>";
       if(qr.estatus==1){           
          tabla+="<span class='icon icon-checkmark qr_valido'></span>";
       }else{
          tabla+="<span class='icon icon-cross qr_invalido'></span>";
       }
       
       tabla+="</td>";
       tabla+="<td>";
       //
       var ruta="";
       ruta = "onclick='window.open('"+qr.url+"','_system')'";
       ruta="<a href='"+qr.url+"' data-role='button'>"+
                 "<span class='icon icon-IE'></span>"+
              "</a>";       
       //alert(ruta);
       tabla+=ruta;
       tabla+="</td>";       
       tabla+="</tr>";
    }      
    $("#tb_body").empty().append(tabla);
    $("#t_historico").trigger("create");
                        
}

//**********************************************
//**********************************************
function guardarQr(){       
   db.transaction(guardarInfoQr,errorBD);
}

function guardarInfoQr(tx){    
  var fecha = formatofechaGuardado();    
  var sqlinsert = "insert into qr("+
      "url,estatus,fecha_consulta) values ('"+$urlQr+"','"+$estatus+"','"+fecha+"')";
  tx.executeSql(sqlinsert,[],registroQrSoucess,errorBD);
      
}

function registroQrSoucess(){
    alert("Guardado");   
}
//**********************************************
//**********************************************
//


function leerQr(){

  $("#capturar").click(function(){  
   //alert("Leyendo Qr");
        $("#div_mensaje_qr").fadeOut();
        $("#div_opciones_ver").fadeOut();
        $("#capturar").fadeOut();
        $("#div_pedimento").fadeOut();
       cordova.plugins.barcodeScanner.scan(
      function (result) {
          //alert("We got a barcode\n" +
          //"Result: " + result.text + "\n" +
          //"Format: " + result.format + "\n" +
          //"Cancelled: " + result.cancelled);          
          //*************************************          
          //$p = $("#cadena").val();  
          $p=result.text;
          $urlQr = $p;
          $("#area_qr").removeClass(); 
          $("#icon_resp").removeClass(); 
          $("#mensaje_color").removeClass();        
          //console.log("Valor Cadena: "+$p);  
          //console.log("Valor Qr"+$cadenaQr);
          $("#area_qr").fadeIn();
          $("#div_mensaje_qr").fadeIn();      
      
          if($p.indexOf($cadenaQr)!=-1){      
             $("#area_qr").addClass("qr_valido");        
             $("#icon_resp").addClass("icon icon-checkmark centro");
             $("#mensaje_color").addClass("qr_valido");
             $("#span_msgr").text("Qr Valido");
             $("#b_mostrar").attr("href", $urlQr);  
             $estatus = 1;
          }else{       
             $("#area_qr").addClass("qr_invalido");
             $("#icon_resp").addClass("icon icon-blocked centro");
             $("#mensaje_color").addClass("qr_invalido");
             $("#span_msgr").text("Qr In valido"); 
             $("#b_mostrar").attr("href", "");   
             $estatus = 0;
          }
          $("#div_opciones_ver").fadeIn();
          $("#capturar").fadeIn(1000);
          //*************************************
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );            
  });

}


function formatofechaGuardado(){
    var fecha = new Date();
    var mes = fecha.getMonth()+1;
    var dia = fecha.getDate()+1;
    var ayo = fecha.getFullYear();
    
    fecha = ayo+"/"+mes+"/"+dia;
    return fecha;
}


function obtenerHora(){
  var fecha = new Date();
  var ayo = fecha.getFullYear();
  var mes = parserMes(fecha.getMonth());
  var dia = parserDia(fecha.getDay());
  var diaNum= fecha.getDate();
    
  var fechaActual = dia+" "+diaNum+" de "+mes+" del "+ayo;
 
  $("#fechaActual").text(fechaActual);
}

function parserDia(numdia){

    var dia = new Array(7);
    dia[0]="Domingo";
    dia[1]="Lunes";
    dia[2]="Martes";
    dia[3]="Miercoles";
    dia[4]="Jueves";
    dia[5]="Viernes";
    dia[6]="Sabado";
    return dia[numdia];
}

function parserMes(nummes){

    var mes = new Array(12);
    mes[0]="Enero";
    mes[1]="Febrero";
    mes[2]="Marzo";
    mes[3]="Abril";
    mes[4]="Mayo";
    mes[5]="Junio";
    mes[6]="Julio";
    mes[7]="Agosto";
    mes[8]="Septiembre";
    mes[9]="Octubre";
    mes[10]="Noviembre";
    mes[11]="Diciembre";
    return mes[nummes];
}

function guardarRegistro(){
   $("#b_guarda").click(function(){      
     $("#area_qr").fadeOut();   
     $("#div_mensaje_qr").fadeOut();
     $("#div_opciones_ver").fadeOut();   
     guardarQr();
   });

}


function consultarURL(){
   /*$("#b_mostrar").click(function(){
                
   //alert("Consultando desde el sitio: "+$p);
      getUrl($p);
       //console.log($texto);
       //cargarPagina($p);
       $("#div_pedimento").fadeIn();
   });
  */
}

$(document).on("pagebeforeshow","#p_historial",function(){
	 if(db!=null){
	  consultarQr();
	 }
});

//function cargarPagina($url){
  //  console.log("Cargando URL");
 //    $texto=  $("#div_aux_pedimento").load($url);
 //    console.log($texto.html());
//}


/*
   Funciòn para recuperar el contenido de la pagina
*/
  function getUrl($url){
      //alert("Consultando: "+$url);
   var contenido = $.get($url, function(data, estatus) {    
      console.log("Consulta Correcta");        
   })
  .done(function(data) {
      var regex = /(<([^>]+)>)/ig;
      var document_in="$(document).bind('mobileinit', function(){$.mobile.ajaxEnabled = false;$.mobile.linkBindingEnabled = false;$.mobile.hashListeningEnabled = false;$.mobile.pushStateEnabled = false;});";
      
      var prime_in="PrimeFaces.cw('Fieldset','widget_j_idt7',{id:'j_idt7'});";
      
      $nuevo = data.replace(regex," ");
      $nuevo = $nuevo.replace(document_in,"");
      $nuevo = $nuevo.replace(prime_in,"");      
      //$nuevo = $nuevo.replace(/\s\s\s*/g,"<td>");
      $nuevo = $nuevo.replace(/\s\s\s*/g,"");
      
      $inicio_div = '<div class="ui-grid-a">';
      $fin_div = '</div>';
      
      /*$arregloFormat = $nuevo.split("<td>");
      var i;
      for(i = 0;i<$arregloFormat.length;i++){
        console.log($arregloFormat[i]);      
      }*/
      
      $("#div_pedimento").html($nuevo);
      //$("#div_pedimento").fadeIn();
      //console.log($nuevo);       
  })
  .fail(function() {
    alert( "Ocurrio un error al consultar" );
  })
  .always(function() {
    //alert( "finished" );
    //Metodo que se ejecuta siempre  
  });  
}

function iniciarFunciones(){
  consultarQrAll();
  consultarQrValidos();
  consultarQrInavlidos();    
      
}

function consultarQrAll(){
  $("#b_todo").click(function(){
      consultarQr();    
   });

}

function consultarQrValidos(){
   $("#b_validos").click(function(){
      consultarQrVal();    
   });
}


function consultarQrInavlidos(){  
   $("#b_no_validos").click(function(){
      consultarQrInVal();    
   });
}



