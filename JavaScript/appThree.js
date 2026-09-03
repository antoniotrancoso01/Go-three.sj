//Importação da biblioteca ThreeJS baseada no importmap
import * as THREE from 'three';

//Importação da biblioteca que nos permite importar objetos 3D em formato FBX baseada no importmap
import {FBXLoader} from 'FBXLoader';

//Importação da biblioteca que nos permite explorar a nossa cena através do importmap
import { PointerLockControls } from 'PointerLockControls';

document.addEventListener('DOMContentLoaded', Start);

//Criação de cena
var cena = new THREE.Scene();

//Código da câmara ortográfica
var camara = new THREE.OrthographicCamera(-1.5, 1.5, 1.3, -1.3, -10, 10);
camara.position.set(.4, 5, -3.4);
camara.lookAt(0, -90, 0);
camara.rotation.z = Math.PI * -1;

var renderer = new THREE.WebGLRenderer();

//Câmara perspetive (livre)
var camaraPerspetiva = new THREE.PerspectiveCamera(45, 4/3, 0.1, 100);

renderer.setSize(window.innerWidth -15, window.innerHeight-80);
renderer.setClearColor(0xaaaaaa);

document.body.appendChild(renderer.domElement);

//Criação dos componentes da cadeira cadeira
var geometriaAssento = new THREE.BoxBufferGeometry(1,.5,1);
var geometriaCostas = new THREE.BoxBufferGeometry(.9,7,.2);
var geometriaPernas = new THREE.BoxBufferGeometry(.1,3,.1);
var geometriaBraco = new THREE.BoxBufferGeometry(.3,.5,1.3);

//------------------------TEXTURAS---------------------------------
var texturaAlmofada = new THREE.TextureLoader().load('./Images/pillow.jpg');

var texturaCadeira = new THREE.TextureLoader().load('./Images/madeira.jpg');
var materialCadeira = new THREE.MeshStandardMaterial({map:texturaCadeira});

var texturaMesa = new THREE.TextureLoader().load('./Images/backgroundGO.jpg')
var texturaRingue = new THREE.TextureLoader().load('./Images/ringueTextura.jpg')
var texturaPC = new THREE.TextureLoader().load('/Images/pcTextura.jpg')

var texturaTaca = new THREE.TextureLoader().load('./Images/texturaMadeira.jpg');

var texturaBaixo = new THREE.TextureLoader().load('./Images/texturaBaixo.jpg');
var materialBaixo = new THREE.MeshStandardMaterial({map:texturaBaixo});

var texturaTampo = new THREE.TextureLoader().load('./Images/texturaTampo.jpg');
var materialTampo = new THREE.MeshStandardMaterial({map:texturaTampo});

var texturaFoto = new THREE.TextureLoader().load('./Images/PPTRANCAS.jpeg');
var materialFoto = new THREE.MeshStandardMaterial({map: texturaFoto});

var texturaControlos = new THREE.TextureLoader().load('./Images/controlss.png');
var materialControlos = new THREE.MeshStandardMaterial({map: texturaControlos});

var texturaPrint = new THREE.TextureLoader().load('./Images/print.jpg');
var materialPrint = new THREE.MeshStandardMaterial({map: texturaPrint});

var texturaTopo = new THREE.TextureLoader().load('./Images/topoMesa.jpg');
var MaterialTopo = new THREE.MeshStandardMaterial({map:texturaTopo});

//-------------------------------CRIAÇÃO DA CADEIRA---------------------
const cadeira1 = criarCadeira();
const cadeira2 = criarCadeira();

//------------------------------CRIAÇÃO DA TAÇA--------------------------
const taca1 = criarTaca();
const taca2 = criarTaca();

//------------------------------CRIAÇÃO DA ALMOFADA----------------------
const almofada1 = criarAlmofada();
const almofada2 = criarAlmofada();

//------------------------MESA DO LADO--------------------------------
//Parte da baixo
var geometriaBaixo = new THREE.BoxBufferGeometry(1.5,1.5,4.5);
var meshBaixo = new THREE.Mesh(geometriaBaixo, materialBaixo);
meshBaixo.translateZ(-3,0);
meshBaixo.translateY(-2,0);
meshBaixo.translateX(-9,0);

//Tampo
var geometriaTampo = new THREE.BoxBufferGeometry(1.8, .2, 4.9);
var meshTampo = new THREE.Mesh(geometriaTampo, materialTampo);
meshTampo.translateZ(-3,0);
meshTampo.translateY(-1.2,0);
meshTampo.translateX(-9,0);

const mesaLado = new THREE.Group()
mesaLado.add(meshBaixo);
mesaLado.add(meshTampo);


//-----------------------------FOTOS---------------------------------
var geometriaFoto = new THREE.BoxBufferGeometry(.7,.01,.5);
var meshFoto = new THREE.Mesh(geometriaFoto, materialFoto);
meshFoto.translateZ(-1.5,0);
meshFoto.translateY(-1.1,0);
meshFoto.translateX(-9,0);


