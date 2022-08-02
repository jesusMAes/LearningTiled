import pruebaJson from './Assets/prueba.json' assert {type: 'json'}
//el primer paso es importar el Json, lo cargamos en una variable


let mapData = pruebaJson;



//seleccionamos el canvas en el que dibujar

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height=500;


//para dibujar la imagen necesitamos una serie de propiedades que vienen en el json:
// -Nº de columnas(ancho) del mapa: mapData.height
// -Nº de filas(alto): mapData.width

//parece raro pero funciona, igualmente es mejor que el mapa sea cuadrado y coincidirán siempre

//-Tamaño de la casilla, son cuadradas por lo que también coincide: mapData.tileheight o tilewidth, da igual. 

//a la hora de iterar el array usaremos estas columnas para movernos por él y sacar la casilla, por tanto también necesitamos el array

//-Array con el mapa en Json: mapData.layers[0].data

//nota que las capas son un array por lo que es mejor recuperarlo como mapData.layers y con un bucle for o forEach hacer un renderizado de cada capa

//-Necesitamos la imagen del stylesheet: mapData.tilesets[0].image, y usar new Image() e image.src para crear una imagen html que poder renderizar

//tilesets es un array de objetos porque podemos usar más de un stylesheet, a la hora de renderizar en base al id renderizaremos desde un png u otro.

//de momento usaremos solo uno

//ahora que tenemos la imagen necesitamos su primer Id, a la hora de renderizar debemos restar este id al id que obtenemos del mapa

//Un ejemplo: Tenemos dos tilesets, la primera contiene 20 casillas y la segunda 10, en Json cada objeto tendrá una propiedad firstId, el de la primera sería 1 y el de la segunda sería 21, entonces si el Id de nuestra casilla es 23 nos estará pidiendo la segunda casilla de la segunda hoja, es decir: 23-21 = 2

//también necesitamos el numero de columnas del tilesets, que no tiene porqué coincidir con el de nuestro mapa y dependerá del tamaño de la imagen y del de cada casilla de la misma

//con eso ya podemos hacer la clase



class Map {
  constructor({
    mapData,
    c
  }){
    this.c = c
    this.columnas = mapData.height
    this.rows = mapData.width
    this.tileSize = mapData.tilewidth
    this.layers = mapData.layers
    this.tilesets = mapData.tilesets
    this.tilesArray = mapData.tilesets.map(function(object){
      return object.image
    })//array con las sources de cada tileset
    this.tilesetCreado = mapData.tilesets.map(function (object){
    
      let imagen = new Image();
      imagen.src = './Assets/'+object.image;
      return imagen
    })
    this.tilesetColumns = mapData.tilesets[0].columns//sustituir luego, se carga en función


  }

  //el metodo getTile recupera el id de la posición del array que estamos recorriendo
  getTile(data,col, row){
    return data[row * this.columnas + col]
  }


  draw(frame){

    const ctx = this.c//canvas en el que dibujaremos
    let currentFrame = frame
    let layers = [];
    layers = this.layers
    let animaciones = this.tilesets[0].tiles
    //dentro del metodo podemos cambiar la currentImage en base al id
    //TODO PROBAR CAMBIAR IMAGEN
    let currentImage = this.tilesetCreado[0]
  

    layers.forEach(layer =>{
      let data = layer.data
  
      for(let c = 0; c < this.columnas; c++){
        for(let r = 0; r < this.columnas; r++){
          
          //conseguimos el id de la imagen
          let idTile = this.getTile(data,c,r);
          idTile -=1
          //comprobamos si el tile tiene animación


          //usamos el id para obtener la posición en X
          let posX = (idTile % this.tilesetColumns) * this.tileSize;

          //encontramos la posición en Y
          let posY = (Math.floor(idTile/this.tilesetColumns))*this.tileSize

           //con esas coordenadas ya podemos dibujarlo

           
           

           ctx.drawImage(
            currentImage,//imagen a dibujar
            posX, //posicion donde empezar a cortar en X
            posY, //posicion donde empezar a cortar en y
            this.tileSize, //ancho a cortar
            this.tileSize, //alto a corta
            c * this.tileSize, //donde dibujarlo en x
            r * this.tileSize, //donde dibujarlo en y
            this.tileSize, //ancho de la imagen final
            this.tileSize //alto de la imagen final
           )
        }
      }
    })
  }//metodo draw

}
 
const mapa = new Map({
  mapData:mapData,
  c:ctx
})

 
let animateRatio=0
function animate(){
 let frame =  window.requestAnimationFrame(animate)
  mapa.draw(frame)

}


animate()