const cursos = ['','Robotica', 'Servidores', 'Machine Learning', 'Videojuegos', 'Inteligencia Artificial','SRE','Bases de Datos','Hacking','UI/UX','Desarrollo web', 
]

document.addEventListener('DOMContentLoaded', function(){
    
    //Creacion de la galeria
    galleryCreated();

})


function galleryCreated(){
    const gallery = document.querySelector('.gallery-img');

    for(let i = 1; i <= 10 ; i++){
        const img = document.createElement('IMG');
        img.src = `build/img/curso${i}.webp`;
        img.dataset.imgId = i

        const titulo = document.createElement('H4')
        titulo.textContent = cursos[i]; 
        
        const list = document.createElement('LI');
        list.appendChild(img);
        list.appendChild(titulo)

        gallery.appendChild(list);
    }
}