var meshControlos = new THREE.Mesh(geometriaFoto, materialControlos);
meshControlos.translateZ(-4.5,0);
meshControlos.translateY(-1.1,0);
meshControlos.translateX(-9,0);

var geometriaPrint = new THREE.BoxBufferGeometry(1.3,.01,.75);
var meshPrint = new THREE.Mesh(geometriaPrint, materialPrint);
meshPrint.translateZ(-2.82,0);
meshPrint.translateY(-.3,0);
meshPrint.translateX(-9.15,0);
meshPrint.rotation.x = Math.PI / 2;
meshPrint.rotateZ(80.06);

//---------------------TOPO DA MESA--------------------------
var geometriaTopo = new THREE.BoxBufferGeometry(2,.01,2.01);
var meshTopo = new THREE.Mesh(geometriaTopo, MaterialTopo)
meshTopo.translateX(.38,0);
meshTopo.translateY(-1.7,0);
meshTopo.translateZ(-3.17,0);

meshTopo.rotation.y = Math.PI;


//-------------------------GRID DA MESA----------------------------
const gridHelper = new THREE.GridHelper(1.508, 8);
gridHelper.position.x = .369;
gridHelper.position.y = -1.69;
gridHelper.position.z = -3.175;


//VARIÁVEIS PARA MUDANÇAS NO CENÁRIO
var luz1 = true;
var cadeiraAtirada = false;
var idAnim;
var cam = false;
var isCamPer = false;
var pecasBrancas = [];
var pecasPretas = [];
var pecasAdicionadas = false;
var isBlackTurn = true;
var cor;
var pecasWhite;
var pecasAnim = false;


//VARIAVEIS DO JOGO
var objetos = [];
var tamanho = 1.508;
var divisoes = 8;
const limiteMin = -4
const limiteMax = 4
var tamanhoCelula = tamanho / divisoes;
var pecas = {};
var ocupadas = {}; // Um objeto para rastrear as posições ocupadas
var coordenadasX = []; // Array para armazenar as coordenadas X
var coordenadasY = []; // Array para armazenar as coordenadas Y
var celulaX = 0, celulaY = 0;


//-----------------------------PEÇA GUIA-------------------------------------------
var geometriaPeca1 = new THREE.SphereGeometry(0.07, 32, 32);
geometriaPeca1.scale(1, 0.5, 1);
var materialTextura1 = new THREE.MeshStandardMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
var meshPecaJogo = new THREE.Mesh(geometriaPeca1, materialTextura1);


//Variável com o objeto responsável por importar ficheiros FBX
var importer = new FBXLoader();

//IMPORTAÇÃO DE MESA
importer.load('./Objetos/mesa4.fbx', function (object) {

    object.traverse(function (child) {
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = texturaMesa;
        }
    });

    //Adiciona o objeto importado à cena
    cena.add(object);

    //Mudar a escala do objeto nos eixos
    object.scale.x = 0.1;
    object.scale.y = 0.1;
    object.scale.z = 0.1;

    //Mudar a posição da mesa
    object.position.x = 0.5;
    object.position.y = -2.5;
    object.position.z = -3.0;
    

    //Guardar o objeto importado na variável objetoImportado
    objetoImportado = object;
});


//IMPORTAÇÃO DO RINGUE 
importer.load('./Objetos/ringue2.fbx', function (object) {

    object.traverse(function (child) {
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = texturaRingue;
        }
    });

    //Adiciona o objeto importado à cena
    cena.add(object);

    //Mudar a escala do objeto nos eixos
    object.scale.x = 0.02;
    object.scale.y = 0.01;
    object.scale.z = 0.02;

    //Mudar a posição do ringue
    object.position.x = 0;
    object.position.y = -3.5;
    object.position.z = -2.0;

    //Guardar o objeto importado na variável objetoImportado
    objetoImportado = object;
});


//IMPORTAÇÃO DE PEÇAS PRETAS
importer.load('./Objetos/pecas.fbx', function (object) {

    object.traverse(function (child) {
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
            var black = new THREE.Color(0x454545);
            child.material.color = black;
        }
    });

    //Adiciona o objeto importado à cena
    cena.add(object);

    //Mudar a escala do objeto nos eixos
    object.scale.x = 4;
    object.scale.y = 4;
    object.scale.z = 4;

    //Mudar a posição das peças pretas
    object.position.x = -.1;
    object.position.y = -.9;
    object.position.z = -5;

    //Guardar o objeto importado na variável objetoImportado
    objetoImportado = object;
});

//IMPORTAÇÃO DE PEÇAS BRANCAS
importer.load('./Objetos/pecas.fbx', function (white) {

    white.traverse(function (child) {
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
            var black = new THREE.Color(0xffffff);
            child.material.color = black;
        }
    });

    //Adiciona o objeto importado à cena
    cena.add(white);

    //Mudar a escala do objeto nos eixos
    white.scale.x = 4;
    white.scale.y = 4;
    white.scale.z = 4;

    //Mudar a posição das peças brancas
    white.position.x = 0.25;
    white.position.y = -0.9;
    white.position.z = -1;

    //Guardar o objeto importado na variável objetoImportado
    objetoImportado = white;
});


