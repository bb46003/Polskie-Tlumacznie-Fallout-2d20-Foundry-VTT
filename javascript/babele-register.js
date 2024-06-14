class compendiumrefresh {
    static appendHeaderButton(html, fn) {
        let isbutton = html.closest('.app').find('.refresh');
        if (isbutton.length === 0) {
            let openBtn = $(`<a class="refresh" title="Odświerz"><i class="fas fa-sync-alt"></i>Odśwież</a>`);
            openBtn.click(fn);
            html.closest('.app').find('.translate').remove();
            let titleElement = html.closest('.app').find('.window-title');
            openBtn.insertAfter(titleElement);
        }
    }
}

class falloutpl {
  
    static refreshNPC(document) {        
        const aitems=document.object.items;
        aitems.forEach(async element => {
        if (element.type === "skill"){
            let flag = element.flags.core;
            if (flag !== undefined) {
                let fullitemID = flag.sourceID;
                const parts = fullitemID.split(".");
                const compendiumKey = parts[1] + "." + parts[2];
                const itemID = parts[parts.length - 1];
                const pack = game.packs.find(p => p.collection === compendiumKey);
                let  compendiumitem =await pack.getDocument(itemID);
                
                    const currentname = element.name;
                    const compendiumname = compendiumitem.name;
                    if (currentname !== compendiumname){
                        element.update({"name": compendiumname})
                    }
                    const currentdescription = element.system.description;
                    const compendiumdescription = compendiumitem.system.description;
                    if (currentdescription !== compendiumdescription){
                        element.update({"system.description":compendiumdescription})
                    }
                }                     
            }
            
        });
       
    
    }
    static async refreshItem(document) {        
        const aitems=document.object;
        let flag = aitems.flags.core;
            if (flag !== undefined) {
                
                let fullitemID = flag.sourceId;
                const parts = fullitemID.split(".");
                const compendiumKey = parts[1] + "." + parts[2];
                const itemID = parts[parts.length - 1];
                const pack = game.packs.find(p => p.collection === compendiumKey);
                let  compendiumitem =await pack.getDocument(itemID);
                
                    const currentname = aitems.name;
                    const compendiumname = compendiumitem.name;
                    if (currentname !== compendiumname){
                        aitems.update({"name": compendiumname})
                    }
                    const currentdescription = aitems.system.description;
                    const compendiumdescription = compendiumitem.system.description;
                    if (currentdescription !== compendiumdescription){
                        aitems.update({"system.description":compendiumdescription})
                    }
                    if(aitems.type === "perk"){
                        const currentrequierment = aitems.system.requirements;
                        const compendiumrequierment = compendiumitem.system.requirements;
                        if (currentrequierment !== compendiumrequierment){
                            aitems.update({"system.requirements":compendiumrequierment})
                        }
                    }

                }  
    }
    static async localizeAmmo(){
        if(game.babele.packs !== undefined){ 
        const  ammo = game.babele.packs.get("fallout.ammunition");
        const ammunitionArray = Object.entries(ammo.translations).map(([name, data]) => ({ name, ...data }));    
     
        CONFIG.FALLOUT.AMMO_BY_UUID = {};
        let ammoTypes = [];
        for (const ammoType of ammunitionArray) {
            ammoTypes.push(ammoType.name);
            CONFIG.FALLOUT.AMMO_BY_UUID[ammoType.uuid] = ammoType.name;
        }
        ammoTypes = [...new Set(ammoTypes)]; // de-dupe
    
        CONFIG.FALLOUT.AMMO_TYPES = ammoTypes.sort((a, b) => a.localeCompare(b));
    }
}

    
}

Hooks.once('init', async () => {
    if(game.babele !== undefined){
    if (typeof Babele !== 'undefined') {
        game.babele.register({
            module: 'fallout-pl',
            lang: 'pl',
            dir: 'compendium'
        });
    }
}

});



Hooks.once('ready', async () => {
    await game.babele.loadTranslations();
    falloutpl.localizeAmmo();

});


Hooks.on('renderFalloutNpcSheet', (document, html) => {
    compendiumrefresh.appendHeaderButton(html, ev => {
        falloutpl.refreshNPC(document);
    });
});
Hooks.on('renderFalloutItemSheet', (document, html) => {
    compendiumrefresh.appendHeaderButton(html, ev => {
        falloutpl.refreshItem(document);
    });
});


Hooks.on('renderFalloutPcSheet', (document, html) => {
    compendiumrefresh.appendHeaderButton(html, ev => {
        falloutpl.refreshNPC(document);
    });
});

