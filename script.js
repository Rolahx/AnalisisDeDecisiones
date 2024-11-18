let alternativaIndex = 1;
const alternativasContainer = document.getElementById('alternativasContainer');
const canvas = document.getElementById('decisionTreeCanvas');
const ctx = canvas.getContext('2d');

function agregarAlternativa() {
    const alternativaDiv = document.createElement('div');
    alternativaDiv.className = 'alternativa';

    alternativaDiv.innerHTML = `
        <h3>Alternativa ${alternativaIndex}</h3>
        <input type="text" class="nombreAlternativa" placeholder="Nombre de la alternativa">
        <div class="estadosContainer"></div>
        <button type="button" class="agregarEstado">Agregar Estado de la Naturaleza</button>
    `;
    alternativasContainer.appendChild(alternativaDiv);
    alternativaIndex++;

    alternativaDiv.querySelector('.agregarEstado').addEventListener('click', () => agregarEstado(alternativaDiv));
}

function agregarEstado(alternativaDiv) {
    const estadosContainer = alternativaDiv.querySelector('.estadosContainer');
    const estadoDiv = document.createElement('div');
    estadoDiv.className = 'estado';

    estadoDiv.innerHTML = `
        <input type="text" class="nombreEstado" placeholder="Nombre del estado">
        <input type="number" class="valorEstado" placeholder="Valor">
        <input type="number" class="probabilidadEstado" placeholder="Probabilidad (0-1)" step="0.01">
    `;
    estadosContainer.appendChild(estadoDiv);
}

document.getElementById('agregarAlternativa').addEventListener('click', agregarAlternativa);

document.getElementById('calcular').addEventListener('click', () => {
    const alternativas = Array.from(document.querySelectorAll('.alternativa'));
    const decisionData = [];
    let resultados = [];
    let mejorAlternativa = "";
    let mayorValorEsperado = -Infinity;

    alternativas.forEach((alt) => {
        const nombreAlternativa = alt.querySelector('.nombreAlternativa').value;
        const estados = Array.from(alt.querySelectorAll('.estado'));
        let valorEsperado = 0;
        let sumaProbabilidades = 0;
        const estadosData = [];

        estados.forEach((est) => {
            const nombreEstado = est.querySelector('.nombreEstado').value;
            const valor = parseFloat(est.querySelector('.valorEstado').value);
            const probabilidad = parseFloat(est.querySelector('.probabilidadEstado').value);
            sumaProbabilidades += probabilidad;
            valorEsperado += valor * probabilidad;

            estadosData.push({ nombreEstado, valor, probabilidad });
        });

        if (sumaProbabilidades !== 1) {
            alert(`La suma de probabilidades para "${nombreAlternativa}" no es 1.`);
            return;
        }

        decisionData.push({ nombreAlternativa, valorEsperado, estados: estadosData });
        resultados.push(`Alternativa "${nombreAlternativa}": Valor Esperado = ${valorEsperado.toFixed(2)}`);

        if (valorEsperado > mayorValorEsperado) {
            mejorAlternativa = nombreAlternativa;
            mayorValorEsperado = valorEsperado;
        }
    });

    document.getElementById('resultado').innerHTML = `
        ${resultados.join('<br>')}
        <br><strong>Mejor Decisión:</strong> "${mejorAlternativa}" con valor esperado de ${mayorValorEsperado.toFixed(2)}.
    `;
    dibujarArbol(decisionData);
});

function dibujarArbol(decisionData) {
    const totalHeight = decisionData.reduce((acc, alt) => acc + (alt.estados.length * 120) + 100, 200);
    canvas.width = 1000;
    canvas.height = totalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const startX = 50;
    let startY = 50;
    const rectWidth = 180;  // Aumentamos el ancho del rectángulo
    const rectHeight = 60;  // Aumentamos el alto del rectángulo
    const verticalSpacing = 120;
    const horizontalSpacing = 250;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // Resetear escala
    ctx.font = '16px Arial'; // Tamaño de fuente más grande

    decisionData.forEach((alternativa) => {
        const alternativaX = startX;
        ctx.fillStyle = '#1a237e';
        ctx.fillRect(alternativaX, startY, rectWidth, rectHeight);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(alternativa.nombreAlternativa, alternativaX + 10, startY + 35);

        let estadoY = startY + verticalSpacing;

        alternativa.estados.forEach((estado) => {
            const estadoX = alternativaX + horizontalSpacing;

            // Dibujar línea
            ctx.strokeStyle = '#0d47a1';
            ctx.beginPath();
            ctx.moveTo(alternativaX + rectWidth, startY + rectHeight / 2);
            ctx.lineTo(estadoX, estadoY + rectHeight / 2);
            ctx.stroke();

            // Dibujar nodo
            ctx.fillStyle = '#ffab00';
            ctx.fillRect(estadoX, estadoY, rectWidth, rectHeight);
            ctx.fillStyle = '#000000';
            ctx.fillText(
                `${estado.nombreEstado}: ${estado.valor.toFixed(2)} (${estado.probabilidad})`,
                estadoX + 5,
                estadoY + 35
            );

            estadoY += verticalSpacing;
        });

        startY += (alternativa.estados.length * verticalSpacing) + 100;
    });
}