//IMPORTAÇÃO DO COMPUTADOR
importer.load('./Objetos/pc.fbx', function (object) {

    object.traverse(function (child) {
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.map = texturaPC;
        }
    });

    //Adiciona o objeto importado à cena
    cena.add(object);

    //Mudar a escala do objeto nos eixos
    object.scale.x = 1;
    object.scale.y = 1;
    object.scale.z = 1;

    //Mudar a posição das peças pretas
    object.position.x = -9;
    object.position.y = -.5;
    object.position.z = -3;

    object.rotateZ(-80);

    //Guardar o objeto importado na variável objetoImportado
    objetoImportado = object;
});

//Definição da câmara e do renderer a serem associados ao ao PointerLockControls
const controls = new PointerLockControls(camaraPerspetiva, renderer.domElement)

//Ativação do PointerLockControls através do clique na cena
//Para desativar o PointerLockControls, basta pressionar a tecla Esc
 document.addEventListener(
  'click',
  function(){
    if(isCamPer)
        {
            controls.lock()
        }
  },
  false  
);

//Adiciona o listener que permite detetar quando uma tecla é premida
document.addEventListener("keydown", onDocumentKeyDown, false);

//Função que permite processar o evento de premir teclas e definir o seu respetivo comportamento
function onDocumentKeyDown(event)   {
    var keyCode = event.which;

    //Comportamento para a tecla W
    if(keyCode == 87)
    {
        controls.moveForward(0.75)
    }
    //Comportamento para a tecla S
    else if(keyCode == 83)
    {
        controls.moveForward(-0.75)
    }
    //Comportamento para a tecla A
    else if(keyCode == 65)
    {
        controls.moveRight(-0.75)
    }
    //Comportamento para a tecla D
    else if(keyCode == 68)
    {
        controls.moveRight(0.75)
    }
};


//Carregamento das texturas para variáveis
var texture_dir = new THREE.TextureLoader().load('./Skybox/posx.jpg'); //Imagem da direita
var texture_esq = new THREE.TextureLoader().load('./Skybox/negx.jpg'); //Imagem da esquerda
var texture_up = new THREE.TextureLoader().load('./Skybox/posy.jpg'); //Imagem de cima
var texture_dn = new THREE.TextureLoader().load('./Skybox/negy.jpg'); //Imagem de baixo
var texture_bk = new THREE.TextureLoader().load('./Skybox/posz.jpg'); //Imagem de trás
var texture_ft = new THREE.TextureLoader().load('./Skybox/negz.jpg'); //Imagem da frente

//Array que vai armazenar as texturas
var materialArray = [];

//Associar as texturas carregadas ao array
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dir } ));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_esq } ));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up } ));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn } ));
materialArray.push(new THREE.MeshBasicMaterial( {map: texture_bk}));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft } ));


//Ciclo para fazer com que todas as texturas do array sejam aplicadas na parte interior do cubo
for (var i = 0; i < 6; i++)
{
    materialArray[i].side = THREE.BackSide;
}

//Criação da geometria da skybox
var skyboxGeo = new THREE.BoxGeometry(100, 100, 100);

//Criação da mesh que vai conter a geometria e as texturas
var skybox = new THREE.Mesh(skyboxGeo, materialArray);

//Adicionar a Skybox à cena
cena.add(skybox);


