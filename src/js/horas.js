(function() {
    const horas = document.querySelector('#horas')

    if(horas) {
        const categoria = document.querySelector('[name="categoria_id"]')
        const dias = document.querySelectorAll('[name="dia"]')
        const inputHiddenDia = document.querySelector('[name="dia_id"]')
        const inputHiddenHora = document.querySelector('[name="hora_id"]')

        categoria.addEventListener('change', terminoBusqueda)
        dias.forEach(dia => dia.addEventListener('change', terminoBusqueda))

        let busqueda = {
            categoria_id: +categoria.value || '',
            dia: +inputHiddenDia.value || ''
        }

        if(!Object.values(busqueda).includes('')) {
            buscarEventos();
        }

        document.querySelector('#horas ul').addEventListener('click', function(e) {
            if(e.target.tagName !== 'LI') return;
            if(e.target.classList.contains('horas__hora--deshabilitada')) return;
            seleccionarHora(e);
        })

        function terminoBusqueda(e) {
            busqueda[e.target.name] = e.target.value

            if(e.target.name === 'dia') {
                inputHiddenDia.value = e.target.value;
            }

            if(Object.values(busqueda).includes('')) {
                return
            }

            buscarEventos();
        }

        async function buscarEventos() {
            const { dia, categoria_id } = busqueda
            const url = `/api/eventos-horario?dia_id=${dia}&categoria_id=${categoria_id}`;

            const resultado = await fetch(url)
            const eventos = await resultado.json()

            mostrarHorasDisponibles(eventos);

            const horaId = inputHiddenHora.value;
            if(horaId) {
                const horaSeleccionada = document.querySelector(`[data-hora-id="${horaId}"]`);
                if(horaSeleccionada) {
                    horaSeleccionada.classList.remove('horas__hora--deshabilitada');
                    horaSeleccionada.classList.add('horas__hora--seleccionada');
                }
            }
        }

        function mostrarHorasDisponibles(eventos) {
            const horasOcupadas = eventos.map(evento => String(evento.hora_id));
            const horasLista = document.querySelectorAll('#horas li');

            horasLista.forEach(hora => {
                if(horasOcupadas.includes(hora.dataset.horaId)) {
                    hora.classList.add('horas__hora--deshabilitada');
                    hora.classList.remove('horas__hora--seleccionada');
                } else {
                    hora.classList.remove('horas__hora--deshabilitada');
                }
            });
        }

        function seleccionarHora(e) {
            // Deshabilitar la hora previa si hay un nuevo click
            const horaPrevia = document.querySelector('.horas__hora--seleccionada')
            if(horaPrevia) {
                horaPrevia.classList.remove('horas__hora--seleccionada')
            }

            // Agregar clase de seleccionado
            e.target.classList.add('horas__hora--seleccionada')
            inputHiddenHora.value = e.target.dataset.horaId
        }
    }
}) ();