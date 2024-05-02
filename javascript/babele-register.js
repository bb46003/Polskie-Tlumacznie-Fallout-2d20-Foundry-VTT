Hooks.on('init', () => {
    if(typeof Babele !== 'undefined') {
        Babele.get().register({
            module: 'fallout-pl',
            lang: 'pl',
            dir: 'compendium'
        });
    }
});