function Start()
{
    //Adicionar objetos à cena
    cena.add(cadeira1);
    cena.add(cadeira2);
    cena.add(taca1);
    cena.add(taca2);
    cena.add(almofada1);
    cena.add(almofada2);
    cena.add(meshTopo);
    cena.add(mesaLado);
    cena.add(meshFoto);
    cena.add(meshControlos);
    cena.add(gridHelper);
    cena.add(meshPrint);

    //Colocar objetos nos sítios certos
    cadeira2.translateZ(-6.5);
    cadeira2.rotateY(-135);
    taca2.translateZ(4);
    taca2.translateX(.37);
    almofada2.translateZ(4.5);
    almofada2.translateX(-.35);

    //Guardar posições originiais para mais tarde voltar à posição(depois da animação)
    var posicaoOriginalCadeira = { x: cadeira2.position.x, y: cadeira2.position.y, z: cadeira2.position.z};
    var rotacaoOriginalCadeira = { x: cadeira2.rotation.x, y: cadeira2.rotation.y, z: cadeira2.rotation.z };

    var posicaoOriginalAlmofada = { x: almofada2.position.x, y: almofada2.position.y, z: almofada2.position.z};
    var rotacaoOriginalAlmofada = { x: almofada2.rotation.x, y: almofada2.rotation.y, z: almofada2.rotation.z };

    var posicaoOriginalTaca = { x: taca2.position.x, y: taca2.position.y, z: taca2.position.z};
    var rotacaoOriginalTaca = { x: taca2.rotation.x, y: taca2.rotation.y, z: taca2.rotation.z };


    //Criação de dois focos de luz com a cor branca (#fffff) e intensidade a 1 (intensidade normal)
    var focoLuz = new THREE.SpotLight('#ffffff', 1);

    var focoluz2 = new THREE.AmbientLight('fffff', 1);

    //Mudar a posição da luz para ficar 5 unidades acima de onda a câmara se encontra
    focoLuz.position.y = 5;
    focoLuz.position.z = 10;

    //Adicionamos a light à cena
    cena.add(focoLuz);

    //LIGAR/DESLIGAR SPOTLIGHT
    document.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowLeft') { // Verifica se a tecla pressionada é a seta para a esquerda
            // Inverte o estado da luz
            luz1 = !luz1;
    
            if (luz1) {
                // Ligar a luz
                focoLuz.intensity = 1;
            } else {
                // Desligar a luz
                focoLuz.intensity = 0;
            }
        }
    })

    //LIGAR/DESLIGAR AMBIENTLIGHT
    document.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowRight') { // Verifica se a tecla pressionada é a seta para a direita
            // Inverte o estado da luz
            luz1 = !luz1;
    
            if (luz1) {
                // Ligar a luz
                cena.add(focoluz2);
            } else {
                // Desligar a luz
                cena.remove(focoluz2);
            }
        }
    })

    //ADICIONAR/REMOVER PEÇAS ALEATÓRIAS À MESA
    document.addEventListener('keydown', function(event) {
        if (event.key === "ArrowUp") {  //Verifica se a tecla pressionada é a seta para cima
            
            if (pecasAdicionadas) {
                removerPecasCena(); //Retira no caso de estarem lá
            } else {
                adicionarPecasCena();   //Adiciona no caso de não estarem
            }
        }
    });

    //ANIMAÇÃO
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') { // Verifica se a tecla pressionada é o espaço
            cadeiraAtirada = !cadeiraAtirada;

            if(cadeiraAtirada)
            {
                //Cancela a animação e retorna todos os objetos à posição original
                cancelAnimationFrame(idAnim);   //Para a animação
                cadeira2.position.set(posicaoOriginalCadeira.x, posicaoOriginalCadeira.y, posicaoOriginalCadeira.z);    //Retorna tudo à posição original
                cadeira2.rotation.set(rotacaoOriginalCadeira.x, rotacaoOriginalCadeira.y, rotacaoOriginalCadeira.z);
                
                almofada2.position.set(posicaoOriginalAlmofada.x, posicaoOriginalAlmofada.y, posicaoOriginalAlmofada.z);
                almofada2.rotation.set(rotacaoOriginalAlmofada.x, rotacaoOriginalAlmofada.y, rotacaoOriginalAlmofada.z);

                taca2.position.set(posicaoOriginalTaca.x, posicaoOriginalTaca.y, posicaoOriginalTaca.z);
                taca2.rotation.set(rotacaoOriginalTaca.x, rotacaoOriginalTaca.y, rotacaoOriginalTaca.z);

                //Tira as peças do chão
                removerPecasAnim();
            }
            else{
                adicionarPecasAnim();   //Adiciona peças ao chão
                requestAnimationFrame(atirarCadeira()); //Chama a função da animação
            }
        }
    })

    
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Enter') { // Verifica se a tecla pressionada é o Enter
            cam = !cam;

            if(cam)
            {
                renderer.render(cena, camara); //Renderiza a cena com a câmara ortográfica
                isCamPer = false;
            }
            else{
                renderer.render(cena, camaraPerspetiva);    //Renderiza a cena com a câmara perspetiva
                isCamPer = true;
                requestAnimationFrame(loop);
            }
        }
    })

    criarPecasPretas(gridHelper, celulaX, celulaY); //Chamamos a função com a nossa grid (9x9) e celulaX/celulaY = [0,0] que são as coordenadas
        
    //TECLAS PARA MOVIMENTAR A PEÇA DE GUIA
    document.addEventListener('keydown', function(event) {
        if (event.key === "k") {
            //Retira um valor ao y
            movePeca(0, -1);
        } else if (event.key === "i") {
            //Adicona um valor ao y
            movePeca(0, 1);
        } else if (event.key === "j") {
            //Adiciona um valor ao x
            movePeca(1, 0);
        } else if (event.key === "l") {
            //Retira um valor ao x
            movePeca(-1, 0);
        }
    });

    //Clicar no botão restart na caixa
    document.getElementById('restartButton').addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique no botão propague para outros elementos
        reiniciarJogo();
    });

    //Clicar no botão cancelar na caixa
    document.getElementById('cancelButton').addEventListener('click', (event) => {
        event.stopPropagation(); // Impede que o clique no botão propague para outros elementos
        document.getElementById('endGameMenu').style.display = 'none';
    });

    //Adicionar peça ao tabuleiro com o mouseclick
    document.addEventListener('click', function(event) {
        colocarPeca(celulaX, celulaY);
    });

}


//Função para renderizar o ambiente nos dois tipos de câmara que se chama a si própria fazendo um ciclo infinito.
function loop()
{
    if(cam)
    {
        isCamPer = false;
        renderer.render(cena, camara);
    }
    else
    {
        renderer.render(cena, camaraPerspetiva);
        isCamPer = true;
    }

    requestAnimationFrame(loop);
}


