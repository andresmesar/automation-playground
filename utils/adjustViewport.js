const adjustViewport = async (browser, width, height) => {
    // Ajustar el tamaño de la ventana para que el viewport tenga las dimensiones deseadas
    await browser.setWindowSize(width, height);

    // Obtener las dimensiones reales del viewport
    const actualViewportSize = await browser.execute(() => {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    });

    // Calcular la diferencia entre el tamaño de la ventana y el tamaño del viewport
    const widthDiff = width - actualViewportSize.width;
    const heightDiff = height - actualViewportSize.height;

    // Ajustar el tamaño de la ventana para compensar la diferencia
    await browser.setWindowSize(width + widthDiff, height + heightDiff);
};

export { adjustViewport };