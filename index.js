import pruebaJson from './Assets/prueba.json' assert {type: 'json'}


const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');




//IMPORTANTE, PARA ESTA DOCUMENTACIÓN COL ES EL ANCHO Y ROWS EL ALTO
//en un mapa estático el ancho del lienzo es el del numero de filas * el ancho de cada casilla, en uno dinámico es el que le digamos porque renderizamos en base a ese ancho

//lo primero es almacenar el json en un objeto, llamemoslo mapData
let mapData = pruebaJson;

canvas.width=700;
canvas.height=500



//para hacer el mapa siguiendo la documentación necesitamos: las columnas y filas, el tamaño de la casilla y las tiles, en el objeto json esto corresponde a:

//columnas: mapData.layer[0].height

//filas:  mapData.layer[0].height

//tamaño de la casilla:  mapData.height y mapData.width, lo normal es que ambos sean el mismo porque las casillas son cuadradas

//distribución de la casilla, son los datos, lo que es el mapa en si, corresponde a: mapData.layer[0].data

//hay una función que la hace para asistir al bucle que recorre el data

//la función getTile recibe como argumento la columna y la fila en la que estás y devuelve la posición en el array de la casilla

//la función es: this.tiles[row*map.cols+col]

//lo que hace multiplicar la posición en digamos x por el total de columnas, y luego sumarle la columna actual.voy a probar a imprimirlo en consola


//eso me da la cuarta posición de la tercera columna, ten en cuenta que empiezan por cero. Creo que aquí se lian con columnas y filas, el 2 sería la columna 3*8 que es el ancho de cada columna para que avanze 16 casillas, esto dejaría el indice en la tercera columna del array, luego le sumas la posición a eso y te deja en la cuarta posición de la tercera fila

//Eso era para empezar, luego para renderizarlo hacemos un bucle for doble, el primero recorre las columnas, que es el ancho, y dentro de este va en otro bucle recorriendo el alto. Dentro del alto llama a la función que le da la casilla y le pasa como valores la columna en la que está y la fila. 

//Comprueba que no sea cero que sería que no hay nada en la casilla y luego llama a draw image, la fuente de la imagen será tileAtlas, el donde empezar a cortar en x será la casilla que te ha dado la función-1 porque el indice de tiled empieza en 0 y lo multiplica por el tamaño de la casilla,

//el donde empezar a cortar en y aqui pone cero pero yo diría que sería como el anterio, el ancho y el alto a cortar son el de la casilla. La posición en el canvas es: en x la columna en la que esté * el ancho del tile, y en y lo mismo con la row. Los dos ultimos parametros  son el tamaño de la casilla. Vamos a probar

var map = {
  cols: mapData.height,
  rows: mapData.width,
  tSize: mapData.tileheight,
  Columns: mapData.tilesets[0].columns,
  tiles: mapData.layers[0].data,
  source: mapData.tilesets[0].image,

  getTile(col,row){

    return this.tiles[row*map.cols+col]
  }
}



//es importante crear la imagen para poder pasarle un objeto imagen al cdrawImage y adaptar el source a la ubicación de la imagen, el json te la da relativa a si mismo

let fuenteImagen = './Assets/'+map.source

let posicionX;
const imagenMapa = new Image();
imagenMapa.src = fuenteImagen

imagenMapa.onload=()=>{

  for(let c = 0; c< mapData.height;c++){
    for(let r = 0; r < mapData.height; r++){
      //conseguimos el id de la imagen
      let IdTile = map.getTile(c,r);
      IdTile-=1
      //con ese id conseguimos la posición en x
      let posX = (IdTile) % map.Columns * map.tSize

      //la posicion Y es Id/Columnas del stylesheet * ancho de casilla
      let posY = Math.floor(IdTile/map.Columns) * map.tSize

      ctx.drawImage(
        imagenMapa,
        posX,
        posY,
        map.tSize,
        map.tSize,
        r * map.tSize,
        c * map.tSize,
        map.tSize,
        map.tSize
      )

    }
  }
 
}
  //VALE, para calcular la posición en x no es con el tamaño de la imagen sino dividiendo con el % el id-1 y multiplicandolo por el numero de columnas pero del tileset no de la imagen, luego eso lo multiplicamos por cada casilla y nos da la x

  //para la posición en y se divide el id de la casilla por las columnas y se multiplica por el tamaño de la casilla, es importante hacer math floor de la division y ese resultado multiplicarlo por el tamaño

  //a la hora de dibujarlo la x y la y es la que hemos dicho mientras que la posición en x y en y es row * tamaño de la casilla y lo mismo con column, las ultimas son el ancho y alto que coinciden con el tamaño de la casilla

  console.log((Math.floor(50/32))*12)