//Função para a animação. Invocada ao clicar no espaço
function atirarCadeira()
{
    //Mudanças na cadeira
    cadeira2.translateY(.15);
    cadeira2.translateX(.15);
    cadeira2.rotateZ(-.005);

    //Mudanças na almofada
    almofada2.translateY(.1);
    almofada2.translateX(.2);
    almofada2.rotateZ(-.003);

    //Mudanças na taça
    taca2.position.y = -1.9;

    idAnim = requestAnimationFrame(atirarCadeira);
}


//Função para criar as cadeiras (objetos complexos)
function criarCadeira()
{
    //Criação do assento
    var meshAssento = new THREE.Mesh(geometriaAssento, materialCadeira);
    meshAssento.translateZ(-5.5,0);
    meshAssento.translateY(-2,0);
    meshAssento.translateX(.4,0);

    meshAssento.scale.x = .7;
    meshAssento.scale.y = .3;
    meshAssento.scale.z = .7;


    //Criação das costas
    var meshCostas = new THREE.Mesh(geometriaCostas, materialCadeira);
    meshCostas.translateZ(-5.9,0);
    meshCostas.translateY(-1,0);
    meshCostas.translateX(.4,0);

    meshCostas.scale.x = .7;
    meshCostas.scale.y = .3;
    meshCostas.scale.z = .7;


    //Criação das 4 pernas
    var meshPerna1 = new THREE.Mesh(geometriaPernas, materialCadeira);
    meshPerna1.translateZ(-5.9,0);
    meshPerna1.translateY(-2.4,0);
    meshPerna1.translateX(.1,0);
    meshPerna1.scale.x = .7;
    meshPerna1.scale.y = .3;
    meshPerna1.scale.z = .7;


    var meshPerna2 = new THREE.Mesh(geometriaPernas, materialCadeira);
    meshPerna2.translateZ(-5.9,0);
    meshPerna2.translateY(-2.4,0);
    meshPerna2.translateX(.7,0);
    meshPerna2.scale.x = .7;
    meshPerna2.scale.y = .3;
    meshPerna2.scale.z = .7;


    var meshPerna3 = new THREE.Mesh(geometriaPernas, materialCadeira);
    meshPerna3.translateZ(-5.2,0);
    meshPerna3.translateY(-2.4,0);
    meshPerna3.translateX(.7,0);
    meshPerna3.scale.x = .7;
    meshPerna3.scale.y = .3;
    meshPerna3.scale.z = .7;


    var meshPerna4 = new THREE.Mesh(geometriaPernas, materialCadeira);
    meshPerna4.translateZ(-5.2,0);
    meshPerna4.translateY(-2.4,0);
    meshPerna4.translateX(.1,0);
    meshPerna4.scale.x = .7;
    meshPerna4.scale.y = .3;
    meshPerna4.scale.z = .7;

    //Criação do braço
    var meshBraco = new THREE.Mesh(geometriaBraco, materialCadeira);
    meshBraco.translateZ(-5.5,0);
    meshBraco.translateY(-1.3,0);
    meshBraco.translateX(.05,0);
    meshBraco.scale.x = .7;
    meshBraco.scale.y = .3;
    meshBraco.scale.z = .7;


    //Agrupar todos os elementos
    const cadeira = new THREE.Group();
    cadeira.add(meshAssento);
    cadeira.add(meshCostas);
    cadeira.add(meshPerna1);
    cadeira.add(meshPerna2);
    cadeira.add(meshPerna3);
    cadeira.add(meshPerna4);   
    cadeira.add(meshBraco); 

    return cadeira;
}


//Função para criar uma taça (objeto complexo)
function criarTaca()
{
    //Criação dos "lados" da taça
    const points = [];
    for ( let i = 0; i < 10; i ++ ) 
    {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
    }
    const geometry = new THREE.LatheGeometry( points );
    const material = new THREE.MeshStandardMaterial( { map: texturaTaca,side: THREE.DoubleSide } );
    const lathe = new THREE.Mesh( geometry, material );

    //Criação da base da taça
    const circleForm = new THREE.CircleGeometry( 5, 13 ); 
    const circle = new THREE.Mesh( circleForm, material ); 

    //Colocar as peças nos sítios em que é suposto estarem
    lathe.position.y = -1;
    lathe.position.x = 0.04;
    lathe.position.z = -5.2;
    lathe.scale.set(0.02, 0.02, 0.02);
    circle.scale.set(0.021,0.021,0.021);
    circle.rotateX(Math.PI/2);
    circle.position.y = -1.2;
    circle.position.x = 0.04;
    circle.position.z = -5.2;

    //Agrupar os elementos
    const Taca=new THREE.Group();
    Taca.add(lathe);
    Taca.add(circle);

    return Taca;
}


//Função para criar uma almofada
function criarAlmofada()
{
    //Criação das propriedades da almofada (extrude)
    const length = 12, width = 8;

    const shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length, width );
    shape.lineTo( length, 0 );
    shape.lineTo( 0, 0 );

    const extrudeSettings = {
        steps: 2,
        depth: 16,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
    };

    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
    const material = new THREE.MeshStandardMaterial( { map: texturaAlmofada,side: THREE.DoubleSide } );
    const ALMOFADA = new THREE.Mesh( geometry, material ) ;

    //Mudança de tamanho da almofada
    ALMOFADA.scale.x = .042;
    ALMOFADA.scale.y = .03;
    ALMOFADA.scale.z = .03;

    //Colocar a almofada no sítio em que a queremos
    ALMOFADA.translateX(.15,0)
    ALMOFADA.translateY(-1.9,0)
    ALMOFADA.translateZ(-5.7,0)

    return ALMOFADA;
}


//Criação das peças pretas ao clicar na seta para cima
function criarPecasPretasCena()
{
    var objetos = [];

    for (var i = 0; i < 10; i++)     
    {
        //Criação das peças (objetos)
        var geometriaPeca = new THREE.SphereGeometry(0.05, 32, 32);
        geometriaPeca.scale(1, 0.5, 1);
        var materialTextura1 = new THREE.MeshStandardMaterial({ color: 0x00000 });
        var meshPeca = new THREE.Mesh(geometriaPeca, materialTextura1);

        // Definir posições aleatórias no cenário dentro do intervalo especificado
        meshPeca.position.x = Math.random() * 1.5 - .3;
        meshPeca.position.y = -1.7;
        meshPeca.position.z = Math.random() * 1.5 - 3.9;
        
        cena.add(meshPeca); //Adicionar peças ao cenário
        objetos.push(meshPeca); //Adicionar peças ao array "objetos"
    }

    return objetos;
} 


//Criação das peças brancas ao clicar na seta para cima
function criarPecasBrancasCena() 
{
    var objetos = [];

    for (var i = 0; i < 10; i++) 
    {
        //Criação das peças (objetos)
        var geometriaPeca = new THREE.SphereGeometry(0.05, 32, 32);
        geometriaPeca.scale(1, 0.5, 1);
        var materialTextura1 = new THREE.MeshStandardMaterial({ color: 0xffffff });
        var meshPeca = new THREE.Mesh(geometriaPeca, materialTextura1);

        // Definir posições aleatórias no cenário dentro do intervalo especificado
        meshPeca.position.x = Math.random() * 1.5 - .3;
        meshPeca.position.y = -1.7;
        meshPeca.position.z = Math.random() * 1.5 - 3.9;

        cena.add(meshPeca); //Adicionar peças ao cenário
        objetos.push(meshPeca); //Adicionar peças ao array "objetos"
    }

    return objetos;
} 


//Função para as peças brancas aparecerem durante a animação (ao clicar no espaço)
function criarPecasBrancasAnim() 
{
    var objetos = [];

    for (var i = 0; i < 20; i++) {
        //Criação das peças
        var geometriaPeca = new THREE.SphereGeometry(0.05, 32, 32);
        geometriaPeca.scale(1, 0.5, 1);
        var materialTextura1 = new THREE.MeshStandardMaterial({ color: 0xffffff });
        var meshPeca = new THREE.Mesh(geometriaPeca, materialTextura1);

        // Definir posições aleatórias no cenário dentro do intervalo especificado
        meshPeca.position.x = Math.random() * 1 - 0; 
        meshPeca.position.y = -3;
        meshPeca.position.z = Math.random() * 1.5 - 1.5;

        cena.add(meshPeca); //Adicionar estas peças à cena
        objetos.push(meshPeca); //Adicionar peças ao array "objetos"
    }

    return objetos;
}


//Função para adicionar peças à cena durante a animação
function adicionarPecasAnim()
{
    //Funciona apenas se as peças não estiverem já na cena
    if(!pecasAnim)
        {
            pecasWhite =  criarPecasBrancasAnim();
            pecasAnim = true;
        }
}


//Função para remover as peças da cena depois da animação
function removerPecasAnim()
{
    //Funciona apenas se as peças estiverem na cena
    if (pecasAnim) 
    {
        pecasWhite.forEach(function (peca) 
        {
            cena.remove(peca);
        });
        pecasAnim = false;
    }
}


//Função para adicionar peças pretas e brancas à cena ao clicar na seta para cima
function adicionarPecasCena() 
{
    if (!pecasAdicionadas) 
    {
        pecasBrancas = criarPecasBrancasCena();
        pecasPretas = criarPecasPretasCena();
        pecasAdicionadas = true;
    }
}


//Função para remover todas as peças da cena ao clicar na seta para cima 
function removerPecasCena() 
{
    if (pecasAdicionadas) 
    {
        pecasBrancas.forEach(function (peca) 
        {
            cena.remove(peca);
        });
        pecasPretas.forEach(function (peca) 
        {
            cena.remove(peca);
        });
        pecasAdicionadas = false;
    }
}


//Função para criar as peças que serão realmente jogadas pelo player
function createPecaJogo() 
{
    //Criação do objeto (peça)
    var geometriaPeca1 = new THREE.SphereGeometry(0.05, 32, 32);
    geometriaPeca1.scale(1, 0.5, 1);

    //Verificar qual a cor da jogada e aplicação de cor à peça
    cor = isBlackTurn ? 0x00000 : 0xffffff;
    isBlackTurn = !isBlackTurn;
    var materialTextura1 = new THREE.MeshStandardMaterial({ color: cor });
    var meshPecareturn = new THREE.Mesh(geometriaPeca1, materialTextura1);

    return meshPecareturn;
}


//Função para ver a peça guia a andar pela grid  MUDAR O NOME DA FUNÇÃO PARA ALGO MAIS ESPECÍFICO
function criarPecasPretas(GridHelper, celulaX, celulaY) 
{
    //Ciclo for para conseguir colocar peça no centro
    for (var i = 0; i < 1; i++) 
    {
        //IF para conseguir colocar a peça no centro
        if (!(celulaX === 0 && celulaY === 0 && i===0)) {
            ocupadas[celulaX + "," + celulaY] = true; // Marcar a posição como ocupada
            coordenadasX.push(celulaX); // Armazenar coordenada X
            coordenadasY.push(celulaY); // Armazenar coordenada Y
        }

        //Apenas deixar colocar nos vértices da grid
        meshPecaJogo.position.x = GridHelper.position.x + tamanhoCelula * celulaX;  
        meshPecaJogo.position.y = GridHelper.position.y;
        meshPecaJogo.position.z = GridHelper.position.z + tamanhoCelula * celulaY;

        //Adicionar peça de guia à cena
        cena.add(meshPecaJogo);
        objetos.push(meshPecaJogo);
    }

    return objetos;
}

//Função para mover a peça guia
function movePeca(deltaX, deltaY) 
{
    //Posição atual da peça
    const novoX = celulaX + deltaX;
    const novoY = celulaY + deltaY;

    //Verificar se tenta sair da grid (limiteMin = -4 e limiteMax = 4)
    if (novoX < limiteMin || novoX > limiteMax || novoY < limiteMin || novoY > limiteMax) {
        console.log('Movimento fora dos limites da grid.');
        return;
    }

    celulaX = novoX;
    celulaY = novoY;

    //Apenas deixar mover as peças pelos vértices da grid
    meshPecaJogo.position.x = gridHelper.position.x + tamanhoCelula * celulaX;
    meshPecaJogo.position.z = gridHelper.position.z + tamanhoCelula * celulaY;
}


//Função para colocar a peça no tabuleiro
function colocarPeca(x, y) 
{
    const posicaoChave = `${x},${y}`;   //Coordenadas atuais

    
    console.log(`Estado inicial de ocupadas:`, ocupadas); //Log para verificar o estado inicial
    // Verifica se a posição está ocupada
    if (ocupadas[posicaoChave]) {
        console.log('Posição já ocupada. Não é possível colocar uma peça aqui.')
        window.alert('Posição já ocupada. Não é possível colocar uma peça aqui.');
        return;
    }
    //Verifica se a jogada é suicída
    if (verificarSuicidio(x, y, cor)) {
        console.log('Jogada suicida. Não é possível colocar uma peça aqui.')
        window.alert('Jogada suicida. Não é possível colocar uma peça aqui.');
        return;
    }
    //Se passou nas duas cláusulas anteriores, colca-se a peça
    // Marca a posição como ocupada
    ocupadas[posicaoChave] = true;

    const pecaJogo = createPecaJogo();
    pecaJogo.position.x = gridHelper.position.x + tamanhoCelula * x;
    pecaJogo.position.y = -1.67;
    pecaJogo.position.z = gridHelper.position.z + tamanhoCelula * y;
    
    cena.add(pecaJogo); //Adiciona peça à cena

    //Adiciona a peça (posição e cor) ao "pecas"
    pecas[posicaoChave] = {
        mesh: pecaJogo,
        cor: cor
    };

    capturarPecas(x, y, cor);   //Verifica se a jogada atual foi para capturar alguma peça
    console.log(`Peça colocada em: (${x}, ${y})`);
}


//Função para verificar se a jogada foi para capturar alguma peça
function capturarPecas(x, y, cor) 
{
    //Direções das peças adjacentes
    const direcoes = [
        [0, 1], // cima
        [0, -1], // baixo
        [1, 0], // direita
        [-1, 0] // esquerda
    ];

    //Função para verificar se alguma peça ficou cercada
    function verificarCercadas(x, y, corAdversaria) 
    {
        let visitados = {}; //Variável para ter as posições já visitadas
        let stack = [[x, y]];   //Array que começa com as coordenadas iniciais (x,y recebidas por parâmetro)
        let grupo = []; //Array que contém as peças que fazem do grupo a ser verificado
        let cercado = true; 

        //CICLO DFS
        //Ciclo até a stack estar vazia
        while (stack.length > 0) 
        {
            const [cx, cy] = stack.pop();   //Retira a última posição da stack
            const posicaoChave = `${cx},${cy}`; //Guarda as coordenadas atuais

            if (visitados[posicaoChave]) continue;  //No caso das coordenadas já terem sido visitadas, avança o ciclo
            visitados[posicaoChave] = true; //Marca a posição atual como visitados
            grupo.push([cx, cy]);   //Adiciona ao grupo a ser verificado

            //Para cada posição
            direcoes.forEach(([dx, dy]) => {
                //Calcula as novas posições
                const nx = cx + dx;
                const ny = cy + dy;
                const novaPosicaoChave = `${nx},${ny}`; //Guarda a nova posição na variável
                const adjacente = pecas[novaPosicaoChave];  //Obtém a peça adjacente da peça a ser verificada

                // Verifica se a posição adjacente está dentro dos limites
                if (nx >= limiteMin && nx <= limiteMax && ny >= limiteMin && ny <= limiteMax) {
                    if (!adjacente) 
                    {  
                        //Se não houver peças adjacentes de modo a capturar, não está cercado
                        cercado = false;
                    } else if (adjacente.cor === corAdversaria && !visitados[novaPosicaoChave]) 
                    {
                        //Verifica a próxima peça na stack
                        stack.push([nx, ny]);
                    }
                }
            });
        }

        //Retorna o grupo de peças que foi verificado no caso de estar cercado, caso contrário retorna uma lista vazia
        return cercado ? grupo : [];
    }

    let pecasCapturadas = false;    //Verificar se alguma peça foi capturada

    //Executa a função "verificarCercadas" para cada peça à volta da peça atual
    direcoes.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        const posicaoChave = `${nx},${ny}`;
        const pecaAdversaria = pecas[posicaoChave];

        if (pecaAdversaria && pecaAdversaria.cor !== cor) {
            const grupoCercado = verificarCercadas(nx, ny, pecaAdversaria.cor);
            if (grupoCercado.length > 0) {
                grupoCercado.forEach(([gx, gy]) => removerPeca(gx, gy));    //Remove a peça no caso de estar cercada
                pecasCapturadas = true; //O jogo acaba
            }
        }
    });

    //Mostrar caixa de texto de vencedor
    if (pecasCapturadas) 
    {
        setTimeout(() => {
            anunciarVencedor(cor);
        }, 300);
    }
}


//Função para remover a peça capturada
function removerPeca(x, y) 
{
    //Aqui a posição chave é a da peça que está a ser verificada na função acima
    const posicaoChave = `${x},${y}`;
    const peca = pecas[posicaoChave];
    
    //Remove a peça da cena e dos arrays
    if (peca) 
    {
        cena.remove(peca.mesh);
        delete pecas[posicaoChave];
        delete ocupadas[posicaoChave];
    }
}


//Função para não deixar cometer suicídio
function verificarSuicidio(x, y, cor) 
{
    //Direções das peças adjacentes
    const direcoes = [
        [0, 1],  // cima
        [0, -1], // baixo
        [1, 0],  // direita
        [-1, 0]  // esquerda
    ];

    //Para cada direção, verifica
    for (const [dx, dy] of direcoes) {
        const nx = x + dx;
        const ny = y + dy;
        const posicaoChave = `${nx},${ny}`;

        // Verifica se a posição adjacente está dentro dos limites
        if (nx >= limiteMin && nx <= limiteMax && ny >= limiteMin && ny <= limiteMax) 
        {
            const adjacente = pecas[posicaoChave];
            // Verifica se há uma posição vazia ou uma peça da mesma cor
            if (!adjacente || adjacente.cor !== cor) 
            {
                return false;   //Não é suicídio
            }
        }
    }

    // Se todas as posições adjacentes são peças adversárias, é suicídio
    return true;
}


// Função para anunciar o vencedor e reiniciar o jogo
function anunciarVencedor(cor) {
    const vencedor = cor === 0x00000 ? 'Pretas' : 'Brancas';
    document.getElementById('winnerMessage').innerText = `Jogador com peças ${vencedor} ganhou!`;
    document.getElementById('endGameMenu').style.display = 'block';
}


// Função para reiniciar o jogo
function reiniciarJogo() 
{
    // Remove todas as peças do tabuleiro
    for (let chave in pecas) {
        cena.remove(pecas[chave].mesh);
    }
    //Coloca todos os arrays vazios
    pecas = {};
    ocupadas = {};
    coordenadasX = [];
    coordenadasY = [];
    celulaX = 0;
    celulaY = 0;
    isBlackTurn = true;

    // Reposiciona a peça guia no centro do tabuleiro
    meshPecaJogo.position.x = gridHelper.position.x;
    meshPecaJogo.position.z = gridHelper.position.z;
    renderer.render(cena, camaraPerspetiva);

    document.getElementById('endGameMenu').style.display = 'none';

    //Aparecer a última caixa de vencedor de jogo
    document.getElementById('restartButton').addEventListener('click', reiniciarJogo);
    document.getElementById('cancelButton').addEventListener('click', () => {
    document.getElementById('endGameMenu').style.display = 'none';
});
}